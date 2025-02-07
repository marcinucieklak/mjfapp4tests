export interface Question {
  id: number;
  text: string;
  options: string[];
  correctOption: number;
  topicId?: number;
  subtopicId?: number;
  examId?: number;
}

export interface Topic {
  id: number;
  name: string;
  subtopics?: Subtopic[];
}

export interface Subtopic {
  id: number;
  name: string;
  topicId: number;
}

export interface Exam {
  id: number;
  title: string;
  questions?: Question[];
}
