import mongoose, { Schema, type InferSchemaType } from 'mongoose';

const orderSchema = new Schema(
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
      status: {
         type: String,
         required: true,
         enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
         default: 'pending',
      },
   },
   {
      timestamps: true,
   }
);

export type Order = InferSchemaType<typeof orderSchema>;

const Order = mongoose.model('Order', orderSchema);
export default Order;
