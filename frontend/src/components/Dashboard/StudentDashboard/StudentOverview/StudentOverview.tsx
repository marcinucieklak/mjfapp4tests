import { People, PencilSquare, PlayFill } from "react-bootstrap-icons";
import { LoadingSpinner } from "../../../Common";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import { studentsService } from "../../../../services";
import { StudentOverview as StudentOverviewType } from "../../../../types/models";
import { formatDateTime, formatScore } from "../../../../utils";
import { useNavigate } from "react-router-dom";

export const StudentOverview = () => {
  const [overview, setOverview] = useState<StudentOverviewType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const data = await studentsService.getOverview();
        setOverview(data);
      } catch {
        toast.error("Failed to load overview data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOverview();
  }, []);

  const handleCardClick = (path: string) => {
    navigate(path);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!overview) {
    return null;
  }

  return (
    <div>
      <h2 className="mb-4">Dashboard Overview</h2>

      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <div
            className="card hover-shadow cursor-pointer"
            onClick={() => handleCardClick("/student/dashboard/groups")}
            role="button"
            tabIndex={0}
          >
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="bg-primary bg-opacity-10 p-3 rounded">
                  <People size={24} className="text-primary" />
                </div>
                <div className="ms-3">
                  <h6 className="mb-1">Active Groups</h6>
                  <h4 className="mb-0">{overview.activeGroups}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div
            className="card hover-shadow cursor-pointer"
            onClick={() => handleCardClick("/student/dashboard/exams")}
            role="button"
            tabIndex={0}
          >
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="bg-success bg-opacity-10 p-3 rounded">
                  <PencilSquare size={24} className="text-success" />
                </div>
                <div className="ms-3">
                  <h6 className="mb-1">Upcoming Exams</h6>
                  <h4 className="mb-0">{overview.upcomingExams}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div
            className="card hover-shadow cursor-pointer"
            onClick={() => handleCardClick("/student/dashboard/exams")}
            role="button"
            tabIndex={0}
          >
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="bg-info bg-opacity-10 p-3 rounded">
                  <PlayFill size={24} className="text-info" />
                </div>
                <div className="ms-3">
                  <h6 className="mb-1">Available Exams</h6>
                  <h4 className="mb-0">{overview.availableExams}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header bg-white">
          <h5 className="mb-0">Recent Exam Results</h5>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Exam Title</th>
                  <th>Date</th>
                  <th>Score</th>
                </tr>
              </thead>
              <tbody>
                {overview.recentExams.map((exam) => {
                  const gradeFormat = formatScore(parseInt(exam.score));

                  return (
                    <tr key={exam.id}>
                      <td>{exam.title}</td>
                      <td>{formatDateTime(exam.date)}</td>
                      <td>
                        <span className={`badge bg-${gradeFormat.color}`}>
                          {gradeFormat.grade} ({gradeFormat.label}) -{" "}
                          {exam.score}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
