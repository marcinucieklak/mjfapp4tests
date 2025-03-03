import {
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { User } from 'src/user/models/user.model';
import { Exam } from './exam.model';
import { ExamAnswers } from './exam-answers.model';

export enum ExamSessionStatus {
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  EXPIRED = 'EXPIRED',
}

@Table({ charset: 'utf8mb4', tableName: 'exam-sessions' })
export class ExamSession extends Model {
  @ForeignKey(() => Exam)
  @Column({ allowNull: false })
  examId: number;

  @BelongsTo(() => Exam)
  exam: Exam;

  @ForeignKey(() => User)
  @Column({ allowNull: false })
  studentId: number;

  @BelongsTo(() => User)
  student: User;

  @Column({
    type: DataType.ENUM(...Object.values(ExamSessionStatus)),
    allowNull: false,
    defaultValue: ExamSessionStatus.IN_PROGRESS,
  })
  status: ExamSessionStatus;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  currentQuestionIndex: number;

  @Column({ type: DataType.DATE, allowNull: true })
  startedAt: Date;

  @Column({ type: DataType.DATE, allowNull: true })
  completedAt: Date;

  @HasMany(() => ExamAnswers)
  answers: ExamAnswers[];

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
