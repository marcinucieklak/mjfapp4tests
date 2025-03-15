import { StudentExam } from "../../../../types";

export interface ExamStatus {
  label: string;
  color: string;
  icon: string;
}

export const getExamStatus = (exam: StudentExam): ExamStatus => {
  const now = new Date();
  const start = exam.startDate ? new Date(exam.startDate) : null;
  const end = exam.endDate ? new Date(exam.endDate) : null;

  console.log("exam", exam);

  if (exam.sessions && exam.sessions.length > 0) {
    console.log("exam.session", exam.sessions);

    const completedSession = exam.sessions.find(
      (session) => session.status === "COMPLETED"
    );
    if (completedSession) {
      return {
        label: "Finished",
        color: "info",
        icon: "bi-flag-fill",
      };
    }

    const inProgressSession = exam.sessions.find(
      (session) => session.status === "IN_PROGRESS"
    );
    if (inProgressSession) {
      return {
        label: "In Progress",
        color: "primary",
        icon: "bi-play-fill",
      };
    }
  }

  if (end && now > end) {
    return {
      label: "Expired",
      color: "danger",
      icon: "bi-x-circle",
    };
  }

  if (start && now < start) {
    return {
      label: "Upcoming",
      color: "warning",
      icon: "bi-clock-history",
    };
  }

  if ((!start || now >= start) && (!end || now <= end)) {
    return {
      label: "Available",
      color: "success",
      icon: "bi-check-circle",
    };
  }

  return {
    label: "Not Available",
    color: "secondary",
    icon: "bi-dash-circle",
  };
};
