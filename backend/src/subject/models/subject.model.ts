import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { Teacher } from 'src/teacher/models/teacher.model';
import { Topic } from 'src/topic/models';

@Table({ tableName: 'subjects' })
export class Subject extends Model {
  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @ForeignKey(() => Teacher)
  @Column({ type: DataType.INTEGER })
  teacherId: number;

  @BelongsTo(() => Teacher)
  teacher: Teacher;

  @HasMany(() => Topic)
  topics: Topic[];
}
