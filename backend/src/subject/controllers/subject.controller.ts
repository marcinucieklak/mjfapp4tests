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
import { SubjectService } from '../services/subject.service';
import { CreateSubjectDto } from '../dtos/create-subject.dto';
import { JwtAuthGuard } from 'src/auth';
import { Roles, RolesGuard } from 'src/auth/role.guard';
import { UserType } from 'src/user/enums';

@Controller('subjects')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SubjectController {
  constructor(private readonly subjectService: SubjectService) {}

  @Post()
  @Roles(UserType.EXAMINER)
  create(@Request() req, @Body() createSubjectDto: CreateSubjectDto) {
    return this.subjectService.create(createSubjectDto, req.user.userId);
  }

  @Get()
  @Roles(UserType.EXAMINER)
  findAll(@Request() req) {
    return this.subjectService.findAll(req.user.userId);
  }

  @Get(':id/details')
  @Roles(UserType.EXAMINER)
  async getDetails(@Param('id') id: string, @Request() req) {
    return this.subjectService.findOneWithDetails(+id, req.user.userId);
  }

  @Put(':id')
  @Roles(UserType.EXAMINER)
  update(@Param('id') id: string, @Body() updateSubjectDto: CreateSubjectDto) {
    return this.subjectService.update(+id, updateSubjectDto);
  }

  @Delete(':id')
  @Roles(UserType.EXAMINER)
  async remove(@Param('id') id: string) {
    await this.subjectService.delete(+id);
    return { success: true, message: 'Subject deleted successfully' };
  }
}
