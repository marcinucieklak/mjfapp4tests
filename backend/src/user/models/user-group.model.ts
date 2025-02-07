import {
  BelongsTo,
  Column,
  CreatedAt,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { Group } from './group.model';
import { User } from './user.model';

@Table({ charset: 'utf8mb4' })
export class UserGroup extends Model {
  @Column({
    allowNull: false,
    autoIncrement: true,
    unique: true,
    primaryKey: true,
  })
  public id: number;

  @BelongsTo(() => Group, 'groupId')
  group: Group;

  @BelongsTo(() => User, 'userId')
  user: User;

  @CreatedAt public createdAt: Date;
  @UpdatedAt public updatedAt: Date;
}
