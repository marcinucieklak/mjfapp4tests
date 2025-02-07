import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Question } from './models/question.model';

@Module({
  imports: [SequelizeModule.forFeature([Question])],
})
export class QuestionModule {}
