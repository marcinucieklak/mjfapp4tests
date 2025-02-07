import {
  Table,
  Column,
  DataType,
  ForeignKey,
  Model,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import { Subject } from 'src/subject/models/subject.model';
import { Subtopic } from './subtopic.model';
import { Question } from 'src/question/models/question.model';

@Table({ tableName: 'topics' })
export class Topic extends Model {
  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @ForeignKey(() => Subject)
  @Column({ type: DataType.INTEGER })
  subjectId: number;

  @BelongsTo(() => Subject)
  subject: Subject;

  @HasMany(() => Subtopic)
  subtopics: Subtopic[];

  @HasMany(() => Question)
  questions: Question[];
}
