import { api } from "../utils/api";
import { Question } from "../types";

export interface CreateQuestionDto {
  text: string;
  options: string[];
  correctOption: number;
  subjectId?: number | null;
  topicId?: number | null;
  subtopicId?: number | null;
}

export const questionsService = {
  getQuestions: () => api.fetch<Question[]>("/questions"),

  createQuestion: (data: CreateQuestionDto) =>
    api.fetch<Question>("/questions", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateQuestion: (id: number, data: CreateQuestionDto) =>
    api.fetch<Question>(`/questions/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  deleteQuestion: (id: number) =>
    api.fetch(`/questions/${id}`, {
      method: "DELETE",
    }),
};
