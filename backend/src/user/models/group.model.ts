import {
  Column,
  CreatedAt,
  Model,
  Table,
  UpdatedAt,
  ForeignKey,
  BelongsTo,
  BelongsToMany,
} from 'sequelize-typescript';
import { User } from './user.model';
import { UserGroup } from './user-group.model';

@Table({ charset: 'utf8mb4', tableName: 'groups' })
export class Group extends Model {
  @Column({
    allowNull: false,
    autoIncrement: true,
    unique: true,
    primaryKey: true,
  })
  public id: number;

  @Column({ allowNull: false, unique: true })
  name: string;

  @ForeignKey(() => User)
  @Column({ allowNull: false })
  createdById: number;

  @BelongsTo(() => User)
  createdBy: User;

  @BelongsToMany(() => User, () => UserGroup)
  students: User[];

  @CreatedAt public createdAt: Date;
  @UpdatedAt public updatedAt: Date;
}
