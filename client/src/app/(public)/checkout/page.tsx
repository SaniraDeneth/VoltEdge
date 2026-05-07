'use client';

import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { AnimatePresence } from 'framer-motion';
import CheckoutProgress from '@/components/checkout/CheckoutProgress';
import ShippingForm from '@/components/checkout/ShippingForm';
import OrderSummary from '@/components/checkout/OrderSummary';
import { paymentApi, ordersApi } from '@/lib/api-client';
import { toast } from 'react-hot-toast';

export default function CheckoutPage() {
   const { cart, cartTotal, cartCount } = useCart();
   const { user, isAuthenticated } = useAuth();
   const router = useRouter();
   const [step, setStep] = useState(1); // 1: Shipping, 2: Review

   const [shippingData, setShippingData] = useState({
      firstName: user?.name.split(' ')[0] || '',
      lastName: user?.name.split(' ').slice(1).join(' ') || '',
      email: user?.email || '',
      address: '',
      city: '',
      zipCode: '',
      phone: '',
   });

   const handleShippingChange = (field: string, value: string) => {
      setShippingData((prev) => ({ ...prev, [field]: value }));
   };

   const handlePayment = async () => {
      try {
         const items = cart.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
         }));

         // 1. Create Order in our database first
         const order = await ordersApi.create({
            items,
            shippingAddress: {
               address: shippingData.address,
               city: shippingData.city,
               zipCode: shippingData.zipCode,
            },
            contactInfo: {
               firstName: shippingData.firstName,
               lastName: shippingData.lastName,
               email: shippingData.email,
               phone: shippingData.phone,
            },
         });

         // 2. Create Stripe Checkout Session with the orderId
         const { url } = await paymentApi.createCheckoutSession(
            items,
            order.id
         );

         // 3. Redirect to Stripe Checkout
         window.location.href = url;
      } catch (error: unknown) {
         const message =
            error instanceof Error
               ? error.message
               : 'Payment failed to initialize';
         toast.error(message);
         console.error('Payment Error:', error);
      }
   };

   if (!isAuthenticated) {
      router.push('/login?redirect=/checkout');
      return null;
   }

   if (cartCount === 0 && step === 1) {
      router.push('/cart');
      return null;
   }

   return (
      <main className="min-h-screen bg-gradient-hero pt-32 pb-20 px-6">
         <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
               <h1 className="font-display text-5xl md:text-6xl font-bold text-foreground mb-4 tracking-tighter uppercase">
                  Secure <span className="text-accent italic">Checkout</span>
               </h1>
               <p className="text-muted-foreground font-medium">
                  Complete your order and join the VoltEdge elite.
               </p>
            </div>

            <CheckoutProgress currentStep={step} />

            <div className="relative mt-12">
               <AnimatePresence mode="wait">
                  {step === 1 ? (
                     <ShippingForm
                        key="shipping"
                        data={shippingData}
                        onChange={handleShippingChange}
                        onNext={() => setStep(2)}
                     />
                  ) : (
                     <OrderSummary
                        key="summary"
                        cart={cart}
                        total={cartTotal}
                        shippingData={shippingData}
                        onBack={() => setStep(1)}
                        onPay={handlePayment}
                     />
                  )}
               </AnimatePresence>
            </div>
         </div>
      </main>
   );
}
