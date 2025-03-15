import { Question } from '../models/question.model';

export class QuestionSerializer {
  static toJSON(question: Question) {
    return {
      id: question.id,
      text: question.text,
      options: question.options,
      correctOption: question.correctOption,
      subjectId: question.subjectId,
      subject: question.subject,
      topicId: question.topicId,
      topic: question.topic,
      subtopicId: question.subtopicId,
      subtopic: question.subtopic,
      createdById: question.createdById,
      createdBy: question.createdBy,
      imageUrl: question.imageFullUrl,
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
    };
  }
}
