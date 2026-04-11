import mongoose, { Schema, type InferSchemaType } from 'mongoose';

const productSchema = new Schema(
   {
      name: {
         type: String,
         required: true,
         trim: true,
      },
      price: {
         type: Number,
         required: true,
         min: 0,
      },
      description: {
         type: String,
         required: true,
      },
      image: {
         type: String,
         required: true,
      },
      categoryId: {
         type: Schema.Types.ObjectId,
         ref: 'Category',
         required: true,
      },
      brandId: {
         type: Schema.Types.ObjectId,
         ref: 'Brand',
         required: true,
      },
      countInStock: {
         type: Number,
         required: true,
         min: 0,
      },
      availability: {
         type: Boolean,
         required: true,
         default: true,
      },
      status: {
         type: String,
         required: true,
         enum: ['brandnew', 'used', 'refurbished'],
         default: 'brandnew',
      },
   },
   {
      timestamps: true,
   }
);

export type Product = InferSchemaType<typeof productSchema>;

const Product = mongoose.model('Product', productSchema);
export default Product;
