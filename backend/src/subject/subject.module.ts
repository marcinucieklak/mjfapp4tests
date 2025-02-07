import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Subject } from './models/subject.model';

@Module({
  imports: [SequelizeModule.forFeature([Subject])],
})
export class SubjectModule {}
