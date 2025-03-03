import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Topic } from '../models/topic.model';
import { Subtopic } from '../models/subtopic.model';
import { CreateTopicDto } from '../dtos/create-topic.dto';
import { CreateSubtopicDto } from '../dtos/create-subtopic.dto';
import { UpdateTopicDto } from '../dtos';
import { Op } from 'sequelize';

@Injectable()
export class TopicService {
  constructor(
    @InjectModel(Topic)
    private topicModel: typeof Topic,
    @InjectModel(Subtopic)
    private subtopicModel: typeof Subtopic,
  ) {}

  async create(createTopicDto: CreateTopicDto, userId: number) {
    const existingTopic = await this.topicModel.findOne({
      where: { name: createTopicDto.name, subjectId: createTopicDto.subjectId },
    });

    if (existingTopic) {
      throw new ConflictException(
        'Topic with this name already exists in the subject',
      );
    }

    return this.topicModel.create({
      ...createTopicDto,
      createdById: userId,
    });
  }

  async findAll(userId: number) {
    return this.topicModel.findAll({
      where: { createdById: userId },
      include: [{ model: Subtopic }],
    });
  }

  async createSubtopic(createSubtopicDto: CreateSubtopicDto) {
    const topic = await this.topicModel.findByPk(createSubtopicDto.topicId, {
      include: [{ model: Subtopic }],
    });

    if (!topic) {
      throw new NotFoundException('Topic not found');
    }

    const existingSubtopic = topic.subtopics?.find(
      (st) => st.name === createSubtopicDto.name,
    );

    if (existingSubtopic) {
      throw new ConflictException(
        'Subtopic with this name already exists in this topic',
      );
    }

    try {
      const subtopicData = {
        name: createSubtopicDto.name,
        description: createSubtopicDto.description,
        topicId: createSubtopicDto.topicId,
      };

      await this.subtopicModel.create(subtopicData);

      const updatedTopic = await this.topicModel.findByPk(
        createSubtopicDto.topicId,
        {
          include: [{ model: Subtopic }],
        },
      );

      return updatedTopic;
    } catch {
      throw new Error('Failed to create subtopic');
    }
  }

  async updateTopic(id: number, updateTopicDto: UpdateTopicDto) {
    const topic = await this.topicModel.findByPk(id);
    if (!topic) {
      throw new NotFoundException('Topic not found');
    }

    const existingTopic = await this.topicModel.findOne({
      where: {
        name: updateTopicDto.name,
        subjectId: topic.subjectId,
        id: { [Op.ne]: id },
      },
    });

    if (existingTopic) {
      throw new ConflictException(
        'Topic with this name already exists in this subject',
      );
    }

    await topic.update(updateTopicDto);
    return topic.reload({ include: [{ model: Subtopic }] });
  }

  async updateSubtopic(
    topicId: number,
    subtopicId: number,
    updateSubtopicDto: UpdateTopicDto,
  ) {
    const subtopic = await this.subtopicModel.findOne({
      where: { id: subtopicId, topicId },
    });

    if (!subtopic) {
      throw new NotFoundException('Subtopic not found');
    }

    const existingSubtopic = await this.subtopicModel.findOne({
      where: {
        name: updateSubtopicDto.name,
        topicId,
        id: { [Op.ne]: subtopicId },
      },
    });

    if (existingSubtopic) {
      throw new ConflictException(
        'Subtopic with this name already exists in this topic',
      );
    }

    await subtopic.update(updateSubtopicDto);
    return this.topicModel.findByPk(topicId, {
      include: [{ model: Subtopic }],
    });
  }

  async deleteSubtopic(topicId: number, subtopicId: number) {
    const subtopic = await this.subtopicModel.findOne({
      where: { id: subtopicId, topicId },
    });

    if (!subtopic) {
      throw new NotFoundException('Subtopic not found');
    }

    await subtopic.destroy();
  }

  async delete(id: number) {
    const topic = await this.topicModel.findByPk(id);
    if (!topic) {
      throw new NotFoundException('Topic not found');
    }

    await topic.destroy();
  }
}
