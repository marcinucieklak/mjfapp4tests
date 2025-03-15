import {
  Column,
  Model,
  Table,
  ForeignKey,
  BelongsTo,
  DataType,
} from 'sequelize-typescript';
import { Subject } from '../../subject/models/subject.model';
import { Topic } from '../../topic/models/topic.model';
import { Subtopic } from '../../topic/models/subtopic.model';
import { User } from '../../user/models/user.model';

@Table({ charset: 'utf8mb4', tableName: 'questions' })
export class Question extends Model {
  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  text: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
    get() {
      const rawValue = this.getDataValue('options');
      return rawValue ? JSON.parse(rawValue) : [];
    },
    set(value: string[]) {
      this.setDataValue('options', JSON.stringify(value));
    },
  })
  options: string[];

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  correctOption: number;

  @ForeignKey(() => Subject)
  @Column({ allowNull: true })
  subjectId: number | null;

  @BelongsTo(() => Subject)
  subject: Subject;

  @ForeignKey(() => Topic)
  @Column({ allowNull: true })
  topicId: number | null;

  @BelongsTo(() => Topic)
  topic: Topic;

  @ForeignKey(() => Subtopic)
  @Column({ allowNull: true })
  subtopicId: number | null;

  @BelongsTo(() => Subtopic)
  subtopic: Subtopic;

  @ForeignKey(() => User)
  @Column({ allowNull: false })
  createdById: number;

  @BelongsTo(() => User)
  createdBy: User;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    comment: 'Image URL or file path',
  })
  imageUrl: string | null;

  @Column({
    type: DataType.VIRTUAL,
    get() {
      const imageUrl = this.getDataValue('imageUrl');
      if (!imageUrl) return null;
      return `/uploads/questions/${imageUrl}`;
    },
  })
  imageFullUrl: string | null;

  toJSON() {
    const values = super.toJSON();
    if (values.imageUrl) {
      values.imageUrl = `/uploads/questions/${values.imageUrl}`;
    }
    return values;
  }
}
