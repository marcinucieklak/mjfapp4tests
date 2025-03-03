import { Column, Model, Table, ForeignKey } from 'sequelize-typescript';
import { Exam } from './exam.model';
import { Question } from '../../question/models/question.model';

@Table({ tableName: 'exam_questions' })
export class ExamQuestion extends Model {
  @ForeignKey(() => Exam)
  @Column
  examId: number;

  @ForeignKey(() => Question)
  @Column
  questionId: number;

  @Column
  order: number;
}
