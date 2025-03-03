import { useEffect, useState } from "react";
import { PencilSquare } from "react-bootstrap-icons";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { LoadingSpinner } from "../../../Common";
import { StudentExam } from "../../../../types/models";
import { formatDate } from "../../../../utils";
import { studentsService } from "../../../../services";
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
            {exams.map((exam) => (
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
                      <span className="badge bg-primary-subtle text-primary rounded-pill">
                        {exam.questionDisplayMode}
                      </span>
                    </div>

                    <h5 className="card-title mb-2">{exam.title}</h5>
                    <p className="text-muted small mb-1">
                      Group: {exam.group.name}
                    </p>
                    <p className="text-muted small mb-3">
                      Teacher: {exam.createdBy.name} {exam.createdBy.surname}
                    </p>

                    <div className="mt-3 d-flex justify-content-between align-items-center">
                      <small className="text-muted">
                        Created {formatDate(exam.createdAt)}
                      </small>
                      <span className="badge bg-secondary">
                        {exam.questionsCount} questions
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

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
