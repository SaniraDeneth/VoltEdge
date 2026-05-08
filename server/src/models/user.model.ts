import mongoose, { Schema, type HydratedDocument } from 'mongoose';

type User = {
   name: string;
   email: string;
   password?: string;
   role: 'admin' | 'user';
   googleId?: string;
   avatar?: string;
   phone: string;
   shippingAddress: {
      address: string;
      city: string;
      zipCode: string;
   };
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
      phone: {
         type: String,
         default: '',
      },
      shippingAddress: {
         address: { type: String, default: '' },
         city: { type: String, default: '' },
         zipCode: { type: String, default: '' },
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
         // eslint-disable-next-line @typescript-eslint/no-explicit-any
         transform: (_doc, ret: any) => {
            if (ret._id) {
               ret.id = ret._id.toString();
               delete ret._id;
            }
            delete ret.__v;
            delete ret.password;
            return ret;
         },
      },
   }
);

const User = mongoose.model<User>('User', userSchema);
export default User;
