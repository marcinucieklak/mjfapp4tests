import {
  IsNotEmpty,
  IsString,
  IsArray,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class CreateQuestionDto {
  @IsNotEmpty()
  @IsString()
  text: string;

  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  options: string[];

  @IsNotEmpty()
  @IsNumber()
  correctOption: number;

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
