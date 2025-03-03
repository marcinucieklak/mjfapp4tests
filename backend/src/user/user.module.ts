import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Group, User, UserGroup } from './models';
import { GroupService, StudentService, UserService } from './services';
import { GroupController, UserController } from './controllers';
import { StudentController } from './controllers/student.controller';
import { ExamModule } from 'src/exam/exam.module';

@Module({
  imports: [SequelizeModule.forFeature([User, Group, UserGroup]), ExamModule],
  providers: [UserService, GroupService, StudentService],
  controllers: [GroupController, UserController, StudentController],
  exports: [UserService],
})
export class UserModule {}
