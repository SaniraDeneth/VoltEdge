import mongoose, { Schema, type HydratedDocument } from 'mongoose';

type Product = {
   name: string;
   price: number;
   description: string;
   images: string[];
   categoryId: mongoose.Types.ObjectId;
   brandId: mongoose.Types.ObjectId;
   countInStock: number;
   availability: boolean;
   status: 'brandnew' | 'used' | 'refurbished';
   specifications: { label: string; value: string }[];
   warranty: {
      duration: string;
      policy: string;
   };
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
      images: [
         {
            type: String,
            required: true,
         },
      ],
      categoryId: {
         type: Schema.Types.ObjectId,
         ref: 'Category',
         required: true,
         alias: 'category',
      },
      brandId: {
         type: Schema.Types.ObjectId,
         ref: 'Brand',
         required: true,
         alias: 'brand',
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
      specifications: [
         {
            label: { type: String, required: true },
            value: { type: String, required: true },
         },
      ],
      warranty: {
         duration: { type: String, required: true },
         policy: { type: String, default: 'Standard Warranty' },
      },
   },
   {
      timestamps: true,
      toJSON: {
         virtuals: true,
         versionKey: false,
         // eslint-disable-next-line @typescript-eslint/no-explicit-any
         transform: (_doc, ret: any) => {
            if (ret._id) {
               ret.id = ret._id.toString();
               delete ret._id;
            }
            delete ret.__v;

            if (ret.brandId) {
               ret.brand = ret.brandId;
               delete ret.brandId;
            }
            if (ret.categoryId) {
               ret.category = ret.categoryId;
               delete ret.categoryId;
            }

            return ret;
         },
      },
   }
);

const Product = mongoose.model<Product>('Product', productSchema);
export default Product;
