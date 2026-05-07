import mongoose, { Schema, type HydratedDocument } from 'mongoose';

type Category = {
   name: string;
};

export type CategoryDocument = HydratedDocument<Category>;

const categorySchema = new Schema<Category>(
   {
      name: {
         type: String,
         required: true,
         trim: true,
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

const Category = mongoose.model<Category>('Category', categorySchema);
export default Category;
