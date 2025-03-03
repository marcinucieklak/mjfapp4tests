import {
  BelongsTo,
  Column,
  CreatedAt,
  ForeignKey,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { ExamSession } from './exam-sessions.model';
import { Question } from 'src/question/models/question.model';

@Table({ charset: 'utf8mb4', tableName: 'exam-answers' })
export class ExamAnswers extends Model {
  @ForeignKey(() => ExamSession)
  @Column({ allowNull: false })
  sessionId: number;

  @BelongsTo(() => ExamSession)
  session: ExamSession;

  @ForeignKey(() => Question)
  @Column({ allowNull: false })
  questionId: number;

  @BelongsTo(() => Question)
  question: Question;

  @Column({ allowNull: false })
  answer: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
