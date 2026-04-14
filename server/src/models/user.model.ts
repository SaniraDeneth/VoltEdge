import mongoose, { Schema, type HydratedDocument } from 'mongoose';

type User = {
   name: string;
   email: string;
   password: string;
   role: 'admin' | 'user';
};

export type UserDocument = HydratedDocument<User>;

const userSchema = new Schema<User>(
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
      timestamps: true,
      toJSON: {
         virtuals: true,
         versionKey: false,
         transform: (_doc, ret) => {
            const { _id: _, __v: __, password: ___, ...rest } = ret;
            return rest;
         },
      },
   }
);

const User = mongoose.model<User>('User', userSchema);
export default User;
