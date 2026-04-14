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

export type TBrand = InferSchemaType<typeof brandSchema>;

const Brand = mongoose.model('Brand', brandSchema);
export default Brand;
