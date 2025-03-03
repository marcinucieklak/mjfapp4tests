import {
  Column,
  Model,
  Table,
  ForeignKey,
  BelongsTo,
  DataType,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';
import { Topic } from './topic.model';

@Table({ charset: 'utf8mb4', tableName: 'subtopics' })
export class Subtopic extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description: string;

  @ForeignKey(() => Topic)
  @Column({ allowNull: false })
  topicId: number;

  @BelongsTo(() => Topic)
  topic: Topic;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
