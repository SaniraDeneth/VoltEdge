import mongoose, { Schema, type HydratedDocument } from 'mongoose';

type User = {
   name: string;
   email: string;
   password?: string;
   role: 'admin' | 'user';
   googleId?: string;
   avatar?: string;
   authProvider: 'local' | 'google';
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
         required: function (this: User) {
            return this.authProvider === 'local';
         },
      },
      role: {
         type: String,
         required: true,
         enum: ['admin', 'user'],
         default: 'user',
      },
      googleId: {
         type: String,
         unique: true,
         sparse: true,
      },
      avatar: {
         type: String,
      },
      authProvider: {
         type: String,
         enum: ['local', 'google'],
         default: 'local',
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
