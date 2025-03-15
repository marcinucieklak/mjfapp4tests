export interface Question {
  id: number;
  text: string;
  options: string[];
  correctOption: number;
  topicId?: number;
  subtopicId?: number;
  examId?: number;
  imageUrl?: string | null;
  imageFullUrl?: string | null;
}

export interface Subject {
  id: number;
  name: string;
  topics?: Topic[];
  description?: string;
  topicsCount?: number;
  createdAt?: Date;
}

export interface Topic {
  id: number;
  name: string;
  description?: string;
  subjectId: number;
  subtopics?: Subtopic[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Subtopic {
  id: number;
  name: string;
  description?: string;
  topicId: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Exam {
  id: number;
  title: string;
  questionDisplayMode: DisplayMode;
  questions: Question[];
  groupId: number;
  group?: Group;
  subjectId?: number;
  subject?: Subject;
  topicId?: number;
  topic?: Topic;
  subtopicId?: number;
  subtopic?: Subtopic;
  createdAt: Date;
  updatedAt: Date;
  timeLimit: number;
  startDate?: string;
  endDate?: string;
  sessions?: ExamSession[];
}

export interface ExamFormData {
  title: string;
  description?: string;
  displayMode: DisplayMode;
  selectedQuestions: number[];
  timeLimit: number;
  startDate?: string;
  endDate?: string;
  groupId: number;
  subjectId: number | null;
  topicId: number | null;
  subtopicId: number | null;
}

export interface ExamAvailability {
  canStart: boolean;
  startDate: string | null;
  endDate: string | null;
  timeLimit: number;
}

export enum DisplayMode {
  SINGLE = "Single",
  ALL = "All",
}

export interface ExamQuestion {
  id: number;
  text: string;
  options: string[];
  correctOption: number;
  topicId: number;
  subtopicId?: number;
}

export interface User {
  id: number;
  name: string;
  surname: string;
  email: string;
  type: UserType;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export enum UserType {
  STUDENT = "student",
  EXAMINER = "examiner",
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  surname: string;
  type: UserType;
}

export interface RegisterResponse {
  user: User;
  message: string;
}

export interface Group {
  id: number;
  name: string;
  createdById: number;
  createdBy: {
    id: number;
    name: string;
    surname: string;
    email: string;
  };
  students: {
    id: number;
    name: string;
    surname: string;
    email: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

export interface StudentExam {
  id: number;
  title: string;
  questionDisplayMode: DisplayMode;
  group: {
    id: number;
    name: string;
  };
  createdBy: {
    id: number;
    name: string;
    surname: string;
  };
  questionsCount: number;
  createdAt: Date;
  updatedAt: Date;
  timeLimit: number;
  startDate?: string;
  endDate?: string;
  sessions?: ExamSession[];
}

export interface ExamSession {
  id: number;
  examId: number;
  status: "IN_PROGRESS" | "COMPLETED" | "EXPIRED";
  currentQuestionIndex: number;
  startedAt: Date;
  updatedAt?: string;
  student?: User;
  score?: number;
  timeoutAt: string | null;
  timeRemaining: number | null;
  exam: {
    id: number;
    title: string;
    questionDisplayMode: DisplayMode;
    questions: Question[];
    group: {
      id: number;
      name: string;
    };
    createdBy: {
      id: number;
      firstName: string;
      lastName: string;
    };
  };
  answers: {
    questionId: number;
    answer: string;
  }[];
}

export interface CreateGroupDto {
  name: string;
}

export interface AddStudentToGroupDto {
  studentId: number;
  groupId: number;
}

export interface Question {
  id: number;
  text: string;
  options: string[];
  correctOption: number;
  subjectId?: number;
  topicId?: number;
  subtopicId?: number;
  subject?: Subject;
  topic?: Topic;
  subtopic?: Subtopic;
  createdAt: string;
  updatedAt: string;
}

export interface QuestionFormData {
  text: string;
  image?: File | null;
  imageUrl?: string | null;
  options: string[];
  correctOption: number;
  subjectId?: number | null;
  topicId?: number | null;
  subtopicId?: number | null;
}

export interface StudentOverview {
  activeGroups: number;
  upcomingExams: number;
  availableExams: number;
  recentExams: {
    id: number;
    title: string;
    date: string;
    score: string;
  }[];
}

export interface DashboardOverview {
  totalSubjects: number;
  totalTopics: number;
  totalQuestions: number;
  totalExams: number;
  activeGroups: number;
}
