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
