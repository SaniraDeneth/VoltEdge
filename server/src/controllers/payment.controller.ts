import Stripe from 'stripe';
import type { Request, Response, NextFunction } from 'express';
import type { ProtectedRequest } from '../middlewares/auth.middleware.js';
import { AppError } from '../utils/app.error.js';
import { HTTP_STATUS } from '../enums/http.status.js';
import Product from '../models/product.model.js';
import { ENV } from '../config/env.js';

import Order from '../models/order.model.js';

const stripe = new Stripe(ENV.STRIPE_SECRET_KEY, {
   apiVersion: '2026-04-22.dahlia',
});

export const createCheckoutSession = async (
   req: ProtectedRequest,
   res: Response,
   _next: NextFunction
) => {
   const { items, orderId, fromCart } = req.body as {
      items: { productId: string; quantity: number }[];
      orderId: string;
      fromCart?: boolean;
   };

   if (!items || items.length === 0) {
      throw new AppError(
         'No items in checkout',
         HTTP_STATUS.BAD_REQUEST,
         'BAD_REQUEST'
      );
   }

   // Validate that all productIds are present before hitting DB
   const invalidItem = items.find((item) => !item.productId);
   if (invalidItem) {
      throw new AppError(
         'Invalid checkout: one or more items is missing a product ID. Please refresh your cart and try again.',
         HTTP_STATUS.BAD_REQUEST,
         'BAD_REQUEST'
      );
   }

   const lineItems = await Promise.all(
      items.map(async (item) => {
         const product = await Product.findById(item.productId);
         if (!product) {
            throw new AppError(
               `Product not found: ${item.productId}`,
               HTTP_STATUS.NOT_FOUND,
               'PRODUCT_NOT_FOUND'
            );
         }

         return {
            price_data: {
               currency: 'usd',
               product_data: {
                  name: product.name,
                  images: product.images.slice(0, 1),
                  description: product.description,
               },
               unit_amount: Math.round(product.price * 100),
            },
            quantity: item.quantity,
         };
      })
   );

   try {
      const session = await stripe.checkout.sessions.create({
         payment_method_types: ['card'],
         line_items: lineItems,
         mode: 'payment',
         success_url: `${ENV.FRONTEND_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
         cancel_url: `${ENV.FRONTEND_URL}/cart`,
         customer_email: req.user.email,
         metadata: {
            userId: req.user.id,
            orderId,
            fromCart: String(!!fromCart),
            items: JSON.stringify(items),
         },
      });

      return res.status(HTTP_STATUS.OK).json({ url: session.url });
   } catch (error: unknown) {
      const message =
         error instanceof Error
            ? error.message
            : 'Failed to create checkout session';
      console.error('Stripe Session Error:', error);
      throw new AppError(
         message,
         HTTP_STATUS.INTERNAL_SERVER_ERROR,
         'PAYMENT_ERROR'
      );
   }
};

export const verifyPayment = async (
   req: ProtectedRequest,
   res: Response,
   _next: NextFunction
) => {
   const { sessionId } = req.params;

   if (!sessionId) {
      throw new AppError(
         'Session ID is required',
         HTTP_STATUS.BAD_REQUEST,
         'BAD_REQUEST'
      );
   }

   try {
      const session = await stripe.checkout.sessions.retrieve(
         sessionId as string
      );

      if (
         session.payment_status === 'paid' &&
         session.metadata?.userId === req.user.id
      ) {
         const orderId = session.metadata?.orderId;
         const fromCart = session.metadata?.fromCart === 'true';

         if (orderId) {
            const order = await Order.findById(orderId);

            // Only update if not already processing to avoid double triggers
            if (order && order.status === 'pending') {
               await Order.findByIdAndUpdate(orderId, { status: 'processing' });
            }

            return res
               .status(HTTP_STATUS.OK)
               .json({ success: true, status: 'paid', fromCart });
         }
      }

      return res
         .status(HTTP_STATUS.OK)
         .json({ success: false, status: session.payment_status });
   } catch (error: unknown) {
      const message =
         error instanceof Error ? error.message : 'Failed to verify payment';
      console.error('Stripe Verification Error:', error);
      throw new AppError(
         message,
         HTTP_STATUS.INTERNAL_SERVER_ERROR,
         'VERIFICATION_ERROR'
      );
   }
};

export const stripeWebhook = async (req: Request, res: Response) => {
   const sig = req.headers['stripe-signature'] as string;
   let event;

   try {
      // Manual testing bypass for dev mode without CLI
      if (ENV.NODE_ENV === 'dev' && !sig) {
         console.log(
            '⚠️ Manual Webhook testing detected in DEV mode. Bypassing signature verification.'
         );
         event = JSON.parse(req.body.toString());
      } else {
         event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            ENV.STRIPE_WEBHOOK_SECRET
         );
      }
   } catch (err) {
      console.error('Webhook signature verification failed.', err);
      return res
         .status(HTTP_STATUS.BAD_REQUEST)
         .send(
            `Webhook Error: ${err instanceof Error ? err.message : 'Unknown Error'}`
         );
   }

   if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = session.metadata?.orderId;

      if (orderId) {
         await Order.findByIdAndUpdate(orderId, { status: 'processing' });
         console.log(`Order ${orderId} marked as processing via webhook.`);
      }
   }

   return res.status(HTTP_STATUS.OK).json({ received: true });
};
