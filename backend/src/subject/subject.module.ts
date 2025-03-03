import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Subject } from './models/subject.model';
import { SubjectService } from './services/subject.service';
import { SubjectController } from './controllers/subject.controller';

@Module({
  imports: [SequelizeModule.forFeature([Subject])],
  providers: [SubjectService],
  controllers: [SubjectController],
  exports: [SubjectService],
})
export class SubjectModule {}
