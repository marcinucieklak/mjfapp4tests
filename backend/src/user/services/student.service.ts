import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../models/user.model';
import { Group } from '../models/group.model';
import { ExamService } from 'src/exam/services/exam.service';

@Injectable()
export class StudentService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
    @InjectModel(Group)
    private groupModel: typeof Group,
    private examService: ExamService,
  ) {}

  async getMyGroups(userId: number) {
    const user = await this.userModel.findByPk(userId, {
      include: [
        {
          model: Group,
          through: { attributes: [] },
          include: [
            {
              model: User,
              as: 'createdBy',
              attributes: ['id', 'name', 'surname', 'email'],
            },
            {
              model: User,
              as: 'students',
              attributes: ['id', 'name', 'surname', 'email'],
              through: { attributes: [] },
            },
          ],
        },
      ],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user.groups || [];
  }

  async getGroup(groupId: number, userId: number) {
    const group = await this.groupModel.findOne({
      where: { id: groupId },
      include: [
        {
          model: User,
          as: 'students',
          where: { id: userId },
          attributes: ['id', 'name', 'surname', 'email'],
          through: { attributes: [] },
        },
        {
          model: User,
          as: 'createdBy',
          attributes: ['id', 'name', 'surname', 'email'],
        },
      ],
    });

    if (!group) {
      throw new NotFoundException('Group not found or access denied');
    }

    return group;
  }

  getMyExams(userId: number) {
    return this.examService.getMyExams(userId);
  }

  async getExam(examId: number, userId: number) {
    return this.examService.getExam(examId, userId);
  }
}
