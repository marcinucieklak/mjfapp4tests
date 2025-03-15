import {
  BadRequestException,
  Injectable,
  NotFoundException,
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
      isActive: true,
      startDate: createExamDto.startDate
        ? new Date(createExamDto.startDate)
        : null,
      endDate: createExamDto.endDate ? new Date(createExamDto.endDate) : null,
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
        {
          model: ExamSession,
          required: false,
          where: {
            studentId: userId,
          },
          attributes: ['id', 'status', 'score', 'completedAt'],
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

    try {
      await this.examModel.sequelize?.transaction(async (t) => {
        const sessions = await this.examSessionModel.findAll({
          where: { examId: id },
          transaction: t,
        });

        const sessionIds = sessions.map((session) => session.id);

        if (sessionIds.length > 0) {
          await this.examAnswersModel.destroy({
            where: { sessionId: sessionIds },
            transaction: t,
          });
        }

        await this.examSessionModel.destroy({
          where: { examId: id },
          transaction: t,
        });

        await exam.destroy({ transaction: t });
      });

      return { id };
    } catch {
      throw new Error('Failed to delete exam and its related data');
    }
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

    const now = new Date();

    if (exam.startDate && now < exam.startDate) {
      throw new BadRequestException('Exam has not started yet');
    }

    if (exam.endDate && now > exam.endDate) {
      throw new BadRequestException('Exam has ended');
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
      throw new BadRequestException('You have already completed this exam');
    }

    let timeoutAt = null;

    if (exam.timeLimit > 0) {
      timeoutAt = new Date(now.getTime() + exam.timeLimit * 60 * 1000);
    }

    const session = await this.examSessionModel.create({
      examId,
      studentId: userId,
      status: ExamSessionStatus.IN_PROGRESS,
      currentQuestionIndex: 0,
      startedAt: new Date(),
      timeoutAt,
    });

    return this.getSessionWithDetails(session.id);
  }

  async submitAnswer(sessionId: number, userId: number, dto: SubmitAnswerDto) {
    const session = await this.examSessionModel.findOne({
      where: { id: sessionId, studentId: userId },
    });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    if (session.timeoutAt && session.timeoutAt < new Date()) {
      await this.finishExam(sessionId, userId);
      throw new BadRequestException('Exam time has expired');
    }

    if (session.status !== ExamSessionStatus.IN_PROGRESS) {
      throw new BadRequestException('Session is not in progress');
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

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    if (session.status !== ExamSessionStatus.IN_PROGRESS) {
      throw new BadRequestException('Session is not in progress');
    }

    await session.update({
      status: ExamSessionStatus.COMPLETED,
      completedAt: new Date(),
    });

    await this.calculateScore(+sessionId);

    return this.getSessionWithDetails(sessionId);
  }

  async calculateScore(sessionId: number) {
    const session = await this.examSessionModel.findByPk(sessionId, {
      include: [
        {
          model: Exam,
          include: [Question],
        },
        {
          model: ExamAnswers,
        },
      ],
    });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    const totalQuestions = session.exam.questions.length;
    let correctAnswers = 0;
    const answers = [];

    for (const question of session.exam.questions) {
      const userAnswer = session.answers.find(
        (a) => a.questionId === question.id,
      );

      const correctAnswer = question.options[question.correctOption];
      const isCorrect = userAnswer?.answer === correctAnswer;

      if (isCorrect) {
        correctAnswers++;
      }

      answers.push({
        questionId: question.id,
        isCorrect,
        userAnswer: userAnswer?.answer || '',
        correctAnswer,
      });
    }

    const score = Math.round((correctAnswers / totalQuestions) * 100);

    await session.update({
      score,
      status: ExamSessionStatus.COMPLETED,
      completedAt: new Date(),
    });

    return {
      score,
      correctAnswers,
      totalQuestions,
      answers,
    };
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

  async getExamWithSessions(examId: number) {
    const exam = await this.examModel.findOne({
      where: { id: examId },
      include: [
        {
          model: Group,
          attributes: ['id', 'name'],
        },
        {
          model: ExamSession,
          where: {
            status: ExamSessionStatus.COMPLETED,
          },
          required: false,
          include: [
            {
              model: User,
              attributes: ['id', 'name', 'surname'],
            },
          ],
        },
      ],
    });

    if (!exam) {
      throw new NotFoundException('Exam not found');
    }

    return exam;
  }

  async getExamSessionDetails(examId: number, sessionId: number) {
    const session = await this.examSessionModel.findOne({
      where: {
        id: sessionId,
        examId: examId,
      },
      include: [
        {
          model: User,
          as: 'student',
          attributes: ['id', 'name', 'surname'],
        },
        {
          model: Exam,
          include: [
            {
              model: Question,
              through: { attributes: [] },
            },
            {
              model: Group,
              attributes: ['id', 'name'],
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
          as: 'answers',
          attributes: ['questionId', 'answer'],
        },
      ],
    });

    if (!session) {
      throw new NotFoundException('Exam session not found');
    }

    return session;
  }
}
