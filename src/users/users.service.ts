import { Model } from 'mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { SignUpDto } from 'src/auth/dto/sign-up.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  create(createUserDto: SignUpDto) {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  findAll(): Promise<User[]> {
    return this.userModel.find().lean();
  }

  findOne(id: string): Promise<User> {
    return this.userModel.findById(id);
  }

  findOneByEmail(email: string) {
    return this.userModel.findOne({ email });
  }

  async update(id: string, updateUserDto: Partial<SignUpDto>) {
    const user = await this.findOne(id);
    Object.assign(user, updateUserDto);
    return this.userModel.updateOne(user);
  }

  async remove(id: string) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.userModel.deleteOne({ _id: id });
  }
}
