import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { Subject } from 'src/subject/models/subject.model';

@Table({ tableName: 'teachers' })
export class Teacher extends Model {
  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @HasMany(() => Subject)
  subjects: Subject[];
}
