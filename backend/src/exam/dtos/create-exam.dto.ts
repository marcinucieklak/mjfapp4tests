import {
  IsString,
  IsEnum,
  IsArray,
  IsOptional,
  IsNumber,
  IsDateString,
  Max,
  Min,
} from 'class-validator';
import { DisplayMode } from '../types';

export class CreateExamDto {
  @IsString()
  title: string;

  @IsEnum(DisplayMode)
  questionDisplayMode: DisplayMode;

  @IsNumber()
  @Min(0)
  @Max(180) // Maximum 3 hours
  timeLimit: number;

  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;

  @IsArray()
  @IsNumber({}, { each: true })
  questionIds: number[];

  @IsNumber()
  groupId: number;

  @IsOptional()
  @IsNumber()
  subjectId?: number;

  @IsOptional()
  @IsNumber()
  topicId?: number;

  @IsOptional()
  @IsNumber()
  subtopicId?: number;
}
