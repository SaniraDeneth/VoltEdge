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
         transform: (_doc, ret) => {
            const { _id: _, __v: __, ...rest } = ret;
            return rest;
         },
      },
   }
);

const Brand = mongoose.model<Brand>('Brand', brandSchema);
export default Brand;
