import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Topic } from './models/topic.model';
import { Subtopic } from './models/subtopic.model';
import { TopicService } from './services/topic.service';
import { TopicController } from './controllers/topic.controller';

@Module({
  imports: [SequelizeModule.forFeature([Topic, Subtopic])],
  providers: [TopicService],
  controllers: [TopicController],
  exports: [TopicService],
})
export class TopicModule {}
