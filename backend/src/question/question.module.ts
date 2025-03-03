import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Question } from './models/question.model';
import { QuestionService } from './services/question.service';
import { QuestionController } from './controllers/question.controller';

@Module({
  imports: [SequelizeModule.forFeature([Question])],
  providers: [QuestionService],
  controllers: [QuestionController],
  exports: [QuestionService],
})
export class QuestionModule {}
