import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './entity/users.schema';
import { Model, Types } from 'mongoose';
import { UserResponseDto } from './dto/user-response.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}
  private saltOrRounds = 10;

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const emailExists = await this.userModel.findOne({
      email: createUserDto.email,
    });
    if (emailExists) {
      throw new BadRequestException('This email already exists');
    }
    const hash = await bcrypt.hash(createUserDto.password, this.saltOrRounds);
    const newUser = await this.userModel.create({
      ...createUserDto,
      password: hash,
    });

    const response: UserResponseDto = {
      _id: newUser._id.toString(),
      name: newUser.name,
      email: newUser.email,
      rol: newUser.rol,
    };
    return response;
  }

  async findAll(): Promise<UserResponseDto[]> {
    const list = await this.userModel.find();

    const response: UserResponseDto[] = list.map((user) => ({
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      rol: user.rol,
    }));

    return response;
  }

  async findOne(id: string): Promise<UserResponseDto> {
    const user = await this.userModel.findById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }
    const response: UserResponseDto = {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      rol: user.rol,
    };

    return response;
  }

  async findOneToLogin(email: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const update: UpdateUserDto = { name: updateUserDto?.name };
    const updated = await this.userModel.findOneAndUpdate(
      {
        _id: new Types.ObjectId(id),
      },
      {
        $set: update,
      },
      { new: true },
    );
    if (!updated) {
      throw new NotFoundException('User not found');
    }
    const user: UserResponseDto = {
      name: updated.name,
      _id: updated._id.toString(),
      email: updated.email,
      rol: updated.rol,
    };

    return user;
  }

  async remove(id: string): Promise<void> {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.userModel.deleteOne({ _id: new Types.ObjectId(id) });
  }
}
