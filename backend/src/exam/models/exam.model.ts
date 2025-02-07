import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { ExamType } from './exam-type.model';
import { Question } from 'src/question/models/question.model';

@Table({ charset: 'utf8mb4' })
export class Exam extends Model {
  @Column({ type: DataType.STRING, allowNull: false })
  title: string;

  @ForeignKey(() => ExamType)
  @Column({ type: DataType.INTEGER })
  examTypeId: number;

  @BelongsTo(() => ExamType)
  examType: ExamType;

  @Column({ type: DataType.STRING, allowNull: false })
  questionDisplayMode: string; // 'Sequential', 'List', 'With Return'

  @HasMany(() => Question)
  questions: Question[];
}
