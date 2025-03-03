import { api } from "../utils/api";
import { Topic } from "../types";

export interface CreateTopicDto {
  name: string;
  description?: string;
  subjectId: number;
}

export interface CreateSubtopicDto {
  name: string;
  description?: string;
  topicId: number;
}

export const topicsService = {
  getTopics: () => api.fetch<Topic[]>("/topics"),

  createTopic: (data: CreateTopicDto) =>
    api.fetch<Topic>("/topics", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateTopic: (id: number, data: Partial<CreateTopicDto>) =>
    api.fetch<Topic>(`/topics/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  updateSubtopic: (
    topicId: number,
    subtopicId: number,
    data: Partial<CreateSubtopicDto>
  ) =>
    api.fetch<Topic>(`/topics/${topicId}/subtopics/${subtopicId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  deleteTopic: (id: number) =>
    api.fetch(`/topics/${id}`, {
      method: "DELETE",
    }),

  createSubtopic: (data: CreateSubtopicDto) =>
    api.fetch<Topic>("/topics/subtopics", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  deleteSubtopic: (topicId: number, subtopicId: number) =>
    api.fetch(`/topics/${topicId}/subtopics/${subtopicId}`, {
      method: "DELETE",
    }),
};
