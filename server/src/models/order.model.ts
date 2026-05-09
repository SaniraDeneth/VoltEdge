import mongoose, { Schema, type HydratedDocument } from 'mongoose';

type Order = {
   userId: mongoose.Types.ObjectId;
   items: {
      productId: mongoose.Types.ObjectId;
      quantity: number;
      price: number;
   }[];
   totalAmount: number;
   shippingAddress: {
      address: string;
      city: string;
      zipCode: string;
   };
   contactInfo: {
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
   };
   status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
   paymentIntentId?: string;
};

export type OrderDocument = HydratedDocument<Order>;

const orderSchema = new Schema<Order>(
   {
      userId: {
         type: Schema.Types.ObjectId,
         ref: 'User',
         required: true,
      },
      items: [
         new Schema(
            {
               productId: {
                  type: Schema.Types.ObjectId,
                  ref: 'Product',
                  required: true,
               },
               quantity: {
                  type: Number,
                  required: true,
                  min: 1,
               },
               price: {
                  type: Number,
                  required: true,
                  min: 0,
               },
            },
            { _id: false }
         ),
      ],
      totalAmount: {
         type: Number,
         required: true,
         min: 0,
      },
      shippingAddress: {
         address: { type: String, required: true },
         city: { type: String, required: true },
         zipCode: { type: String, required: true },
      },
      contactInfo: {
         firstName: { type: String, required: true },
         lastName: { type: String, required: true },
         email: { type: String, required: true },
         phone: { type: String, required: true },
      },
      status: {
         type: String,
         required: true,
         enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
         default: 'pending',
      },
      paymentIntentId: {
         type: String,
      },
   },
   {
      timestamps: true,
      toJSON: {
         virtuals: true,
         versionKey: false,
         transform: (_doc, ret) => {
            const { _id: _, __v: __, ...rest } = ret;
            return rest;
         },
      },
   }
);

const Order = mongoose.model<Order>('Order', orderSchema);
export default Order;
