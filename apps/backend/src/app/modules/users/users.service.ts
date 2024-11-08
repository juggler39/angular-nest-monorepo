import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './user.schema';


@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }

  async findAll(): Promise<UserDocument[]> {
    return this.userModel.find().exec();
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.userModel.findOne({ email });
  }

  async findById(userId: string): Promise<User | undefined> {
    return this.userModel.findById(userId);
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async addDevice(userId: string, deviceId: string, refreshToken: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(userId, {
      $push: { devices: { deviceId, refreshToken } },
    });
  }

  async updateDeviceToken(userId: string, deviceId: string, refreshToken: string): Promise<void> {
    await this.userModel.updateOne(
      { _id: userId, 'devices.deviceId': deviceId },
      { $set: { 'devices.$.refreshToken': refreshToken } },
    );
  }

  async removeDevice(userId: string, deviceId: string): Promise<void> {
    console.log("🚀 ~ UsersService ~ removeDevice ~ deviceId:", deviceId)
    console.log("🚀 ~ UsersService ~ removeDevice ~ userId:", userId)
    await this.userModel.findByIdAndUpdate(userId, {
      $pull: { devices: { deviceId } },
    });
  }

  async getDeviceToken(userId: string, deviceId: string): Promise<string | undefined> {
    const user = await this.findById(userId);
    const device = user?.devices.find(d => d.deviceId === deviceId);
    return device?.refreshToken;
  }


  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserDocument> {
    return this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<UserDocument> {
    return this.userModel.findByIdAndDelete(id).exec();
  }
}
