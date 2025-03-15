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
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { QuestionService } from '../services/question.service';
import { CreateQuestionDto } from '../dtos/create-question.dto';
import { JwtAuthGuard } from 'src/auth';
import { Roles, RolesGuard } from 'src/auth/role.guard';
import { UserType } from 'src/user/enums';
import { FileInterceptor } from '@nestjs/platform-express';
import { imageFileFilter, questionImageStorage } from '../utils';

@Controller('questions')
@UseGuards(JwtAuthGuard, RolesGuard)
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: questionImageStorage,
      fileFilter: imageFileFilter,
    }),
  )
  @Roles(UserType.EXAMINER)
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createQuestionDto: CreateQuestionDto,
    @Request() req,
  ) {
    const dto = {
      ...createQuestionDto,
      imageUrl: file?.filename || null,
    };
    return this.questionService.create(dto, req.user.userId);
  }

  @Get()
  @Roles(UserType.EXAMINER)
  findAll(@Request() req) {
    return this.questionService.findAll(req.user.userId);
  }

  @Put(':id')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: questionImageStorage,
      fileFilter: imageFileFilter,
    }),
  )
  @Roles(UserType.EXAMINER)
  update(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: string,
    @Body() updateQuestionDto: CreateQuestionDto,
  ) {
    const dto = {
      ...updateQuestionDto,
      imageUrl: file?.filename || null,
    };
    return this.questionService.update(+id, dto);
  }

  @Delete(':id')
  @Roles(UserType.EXAMINER)
  remove(@Param('id') id: string) {
    return this.questionService.delete(+id);
  }
}
