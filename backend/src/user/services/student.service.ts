import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../models/user.model';
import { Group } from '../models/group.model';
import { ExamService } from 'src/exam/services/exam.service';
import { StudentOverviewDto } from '../dtos/student-overview.dto';
import { Exam, ExamSession } from 'src/exam/models';
import { Op } from 'sequelize';

@Injectable()
export class StudentService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
    @InjectModel(Group)
    private groupModel: typeof Group,
    @InjectModel(ExamSession)
    private examSessionModel: typeof ExamSession,
    @InjectModel(Exam)
    private examModel: typeof Exam,
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

  async getOverview(userId: number): Promise<StudentOverviewDto> {
    const activeGroups = await this.groupModel.count({
      include: [
        {
          model: User,
          as: 'students',
          where: { id: userId },
          through: { attributes: [] },
        },
      ],
    });

    const currentDate = new Date();
    const upcomingExams = await this.examModel.count({
      include: [
        {
          model: Group,
          include: [
            {
              model: User,
              as: 'students',
              where: { id: userId },
              through: { attributes: [] },
            },
          ],
        },
        {
          model: ExamSession,
          required: false,
          where: {
            studentId: userId,
          },
        },
      ],
      where: {
        [Op.and]: [
          { '$sessions.id$': null },
          { startDate: { [Op.gt]: currentDate } },
        ],
      },
    });

    const availableExams = await this.examModel.count({
      include: [
        {
          model: Group,
          include: [
            {
              model: User,
              as: 'students',
              where: { id: userId },
              through: { attributes: [] },
            },
          ],
        },
        {
          model: ExamSession,
          as: 'sessions',
          required: false,
          where: {
            studentId: userId,
          },
        },
      ],
      where: {
        [Op.and]: [
          { '$sessions.id$': null },
          {
            [Op.or]: [
              { [Op.and]: [{ startDate: null }, { endDate: null }] },
              {
                [Op.and]: [
                  {
                    [Op.or]: [
                      { startDate: null },
                      { startDate: { [Op.lte]: currentDate } },
                    ],
                  },
                  {
                    [Op.or]: [
                      { endDate: null },
                      { endDate: { [Op.gt]: currentDate } },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    });

    const recentExams = await this.examSessionModel.findAll({
      where: {
        studentId: userId,
        status: 'COMPLETED',
      },
      include: [
        {
          model: Exam,
          attributes: ['title'],
        },
      ],
      order: [['completedAt', 'DESC']],
      limit: 5,
    });

    return {
      activeGroups,
      upcomingExams,
      availableExams,
      recentExams: recentExams.map((session) => ({
        id: session.id,
        title: session.exam.title,
        date: session.completedAt.toISOString(),
        score: `${session.score}%`,
      })),
    };
  }
}
