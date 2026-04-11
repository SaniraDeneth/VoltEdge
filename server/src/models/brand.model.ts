import mongoose, { Schema, type InferSchemaType } from 'mongoose';

const brandSchema = new Schema(
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
   }
);

export type Brand = InferSchemaType<typeof brandSchema>;

const Brand = mongoose.model('Brand', brandSchema);
export default Brand;
