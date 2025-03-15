import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Person, CheckCircleFill, XCircleFill } from "react-bootstrap-icons";
import { examsService } from "../../../../../services";
import { LoadingSpinner } from "../../../../Common";
import { toast } from "react-toastify";
import { ExamSession } from "../../../../../types/models";

const API_URL = import.meta.env.VITE_API_URL;

export const StudentExamResults = () => {
  const { examId, sessionId } = useParams();
  const [session, setSession] = useState<ExamSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSessionDetails = async () => {
      try {
        const data = await examsService.getExamSessionDetails(
          Number(examId),
          Number(sessionId)
        );
        setSession(data);
      } catch {
        toast.error("Failed to load exam session details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSessionDetails();
  }, [examId, sessionId]);

  if (isLoading) return <LoadingSpinner />;
  if (!session) return null;

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">{session.exam.title}</h2>
          <div className="d-flex align-items-center">
            <div className="bg-info bg-opacity-10 p-2 rounded-circle me-2">
              <Person size={20} className="text-info" />
            </div>
            <span>
              {session.student?.name} {session.student?.surname}
            </span>
            <span className="badge bg-success ms-3">
              Score: {session.score}%
            </span>
          </div>
        </div>
        <Link
          to={`/teacher/dashboard/exam-results/${examId}`}
          className="btn btn-outline-primary"
        >
          Back to Results
        </Link>
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <div className="row">
            <div className="col-md-4">
              <p className="mb-1 text-muted">Started At</p>
              <p className="mb-3">
                {new Date(session.startedAt).toLocaleString()}
              </p>
            </div>
            <div className="col-md-4">
              <p className="mb-1 text-muted">Status</p>
              <p className="mb-3">
                <span
                  className={`badge bg-${
                    session.status === "COMPLETED"
                      ? "success"
                      : session.status === "EXPIRED"
                      ? "danger"
                      : "warning"
                  }`}
                >
                  {session.status}
                </span>
              </p>
            </div>
            <div className="col-md-4">
              <p className="mb-1 text-muted">Time Remaining</p>
              <p className="mb-0">
                {session.timeRemaining !== null
                  ? `${Math.round(session.timeRemaining / 60)} minutes`
                  : "No time limit"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="questions-review">
        {session.exam.questions.map((question, index) => {
          const answer = session.answers.find(
            (a) => a.questionId === question.id
          );
          const selectedAnswer = question.options.findIndex(
            (option) => option === answer?.answer
          );

          return (
            <div key={question.id} className="card mb-3">
              <div className="card-body">
                <div className="d-flex align-items-center mb-3">
                  <h5 className="mb-0 me-2">Question {index + 1}</h5>
                  {selectedAnswer === question.correctOption ? (
                    <CheckCircleFill className="text-success" size={20} />
                  ) : (
                    <XCircleFill className="text-danger" size={20} />
                  )}
                </div>

                <p className="mb-3">{question.text}</p>

                {question.imageUrl && (
                  <img
                    src={`${API_URL}${
                      question.imageFullUrl || question.imageUrl
                    }`}
                    alt="Question"
                    className="img-fluid mb-3 rounded"
                    style={{ maxHeight: "200px" }}
                  />
                )}

                <div className="options-list">
                  {question.options.map((option, optIndex) => (
                    <div
                      key={optIndex}
                      className={`option p-2 rounded mb-2 ${
                        optIndex === selectedAnswer
                          ? selectedAnswer === question.correctOption
                            ? "bg-success bg-opacity-10"
                            : "bg-danger bg-opacity-10"
                          : optIndex === question.correctOption
                          ? "bg-success bg-opacity-10"
                          : ""
                      }`}
                    >
                      {option}
                      {optIndex === selectedAnswer && (
                        <span className="ms-2">(Selected)</span>
                      )}
                      {optIndex === question.correctOption && (
                        <span className="ms-2 text-success">
                          (Correct Answer)
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
