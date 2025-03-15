import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Person } from "react-bootstrap-icons";
import { examsService } from "../../../../../services";
import { LoadingSpinner } from "../../../../Common";
import { toast } from "react-toastify";
import { Exam } from "../../../../../types";

export const ExamResults = () => {
  const { examId } = useParams();
  const [exam, setExam] = useState<Exam | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const data = await examsService.getExamWithSessions(Number(examId));
        setExam(data);
      } catch {
        toast.error("Failed to load exam results");
      } finally {
        setIsLoading(false);
      }
    };

    fetchExam();
  }, [examId]);

  if (isLoading) return <LoadingSpinner />;
  if (!exam) return null;

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">{exam.title}</h2>
          <p className="text-muted mb-0">
            Group: {exam.group?.name} | Students who took the exam in total:{" "}
            {exam.sessions?.length}
          </p>
        </div>
        <Link to="/teacher/dashboard/exams" className="btn btn-outline-primary">
          Back to Exams
        </Link>
      </div>

      <div className="row g-4">
        {exam.sessions &&
          exam.sessions.map((session) => (
            <div key={session.id} className="col-md-6 col-xl-4">
              <div className="card h-100">
                <div className="card-body">
                  <div className="d-flex align-items-center mb-3">
                    <div className="bg-info bg-opacity-10 p-3 rounded-circle me-3">
                      <Person size={24} className="text-info" />
                    </div>
                    <div>
                      <h5 className="mb-1">
                        {session.student?.name} {session.student?.surname}
                      </h5>
                      <span className="badge bg-success">
                        Score: {session.score}%
                      </span>
                    </div>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <small className="text-muted">
                      {session.updatedAt && (
                        <>
                          Completed:{" "}
                          {new Date(session.updatedAt).toLocaleDateString()}
                        </>
                      )}
                    </small>
                    <Link
                      to={`/teacher/dashboard/exam-results/${examId}/student/${session.id}`}
                      className="btn btn-primary btn-sm"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};
