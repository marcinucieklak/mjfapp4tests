import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Exam, ExamAnswers, ExamQuestion } from './models';
import { ExamType } from './models/exam-type.model';

@Module({
  imports: [
    SequelizeModule.forFeature([Exam, ExamQuestion, ExamType, ExamAnswers]),
  ],
})
export class ExamModule {}
