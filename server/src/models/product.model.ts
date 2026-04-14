import mongoose, { Schema, type HydratedDocument } from 'mongoose';

type Product = {
   name: string;
   price: number;
   description: string;
   image: string;
   categoryId: mongoose.Types.ObjectId;
   brandId: mongoose.Types.ObjectId;
   countInStock: number;
   availability: boolean;
   status: 'brandnew' | 'used' | 'refurbished';
};

export type ProductDocument = HydratedDocument<Product>;

const productSchema = new Schema<Product>(
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
         default: true,
      },
      status: {
         type: String,
         enum: ['brandnew', 'used', 'refurbished'],
         default: 'brandnew',
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

const Product = mongoose.model<Product>('Product', productSchema);
export default Product;
