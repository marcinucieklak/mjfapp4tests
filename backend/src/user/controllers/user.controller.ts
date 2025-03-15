import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth';
import { UserService } from '../services';
import { Roles } from 'src/auth/role.guard';
import { UserType } from '../enums';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('students')
  async getStudents() {
    return this.userService.findStudents();
  }

  @Get('dashboard/overview')
  @Roles(UserType.EXAMINER)
  async getDashboardOverview(@Request() req) {
    return this.userService.getDashboardOverview(req.user.userId);
  }
}
