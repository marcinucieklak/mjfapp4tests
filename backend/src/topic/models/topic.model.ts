import {
  Column,
  Model,
  Table,
  ForeignKey,
  BelongsTo,
  HasMany,
  DataType,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';
import { Subject } from '../../subject/models/subject.model';
import { User } from '../../user/models/user.model';
import { Subtopic } from './subtopic.model';

@Table({ charset: 'utf8mb4', tableName: 'topics' })
export class Topic extends Model {
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

  @ForeignKey(() => Subject)
  @Column({ allowNull: false })
  subjectId: number;

  @BelongsTo(() => Subject)
  subject: Subject;

  @ForeignKey(() => User)
  @Column({ allowNull: false })
  createdById: number;

  @BelongsTo(() => User)
  createdBy: User;

  @HasMany(() => Subtopic)
  subtopics: Subtopic[];

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
