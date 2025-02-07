import {
  Table,
  Column,
  DataType,
  ForeignKey,
  Model,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import { Topic } from './topic.model';
import { Question } from 'src/question/models/question.model';

@Table({ tableName: 'subtopics' })
export class Subtopic extends Model {
  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @ForeignKey(() => Topic)
  @Column({ type: DataType.INTEGER })
  topicId: number;

  @BelongsTo(() => Topic)
  topic: Topic;

  @HasMany(() => Question)
  questions: Question[];
}
