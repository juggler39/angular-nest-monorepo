import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';

export type UserDocument = User & Document;

class Device {
  @Prop({ required: true })
  deviceId: string;

  @Prop()
  refreshToken: string;
}

@Schema()
export class User {
  @Prop({ type: SchemaTypes.ObjectId, auto: true })
  _id: Types.ObjectId;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  name: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: [Device], default: [] })
  devices: Device[];
}

export const UserSchema = SchemaFactory.createForClass(User);
