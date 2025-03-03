import {
  Column,
  Model,
  Table,
  CreatedAt,
  UpdatedAt,
  HasMany,
  ForeignKey,
  BelongsTo,
  DataType,
} from 'sequelize-typescript';
import { Topic } from '../../topic/models/topic.model';
import { User } from '../../user/models/user.model';

@Table({ charset: 'utf8mb4', tableName: 'subjects' })
export class Subject extends Model {
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

  @ForeignKey(() => User)
  @Column({ allowNull: false })
  createdById: number;

  @BelongsTo(() => User)
  createdBy: User;

  @HasMany(() => Topic)
  topics: Topic[];

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
