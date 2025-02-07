import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Group, User, UserGroup } from './models';

@Module({
  imports: [SequelizeModule.forFeature([User, Group, UserGroup])],
})
export class UserModule {}
