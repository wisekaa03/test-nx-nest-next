import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { UserBase } from '../interfaces/user.base';

@Schema({ collection: 'user', timestamps: true })
export class UserModel extends Document implements UserBase {
  @Prop({ required: true, unique: true })
  username!: string;

  @Prop({ required: true, unique: true })
  email!: string;

  @Prop({ required: true })
  password!: string;
}
export const UserSchema = SchemaFactory.createForClass(UserModel);
