import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Subject } from '../models/subject.model';
import { CreateSubjectDto } from '../dtos/create-subject.dto';
import { Topic } from '../../topic/models/topic.model';
import { Subtopic } from '../../topic/models/subtopic.model';

@Injectable()
export class SubjectService {
  constructor(
    @InjectModel(Subject)
    private subjectModel: typeof Subject,
  ) {}

  async create(createSubjectDto: CreateSubjectDto, userId: number) {
    const existingSubject = await this.subjectModel.findOne({
      where: { name: createSubjectDto.name },
    });

    if (existingSubject) {
      throw new ConflictException('Subject with this name already exists');
    }

    return this.subjectModel.create({
      ...createSubjectDto,
      createdById: userId,
    });
  }

  async findAll(userId: number) {
    const subjects = await this.subjectModel.findAll({
      where: { createdById: userId },
      include: [
        {
          model: Topic,
          attributes: [],
        },
      ],
      attributes: {
        include: [
          [
            this.subjectModel.sequelize.literal(
              '(SELECT COUNT(*) FROM topics WHERE topics.subjectId = Subject.id)',
            ),
            'topicsCount',
          ],
        ],
      },
    });

    return subjects;
  }

  async findOneWithDetails(id: number, userId: number) {
    return this.subjectModel.findOne({
      where: { id, createdById: userId },
      include: [
        {
          model: Topic,
          include: [Subtopic],
        },
      ],
    });
  }

  async update(id: number, updateSubjectDto: CreateSubjectDto) {
    const subject = await this.subjectModel.findByPk(id);
    if (!subject) {
      throw new NotFoundException('Subject not found');
    }

    const existingSubject = await this.subjectModel.findOne({
      where: { name: updateSubjectDto.name },
    });

    if (existingSubject && existingSubject.id !== id) {
      throw new ConflictException('Subject with this name already exists');
    }

    await subject.update(updateSubjectDto);
    return subject;
  }

  async delete(id: number) {
    const subject = await this.subjectModel.findByPk(id);
    if (!subject) {
      throw new NotFoundException('Subject not found');
    }

    await subject.destroy();
  }
}
