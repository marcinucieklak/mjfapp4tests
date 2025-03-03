import {
  IsString,
  IsEnum,
  IsArray,
  IsOptional,
  IsNumber,
} from 'class-validator';
import { DisplayMode } from '../types';

export class CreateExamDto {
  @IsString()
  title: string;

  @IsEnum(DisplayMode)
  questionDisplayMode: DisplayMode;

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
