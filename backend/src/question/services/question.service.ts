import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Question } from '../models/question.model';
import { Subject } from '../../subject/models/subject.model';
import { Topic } from '../../topic/models/topic.model';
import { Subtopic } from '../../topic/models/subtopic.model';
import { CreateQuestionDto } from '../dtos/create-question.dto';

@Injectable()
export class QuestionService {
  constructor(
    @InjectModel(Question)
    private questionModel: typeof Question,
  ) {}

  async create(createQuestionDto: CreateQuestionDto, userId: number) {
    return this.questionModel.create({
      ...createQuestionDto,
      createdById: userId,
    });
  }

  async findAll(userId: number) {
    return this.questionModel.findAll({
      where: { createdById: userId },
      include: [{ model: Subject }, { model: Topic }, { model: Subtopic }],
    });
  }

  async update(id: number, updateQuestionDto: CreateQuestionDto) {
    const question = await this.questionModel.findByPk(id);
    if (!question) {
      throw new NotFoundException('Question not found');
    }
    return question.update(updateQuestionDto);
  }

  async delete(id: number) {
    const question = await this.questionModel.findByPk(id);
    if (!question) {
      throw new NotFoundException('Question not found');
    }
    await question.destroy();
  }
}
