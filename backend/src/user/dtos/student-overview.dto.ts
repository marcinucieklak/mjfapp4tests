export class StudentOverviewDto {
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
