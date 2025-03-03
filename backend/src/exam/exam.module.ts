import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Exam, ExamAnswers, ExamQuestion, ExamSession } from './models';
import { ExamService } from './services/exam.service';
import { ExamController } from './controllers/exam.controller';

@Module({
  imports: [
    SequelizeModule.forFeature([Exam, ExamAnswers, ExamQuestion, ExamSession]),
  ],
  controllers: [ExamController],
  providers: [ExamService],
  exports: [ExamService, SequelizeModule],
})
export class ExamModule {}
