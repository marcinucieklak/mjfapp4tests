import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as bcrypt from 'bcrypt';
import { Group, User } from '../models';
import { UserType } from '../enums';
import { Subject } from 'src/subject/models/subject.model';
import { Exam } from 'src/exam/models';
import { Question } from 'src/question/models/question.model';
import { Topic } from 'src/topic/models';
import { DashboardOverviewDto } from '../dtos/dashboard-overview.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
    @InjectModel(Subject)
    private subjectModel: typeof Subject,
    @InjectModel(Topic)
    private topicModel: typeof Topic,
    @InjectModel(Question)
    private questionModel: typeof Question,
    @InjectModel(Exam)
    private examModel: typeof Exam,
    @InjectModel(Group)
    private groupModel: typeof Group,
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

  async getDashboardOverview(userId: number): Promise<DashboardOverviewDto> {
    const [
      totalSubjects,
      totalTopics,
      totalQuestions,
      totalExams,
      activeGroups,
    ] = await Promise.all([
      this.subjectModel.count({
        where: { createdById: userId },
      }),
      this.topicModel.count({
        where: { createdById: userId },
      }),
      this.questionModel.count({
        where: { createdById: userId },
      }),
      this.examModel.count({
        where: { createdById: userId },
      }),
      this.groupModel.count({
        where: { createdById: userId },
      }),
    ]);

    return {
      totalSubjects,
      totalTopics,
      totalQuestions,
      totalExams,
      activeGroups,
    };
  }
}
