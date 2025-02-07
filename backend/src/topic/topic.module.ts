import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Subtopic, Topic } from './models';

@Module({
  imports: [SequelizeModule.forFeature([Topic, Subtopic])],
})
export class TopicModule {}
