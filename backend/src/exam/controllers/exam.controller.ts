import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { ExamService } from '../services/exam.service';
import { CreateExamDto } from '../dtos/create-exam.dto';
import { UserType } from '../../user/enums/user-type.enum';
import { JwtAuthGuard } from 'src/auth';
import { RolesGuard, Roles } from 'src/auth/role.guard';

@Controller('exams')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ExamController {
  constructor(private readonly examService: ExamService) {}

  @Post()
  @Roles(UserType.EXAMINER)
  async create(@Request() req, @Body() createExamDto: CreateExamDto) {
    return this.examService.create(createExamDto, req.user.userId);
  }

  @Get()
  @Roles(UserType.EXAMINER)
  async findAll(@Request() req) {
    return this.examService.findAll(req.user.userId);
  }

  @Get(':id')
  @Roles(UserType.EXAMINER)
  async findOne(@Param('id') id: string, @Request() req) {
    return this.examService.findOne(+id, req.user.userId);
  }

  @Get(':id/results')
  @Roles(UserType.EXAMINER)
  async getExamWithSessions(@Param('id', ParseIntPipe) examId: number) {
    return this.examService.getExamWithSessions(examId);
  }

  @Get(':examId/sessions/:sessionId')
  @Roles(UserType.EXAMINER)
  async getExamSessionDetails(
    @Param('examId', ParseIntPipe) examId: number,
    @Param('sessionId', ParseIntPipe) sessionId: number,
  ) {
    return this.examService.getExamSessionDetails(examId, sessionId);
  }

  @Put(':id')
  @Roles(UserType.EXAMINER)
  async update(
    @Param('id') id: string,
    @Body() updateExamDto: CreateExamDto,
    @Request() req,
  ) {
    return this.examService.update(+id, updateExamDto, req.user.userId);
  }

  @Delete(':id')
  @Roles(UserType.EXAMINER)
  async remove(@Param('id') id: string, @Request() req) {
    return this.examService.remove(+id, req.user.userId);
  }
}
