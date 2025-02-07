import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Teacher } from './models/teacher.model';
import { TeacherService } from './teacher.service';

@Module({
  imports: [SequelizeModule.forFeature([Teacher])],
  providers: [TeacherService],
})
export class TeacherModule {}
