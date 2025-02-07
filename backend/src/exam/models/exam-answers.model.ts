import {
  BelongsTo,
  Column,
  CreatedAt,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { Exam } from './exam.model';
import { Question } from 'src/question/models/question.model';

@Table({ charset: 'utf8mb4' })
export class ExamAnswers extends Model {
  @Column({
    allowNull: false,
    autoIncrement: true,
    unique: true,
    primaryKey: true,
  })
  public id: number;

  @BelongsTo(() => Exam, 'examId')
  exam: Exam;

  @BelongsTo(() => Question, 'questionId')
  question: Question;

  @Column({ allowNull: false })
  answer: string;

  @CreatedAt public createdAt: Date;
  @UpdatedAt public updatedAt: Date;
}
