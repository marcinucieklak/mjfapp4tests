import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Request,
  Logger,
  Put,
} from '@nestjs/common';
import { GroupService } from '../services/group.service';
import { CreateGroupDto } from '../dtos/create-group.dto.user';
import { AddStudentToGroupDto } from '../dtos/add-student-to-group.dto.user';
import { JwtAuthGuard } from 'src/auth';
import { Roles } from 'src/auth/role.guard';
import { UserType } from '../enums';
import { UpdateGroupDto } from '../dtos/update-group.dto';

@Controller('groups')
@UseGuards(JwtAuthGuard)
export class GroupController {
  private logger = new Logger(GroupController.name);

  constructor(private readonly groupService: GroupService) {}

  @Post()
  @Roles(UserType.EXAMINER)
  create(@Request() req, @Body() createGroupDto: CreateGroupDto) {
    return this.groupService.create(createGroupDto, req.user.userId);
  }

  @Get()
  @Roles(UserType.EXAMINER)
  findAll(@Request() req) {
    return this.groupService.findAll(req.user.userId);
  }

  @Put(':id')
  @Roles(UserType.EXAMINER)
  async updateGroup(
    @Param('id') id: string,
    @Request() req,
    @Body() dto: UpdateGroupDto,
  ) {
    return this.groupService.updateGroup(+id, req.user.userId, dto);
  }

  @Delete(':id')
  async deleteGroup(@Param('id') id: string, @Request() req) {
    return this.groupService.deleteGroup(+id, req.user.userId);
  }

  @Get(':id')
  @Roles(UserType.EXAMINER)
  findOne(@Param('id') id: string, @Request() req) {
    return this.groupService.findOne(+id, req.user.userId);
  }

  @Post('add-student')
  @Roles(UserType.EXAMINER)
  addStudent(@Body() addStudentDto: AddStudentToGroupDto) {
    return this.groupService.addStudent(addStudentDto);
  }

  @Delete(':groupId/students/:studentId')
  @Roles(UserType.EXAMINER)
  removeStudent(
    @Param('groupId') groupId: string,
    @Param('studentId') studentId: string,
  ) {
    return this.groupService.removeStudent(+groupId, +studentId);
  }
}
