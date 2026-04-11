import mongoose, { Schema, type InferSchemaType } from 'mongoose';

const cartModel = new Schema(
   {
      userId: {
         type: Schema.Types.ObjectId,
         ref: 'User',
         required: true,
      },
      items: [
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
      ],
      totalAmount: {
         type: Number,
         required: true,
         min: 0,
      },
   },
   {
      timestamps: true,
   }
);

export type Cart = InferSchemaType<typeof cartModel>;

const Cart = mongoose.model('Cart', cartModel);
export default Cart;
