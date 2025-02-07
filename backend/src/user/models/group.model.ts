import {
  Column,
  CreatedAt,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';

@Table({ charset: 'utf8mb4' })
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

  @CreatedAt public createdAt: Date;
  @UpdatedAt public updatedAt: Date;
}
