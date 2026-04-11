import mongoose, { Schema, type InferSchemaType } from 'mongoose';

const categorySchema = new Schema({
   name: {
      type: String,
      required: true,
      trim: true,
   },
   image: {
      type: String,
      required: true,
   },
});

export type TCategory = InferSchemaType<typeof categorySchema>;

const Category = mongoose.model('Category', categorySchema);
export default Category;
