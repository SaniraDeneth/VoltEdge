import mongoose, { Schema, type HydratedDocument } from 'mongoose';

type Brand = {
   name: string;
   image: string;
};

export type BrandDocument = HydratedDocument<Brand>;

const brandSchema = new Schema<Brand>(
   {
      name: {
         type: String,
         required: true,
         trim: true,
      },
      image: {
         type: String,
         required: true,
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
            return ret;
         },
      },
   }
);

const Brand = mongoose.model<Brand>('Brand', brandSchema);
export default Brand;
