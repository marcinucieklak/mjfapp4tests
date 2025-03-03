import { UserType } from './../enums/user-type.enum';
import {
  BelongsToMany,
  Column,
  CreatedAt,
  DataType,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { Group } from './group.model';
import { UserGroup } from './user-group.model';

@Table({ charset: 'utf8mb4', tableName: 'users' })
export class User extends Model {
  @Column({
    allowNull: false,
    autoIncrement: true,
    unique: true,
    primaryKey: true,
  })
  public id: number;

  @Column({
    type: DataType.ENUM(...Object.values(UserType)),
    allowNull: false,
  })
  type: UserType;

  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
  name: string;

  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
  surname: string;

  @Column({ allowNull: false, unique: true })
  email: string;

  @Column({ allowNull: false })
  password: string;

  @Column({ allowNull: true })
  recoveryCode: string;

  @BelongsToMany(() => Group, () => UserGroup)
  groups: Group[];

  @CreatedAt public createdAt: Date;
  @UpdatedAt public updatedAt: Date;
}
