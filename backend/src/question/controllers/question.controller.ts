import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { QuestionService } from '../services/question.service';
import { CreateQuestionDto } from '../dtos/create-question.dto';
import { JwtAuthGuard } from 'src/auth';
import { Roles, RolesGuard } from 'src/auth/role.guard';
import { UserType } from 'src/user/enums';

@Controller('questions')
@UseGuards(JwtAuthGuard, RolesGuard)
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Post()
  @Roles(UserType.EXAMINER)
  create(@Request() req, @Body() createQuestionDto: CreateQuestionDto) {
    return this.questionService.create(createQuestionDto, req.user.userId);
  }

  @Get()
  @Roles(UserType.EXAMINER)
  findAll(@Request() req) {
    return this.questionService.findAll(req.user.userId);
  }

  @Put(':id')
  @Roles(UserType.EXAMINER)
  update(
    @Param('id') id: string,
    @Body() updateQuestionDto: CreateQuestionDto,
  ) {
    return this.questionService.update(+id, updateQuestionDto);
  }

  @Delete(':id')
  @Roles(UserType.EXAMINER)
  remove(@Param('id') id: string) {
    return this.questionService.delete(+id);
  }
}
