import {
  Table,
  Column,
  DataType,
  ForeignKey,
  Model,
  BelongsTo,
} from 'sequelize-typescript';
import { Exam } from 'src/exam/models';
import { Topic, Subtopic } from 'src/topic/models';

@Table({ tableName: 'questions' })
export class Question extends Model {
  @Column({ type: DataType.STRING, allowNull: false })
  text: string;

  @Column({ type: DataType.JSON, allowNull: false })
  options: string[];

  @Column({ type: DataType.INTEGER, allowNull: false })
  correctOption: number;

  @ForeignKey(() => Topic)
  @Column({ type: DataType.INTEGER, allowNull: true })
  topicId: number;

  @ForeignKey(() => Subtopic)
  @Column({ type: DataType.INTEGER, allowNull: true })
  subtopicId: number;

  @ForeignKey(() => Exam)
  @Column({ type: DataType.INTEGER, allowNull: true })
  examId: number;

  @BelongsTo(() => Topic)
  topic: Topic;

  @BelongsTo(() => Subtopic)
  subtopic: Subtopic;
}
