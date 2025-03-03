import { IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator';

export class UpdateTopicDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  subjectId: number;
}
