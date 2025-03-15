import {
  Injectable,
  NotFoundException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Group } from '../models/group.model';
import { User } from '../models/user.model';
import { CreateGroupDto } from '../dtos/create-group.dto.user';
import { AddStudentToGroupDto } from '../dtos/add-student-to-group.dto.user';
import { UpdateGroupDto } from '../dtos/update-group.dto';

@Injectable()
export class GroupService {
  private logger = new Logger(GroupService.name);

  constructor(
    @InjectModel(Group)
    private groupModel: typeof Group,
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  async create(createGroupDto: CreateGroupDto, userId: number) {
    this.logger.debug(
      `Creating group with name: ${createGroupDto.name} ${userId}`,
    );
    const existingGroup = await this.groupModel.findOne({
      where: { name: createGroupDto.name },
    });

    if (existingGroup) {
      throw new ConflictException('Group with this name already exists');
    }

    return this.groupModel.create({
      ...createGroupDto,
      createdById: userId,
    });
  }

  async findAll(userId: number): Promise<Group[]> {
    return this.groupModel.findAll({
      where: {
        createdById: userId,
      },
      include: [
        {
          model: User,
          as: 'students',
          attributes: ['id', 'name', 'surname', 'email'],
        },
      ],
    });
  }

  async findOne(id: number, userId: number): Promise<Group> {
    return this.groupModel.findOne({
      where: {
        id,
        createdById: userId,
      },
      include: [
        {
          model: User,
          as: 'students',
          attributes: ['id', 'name', 'surname', 'email'],
        },
      ],
    });
  }

  async updateGroup(id: number, userId: number, dto: UpdateGroupDto) {
    const group = await this.groupModel.findOne({
      where: { id, createdById: userId },
    });

    if (!group) {
      throw new NotFoundException('Group not found or access denied');
    }

    await group.update({ name: dto.name });

    return this.findOne(id, userId);
  }

  async deleteGroup(id: number, userId: number) {
    const group = await this.groupModel.findOne({
      where: { id, createdById: userId },
      include: [
        {
          model: User,
          as: 'students',
          through: { attributes: [] },
        },
      ],
    });

    if (!group) {
      throw new NotFoundException('Group not found or access denied');
    }

    const associatedExams = await group.sequelize.models.Exam.count({
      where: { groupId: id },
    });

    if (associatedExams > 0) {
      throw new ConflictException(
        'Cannot delete group that has associated exams. Please delete the exams first.',
      );
    }

    try {
      await this.groupModel.sequelize?.transaction(async (t) => {
        await group.$remove('students', group.students, { transaction: t });
        await group.destroy({ transaction: t });
      });
    } catch (error) {
      this.logger.error(`Failed to delete group: ${error.message}`);
      throw new Error('Failed to delete group and its related data');
    }

    return { id };
  }

  async addStudent(dto: AddStudentToGroupDto) {
    const group = await this.groupModel.findByPk(dto.groupId);
    if (!group) {
      throw new NotFoundException('Group not found');
    }

    const student = await this.userModel.findByPk(dto.studentId);
    if (!student) {
      throw new NotFoundException('Student not found');
    }

    await group.$add('students', student);
    return group;
  }

  async removeStudent(groupId: number, studentId: number) {
    const group = await this.groupModel.findByPk(groupId);
    if (!group) {
      throw new NotFoundException('Group not found');
    }

    const student = await this.userModel.findByPk(studentId);
    if (!student) {
      throw new NotFoundException('Student not found');
    }

    await group.$remove('students', student);
    return group;
  }
}
