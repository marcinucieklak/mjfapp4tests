import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Request,
  Put,
} from '@nestjs/common';
import { TopicService } from '../services/topic.service';
import { CreateTopicDto } from '../dtos/create-topic.dto';
import { CreateSubtopicDto } from '../dtos/create-subtopic.dto';
import { JwtAuthGuard } from 'src/auth';
import { UpdateTopicDto } from '../dtos';
import { Roles, RolesGuard } from 'src/auth/role.guard';
import { UserType } from 'src/user/enums';

@Controller('topics')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TopicController {
  constructor(private readonly topicService: TopicService) {}

  @Post()
  @Roles(UserType.EXAMINER)
  create(@Request() req, @Body() createTopicDto: CreateTopicDto) {
    return this.topicService.create(createTopicDto, req.user.userId);
  }

  @Get()
  @Roles(UserType.EXAMINER)
  findAll(@Request() req) {
    return this.topicService.findAll(req.user.userId);
  }

  @Post('subtopics')
  @Roles(UserType.EXAMINER)
  createSubtopic(@Body() createSubtopicDto: CreateSubtopicDto) {
    return this.topicService.createSubtopic(createSubtopicDto);
  }

  @Put(':id')
  @Roles(UserType.EXAMINER)
  updateTopic(@Param('id') id: string, @Body() updateTopicDto: UpdateTopicDto) {
    return this.topicService.updateTopic(+id, updateTopicDto);
  }

  @Put(':topicId/subtopics/:subtopicId')
  @Roles(UserType.EXAMINER)
  updateSubtopic(
    @Param('topicId') topicId: string,
    @Param('subtopicId') subtopicId: string,
    @Body() updateSubtopicDto: UpdateTopicDto,
  ) {
    return this.topicService.updateSubtopic(
      +topicId,
      +subtopicId,
      updateSubtopicDto,
    );
  }

  @Delete(':topicId/subtopics/:subtopicId')
  @Roles(UserType.EXAMINER)
  deleteSubtopic(
    @Param('topicId') topicId: string,
    @Param('subtopicId') subtopicId: string,
  ) {
    return this.topicService.deleteSubtopic(+topicId, +subtopicId);
  }

  @Delete(':id')
  @Roles(UserType.EXAMINER)
  delete(@Param('id') id: string) {
    return this.topicService.delete(+id);
  }
}
