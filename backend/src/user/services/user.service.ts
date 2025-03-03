import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as bcrypt from 'bcrypt';
import { User } from '../models';
import { UserType } from '../enums';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.userModel.findOne({
      where: { email },
    });

    return user;
  }

  async findOne(id: number): Promise<User | null> {
    return this.userModel.findByPk(id);
  }

  async create(userData: {
    email: string;
    password: string;
    name: string;
  }): Promise<User> {
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    return this.userModel.create({
      ...userData,
      password: hashedPassword,
    });
  }

  async findStudents() {
    return this.userModel.findAll({
      where: {
        type: UserType.STUDENT,
      },
      attributes: ['id', 'name', 'surname', 'type', 'email'],
    });
  }
}
