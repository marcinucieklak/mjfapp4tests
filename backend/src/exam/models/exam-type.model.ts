import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({ tableName: 'exam_types' })
export class ExamType extends Model {
  @Column({ type: DataType.STRING, allowNull: false })
  name: string; // 'Normal', 'By Topics', 'By Subtopics'
}
