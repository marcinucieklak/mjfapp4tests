import { IsNotEmpty, IsNumber } from 'class-validator';

export class AddStudentToGroupDto {
  @IsNotEmpty()
  @IsNumber()
  studentId: number;

  @IsNotEmpty()
  @IsNumber()
  groupId: number;
}
