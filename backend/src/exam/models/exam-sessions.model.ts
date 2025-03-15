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

type ExamSessionAttributes = {
  id: number;
  examId: number;
  studentId: number;
  status: ExamSessionStatus;
  currentQuestionIndex: number;
  score: number | null;
  startedAt: Date | null;
  completedAt: Date | null;
  timeoutAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

@Table({ charset: 'utf8mb4', tableName: 'exam-sessions' })
export class ExamSession extends Model<ExamSessionAttributes> {
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

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    defaultValue: null,
    validate: {
      min: 0,
      max: 100,
    },
  })
  score: number;

  @Column({ type: DataType.DATE, allowNull: true })
  startedAt: Date;

  @Column({ type: DataType.DATE, allowNull: true })
  completedAt: Date;

  @Column({ type: DataType.DATE, allowNull: true })
  declare timeoutAt: Date | null;

  @Column({
    type: DataType.VIRTUAL,
    get() {
      const timeout = this.getDataValue('timeoutAt');
      if (!timeout) return null;
      return Math.max(0, Math.floor((timeout.getTime() - Date.now()) / 1000));
    },
  })
  declare timeRemaining: number | null;

  @Column({
    type: DataType.VIRTUAL,
    get() {
      const timeRemaining = this.getDataValue('timeRemaining');
      const status = this.getDataValue('status');

      return timeRemaining === 0 && status === ExamSessionStatus.IN_PROGRESS;
    },
  })
  isExpired: boolean;

  isActive(): boolean {
    return (
      this.status === ExamSessionStatus.IN_PROGRESS &&
      (this.timeRemaining === null || this.timeRemaining > 0)
    );
  }

  @HasMany(() => ExamAnswers)
  answers: ExamAnswers[];

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
