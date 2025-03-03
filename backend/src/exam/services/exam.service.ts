import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Exam } from '../models/exam.model';
import { Question } from '../../question/models/question.model';
import { Subject } from '../../subject/models/subject.model';
import { Topic } from '../../topic/models/topic.model';
import { Subtopic } from '../../topic/models/subtopic.model';
import { CreateExamDto } from '../dtos/create-exam.dto';
import { Group, User } from 'src/user/models';
import { ExamAnswers, ExamSession, ExamSessionStatus } from '../models';
import { SubmitAnswerDto } from '../dtos/submit-answer.dto';

@Injectable()
export class ExamService {
  constructor(
    @InjectModel(Exam)
    private examModel: typeof Exam,
    @InjectModel(ExamSession)
    private examSessionModel: typeof ExamSession,
    @InjectModel(ExamAnswers)
    private examAnswersModel: typeof ExamAnswers,
  ) {}

  async create(createExamDto: CreateExamDto, userId: number) {
    const exam = await this.examModel.create({
      ...createExamDto,
      createdById: userId,
    });

    if (createExamDto.questionIds?.length) {
      await exam.$set('questions', createExamDto.questionIds);
    }

    return this.findOne(exam.id, userId);
  }

  async findAll(userId: number) {
    return this.examModel.findAll({
      where: { createdById: userId },
      include: [
        {
          model: Question,
          through: { attributes: ['order'] },
        },
        Subject,
        Topic,
        Subtopic,
      ],
    });
  }

  async findOne(id: number, userId: number) {
    return this.examModel.findOne({
      where: { id, createdById: userId },
      include: [
        {
          model: Question,
          through: { attributes: ['order'] },
        },
        Subject,
        Topic,
        Subtopic,
      ],
    });
  }

  async getMyExams(userId: number) {
    const exams = await this.examModel.findAll({
      include: [
        {
          model: Group,
          required: true,
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
          model: User,
          as: 'createdBy',
          attributes: ['id', 'name', 'surname'],
        },
      ],
    });

    return exams;
  }

  async getExam(examId: number, userId: number) {
    const exam = await this.examModel.findOne({
      where: { id: examId },
      include: [
        {
          model: Group,
          required: true,
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
          model: User,
          as: 'createdBy',
          attributes: ['id', 'name', 'surname'],
        },
      ],
    });

    if (!exam) {
      throw new NotFoundException('Exam not found or access denied');
    }

    return exam;
  }

  async update(id: number, updateExamDto: CreateExamDto, userId: number) {
    const exam = await this.findOne(id, userId);

    await exam.update({
      ...updateExamDto,
      questionIds: undefined,
    });

    if (updateExamDto.questionIds?.length) {
      await exam.$set('questions', updateExamDto.questionIds);
    }

    return this.findOne(id, userId);
  }

  async remove(id: number, userId: number) {
    const exam = await this.findOne(id, userId);

    if (!exam) {
      throw new NotFoundException(`Exam with ID ${id} not found`);
    }

    await exam.destroy();
    return { id };
  }

  async startExam(examId: number, userId: number) {
    const exam = await this.examModel.findOne({
      where: { id: examId },
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
          model: Question,
          through: { attributes: [] },
        },
        {
          model: User,
          as: 'createdBy',
          attributes: ['id', 'name', 'surname'],
        },
      ],
    });

    if (!exam) {
      throw new NotFoundException('Exam not found or access denied');
    }

    const existingSession = await this.examSessionModel.findOne({
      where: {
        examId,
        studentId: userId,
      },
    });

    if (existingSession) {
      if (existingSession.status === ExamSessionStatus.IN_PROGRESS) {
        return this.getSessionWithDetails(existingSession.id);
      }
      throw new UnauthorizedException('You have already completed this exam');
    }

    const session = await this.examSessionModel.create({
      examId,
      studentId: userId,
      status: ExamSessionStatus.IN_PROGRESS,
      currentQuestionIndex: 0,
      startedAt: new Date(),
    });

    return this.getSessionWithDetails(session.id);
  }

  async submitAnswer(sessionId: number, userId: number, dto: SubmitAnswerDto) {
    const session = await this.examSessionModel.findOne({
      where: { id: sessionId, studentId: userId },
    });

    if (!session || session.status !== ExamSessionStatus.IN_PROGRESS) {
      throw new UnauthorizedException('Invalid session or session expired');
    }

    await this.examAnswersModel.create({
      sessionId,
      questionId: dto.questionId,
      answer: dto.answer,
    });

    return this.getSessionWithDetails(sessionId);
  }

  async finishExam(sessionId: number, userId: number) {
    const session = await this.examSessionModel.findOne({
      where: { id: sessionId, studentId: userId },
    });

    if (!session || session.status !== ExamSessionStatus.IN_PROGRESS) {
      throw new UnauthorizedException('Invalid session or session expired');
    }

    await session.update({
      status: ExamSessionStatus.COMPLETED,
      completedAt: new Date(),
    });

    return this.getSessionWithDetails(sessionId);
  }

  private async getSessionWithDetails(sessionId: number) {
    return this.examSessionModel.findOne({
      where: { id: sessionId },
      include: [
        {
          model: Exam,
          include: [
            {
              model: Question,
              through: { attributes: [] },
            },
            {
              model: Group,
            },
            {
              model: User,
              as: 'createdBy',
              attributes: ['id', 'name', 'surname'],
            },
          ],
        },
        {
          model: ExamAnswers,
          include: [Question],
        },
      ],
    });
  }
}
