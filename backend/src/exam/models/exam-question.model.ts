import {
  BelongsTo,
  Column,
  CreatedAt,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { Exam } from './exam.model';

@Table({ charset: 'utf8mb4' })
export class ExamQuestion extends Model {
  @Column({
    allowNull: false,
    autoIncrement: true,
    unique: true,
    primaryKey: true,
  })
  public id: number;

  @BelongsTo(() => Exam, 'examId')
  exam: Exam;

  @CreatedAt public createdAt: Date;
  @UpdatedAt public updatedAt: Date;
}
