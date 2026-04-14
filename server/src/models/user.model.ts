import mongoose, { Schema, type InferSchemaType } from 'mongoose';

const userSchema = new Schema(
   {
      name: {
         type: String,
         required: true,
         trim: true,
      },
      email: {
         type: String,
         required: true,
         trim: true,
         unique: true,
      },
      password: {
         type: String,
         required: true,
      },
      role: {
         type: String,
         required: true,
         enum: ['admin', 'user'],
         default: 'user',
      },
   },
   {
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

export type TUser = InferSchemaType<typeof userSchema>;

const User = mongoose.model('User', userSchema);
export default User;
