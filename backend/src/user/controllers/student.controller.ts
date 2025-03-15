import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/auth/role.guard';
import { UserType } from '../enums';
import { JwtAuthGuard } from 'src/auth';
import { StudentService } from '../services';
import { SubmitAnswerDto } from 'src/exam/dtos/submit-answer.dto';
import { ExamService } from 'src/exam/services/exam.service';

@Controller('students')
@UseGuards(JwtAuthGuard)
export class StudentController {
  constructor(
    private readonly studentService: StudentService,
    private readonly examService: ExamService,
  ) {}

  @Get('groups')
  @Roles(UserType.STUDENT)
  async getMyGroups(@Request() req) {
    return this.studentService.getMyGroups(req.user.userId);
  }

  @Get('exams')
  @Roles(UserType.STUDENT)
  async getMyExams(@Request() req) {
    return this.studentService.getMyExams(req.user.userId);
  }

  @Get('overview')
  @Roles(UserType.STUDENT)
  async getOverview(@Request() req) {
    return this.studentService.getOverview(req.user.userId);
  }

  @Get('exams/:id')
  async getExam(@Param('id') id: string, @Request() req) {
    return this.studentService.getExam(+id, req.user.userId);
  }

  @Get('exams/:id/availability')
  async checkAvailability(@Param('id') id: string, @Request() req) {
    const exam = await this.examService.getExam(+id, req.user.userId);

    if (!exam) {
      throw new NotFoundException(`Exam with ID ${id} not found`);
    }

    const now = new Date();

    return {
      canStart:
        exam.isActive &&
        (!exam.startDate || now >= exam.startDate) &&
        (!exam.endDate || now <= exam.endDate),
      startDate: exam.startDate,
      endDate: exam.endDate,
      timeLimit: exam.timeLimit,
    };
  }

  @Post('exam-sessions/:examId/start')
  async startExam(@Param('examId') examId: string, @Request() req) {
    return this.examService.startExam(+examId, req.user.userId);
  }

  @Post('exam-sessions/:sessionId/answers')
  async submitAnswer(
    @Param('sessionId') sessionId: string,
    @Body() dto: SubmitAnswerDto,
    @Request() req,
  ) {
    return this.examService.submitAnswer(+sessionId, req.user.userId, dto);
  }

  @Post('exam-sessions/:sessionId/finish')
  async finishExam(@Param('sessionId') sessionId: string, @Request() req) {
    return this.examService.finishExam(+sessionId, req.user.userId);
  }
}
