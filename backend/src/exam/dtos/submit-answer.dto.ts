import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class SubmitAnswerDto {
  @IsNotEmpty()
  @IsNumber()
  questionId: number;

  @IsNotEmpty()
  @IsString()
  answer: string;
}
