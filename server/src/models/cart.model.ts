import mongoose, { Schema, type HydratedDocument } from 'mongoose';

type Cart = {
   userId: mongoose.Types.ObjectId;
   items: {
      productId: mongoose.Types.ObjectId;
      quantity: number;
      price: number;
   }[];
   totalAmount: number;
};

export type CartDocument = HydratedDocument<Cart>;

const cartModel = new Schema<Cart>(
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

const Cart = mongoose.model<Cart>('Cart', cartModel);
export default Cart;
