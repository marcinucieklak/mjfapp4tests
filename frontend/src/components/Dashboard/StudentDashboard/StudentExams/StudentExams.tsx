import { useEffect, useState } from "react";
import { PencilSquare } from "react-bootstrap-icons";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { LoadingSpinner } from "../../../Common";
import { StudentExam } from "../../../../types/models";
import { formatDate, formatDateTime, formatTimeLimit } from "../../../../utils";
import { studentsService } from "../../../../services";
import { getExamStatus } from "./getExam";
import "./StudentExams.css";

export const StudentExams = () => {
  const navigate = useNavigate();
  const [exams, setExams] = useState<StudentExam[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const data = await studentsService.getMyExams();
        setExams(data);
      } catch {
        toast.error("Failed to load exams");
      } finally {
        setIsLoading(false);
      }
    };

    fetchExams();
  }, []);

  const handleExamClick = (examId: number) => {
    navigate(`/student/dashboard/exams/${examId}/take`);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mt-4">
      <div className="card shadow-sm">
        <div className="card-body">
          <h4 className="card-title mb-4">My Exams</h4>

          <div className="row g-4">
            {exams.map((exam) => {
              const status = getExamStatus(exam);

              return (
                <div key={exam.id} className="col-md-6 col-lg-4">
                  <div
                    className="card h-100 exam-card"
                    onClick={() => handleExamClick(exam.id)}
                    role="button"
                  >
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <div className="icon-wrapper bg-primary-subtle rounded-3 p-3">
                          <PencilSquare size={24} className="text-primary" />
                        </div>
                        <span
                          className={`badge bg-${status.color}-subtle text-${status.color} rounded-pill`}
                        >
                          <i className={`bi ${status.icon} me-1`}></i>
                          {status.label}
                        </span>
                      </div>

                      <h5 className="card-title mb-2">{exam.title}</h5>
                      <p className="text-muted small mb-1">
                        Group: {exam.group.name}
                      </p>
                      <p className="text-muted small mb-3">
                        Teacher: {exam.createdBy.name} {exam.createdBy.surname}
                      </p>

                      {(exam.startDate ||
                        exam.endDate ||
                        exam.timeLimit > 0) && (
                        <div className="availability-info mb-3">
                          {exam.timeLimit > 0 && (
                            <div className="d-flex align-items-center mb-1">
                              <i className="bi bi-clock me-2"></i>
                              <small className="text-primary">
                                Time limit: {formatTimeLimit(exam.timeLimit)}
                              </small>
                            </div>
                          )}
                          {exam.startDate && (
                            <div className="d-flex align-items-center mb-1">
                              <i className="bi bi-calendar-event me-2"></i>
                              <small className="text-info">
                                Starts: {formatDateTime(exam.startDate)}
                              </small>
                            </div>
                          )}
                          {exam.endDate && (
                            <div className="d-flex align-items-center mb-1">
                              <i className="bi bi-calendar-x me-2"></i>
                              <small className="text-warning">
                                Ends: {formatDateTime(exam.endDate)}
                              </small>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="mt-3 d-flex justify-content-between align-items-center">
                        <small className="text-muted">
                          Created {formatDate(exam.createdAt)}
                        </small>
                        <span className="badge bg-secondary text-uppercase">
                          {exam.questionDisplayMode}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {exams.length === 0 && (
              <div className="col-12">
                <div className="alert alert-info">
                  No exams available at the moment.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
