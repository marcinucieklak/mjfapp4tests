import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Group, User, UserGroup } from './models';
import { GroupService, StudentService, UserService } from './services';
import { GroupController, UserController } from './controllers';
import { StudentController } from './controllers/student.controller';
import { ExamModule } from 'src/exam/exam.module';
import { Subject } from 'src/subject/models/subject.model';
import { Topic } from 'src/topic/models';
import { Question } from 'src/question/models/question.model';
import { Exam } from 'src/exam/models';

@Module({
  imports: [
    SequelizeModule.forFeature([
      User,
      Group,
      UserGroup,
      Subject,
      Topic,
      Question,
      Exam,
    ]),
    ExamModule,
  ],
  providers: [UserService, GroupService, StudentService],
  controllers: [GroupController, UserController, StudentController],
  exports: [UserService],
})
export class UserModule {}
