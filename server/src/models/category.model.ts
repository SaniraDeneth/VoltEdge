import mongoose, { Schema, type HydratedDocument } from 'mongoose';

type Category = {
   name: string;
   image: string;
};

export type CategoryDocument = HydratedDocument<Category>;

const categorySchema = new Schema<Category>(
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

const Category = mongoose.model<Category>('Category', categorySchema);
export default Category;
