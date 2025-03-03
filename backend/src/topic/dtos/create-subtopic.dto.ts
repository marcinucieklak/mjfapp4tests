import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateSubtopicDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsNumber()
  topicId: number;
}
