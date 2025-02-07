import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Teacher } from './models/teacher.model';
import { Subject } from 'src/subject/models/subject.model';

@Injectable()
export class TeacherService {
  constructor(
    @InjectModel(Teacher)
    private teacherModel: typeof Teacher,
  ) {}

  async createTeacher(name: string): Promise<Teacher> {
    return this.teacherModel.create({ name });
  }

  async getAllTeachers(): Promise<Teacher[]> {
    return this.teacherModel.findAll({ include: [Subject] });
  }

  async findTeacherById(id: number): Promise<Teacher | null> {
    return this.teacherModel.findByPk(id, { include: [Subject] });
  }

  async updateTeacher(id: number, name: string): Promise<[number, Teacher[]]> {
    return this.teacherModel.update(
      { name },
      { where: { id }, returning: true },
    );
  }

  async deleteTeacher(id: number): Promise<void> {
    await this.teacherModel.destroy({ where: { id } });
  }
}
