import {
  BelongsTo,
  BelongsToMany,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { User } from 'src/user/models/user.model';
import { Group } from 'src/user/models/group.model';
import { Question } from 'src/question/models/question.model';
import { ExamQuestion } from './exam-questions.model';
import { Topic, Subtopic } from 'src/topic/models';
import { Subject } from 'src/subject/models/subject.model';
import { DisplayMode } from '../types';

@Table({ charset: 'utf8mb4', tableName: 'exams' })
export class Exam extends Model {
  @Column({ type: DataType.STRING, allowNull: false })
  title: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  description: string;

  @Column({
    type: DataType.ENUM(...Object.values(DisplayMode)),
    allowNull: false,
  })
  questionDisplayMode: DisplayMode;

  @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 0 })
  timeLimit: number; // 0 means no limit

  @Column({ type: DataType.DATE, allowNull: true })
  startDate: Date;

  @Column({ type: DataType.DATE, allowNull: true })
  endDate: Date;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
  isActive: boolean;

  @ForeignKey(() => User)
  @Column({ allowNull: false })
  createdById: number;

  @BelongsTo(() => User)
  createdBy: User;

  @ForeignKey(() => Group)
  @Column({ allowNull: false })
  groupId: number;

  @BelongsTo(() => Group)
  group: Group;

  @BelongsToMany(() => Question, () => ExamQuestion)
  questions: Question[];

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

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
