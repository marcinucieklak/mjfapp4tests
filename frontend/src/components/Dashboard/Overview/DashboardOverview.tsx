import {
  Book,
  Grid3x3,
  QuestionCircle,
  PencilSquare,
  People,
} from "react-bootstrap-icons";
import { Link } from "react-router-dom";
import "./DashboardOverview.css";

export const DashboardOverview = () => {
  return (
    <div className="container mt-4">
      <h4 className="mb-4">Dashboard Overview</h4>
      <div className="row g-4">
        <div className="col-md-3">
          <div className="card h-100 dashboard-card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div className="icon-wrapper bg-primary-subtle rounded-3 p-3">
                  <Book size={24} className="text-primary" />
                </div>
                <span className="badge bg-primary-subtle text-primary rounded-pill">
                  Subjects
                </span>
              </div>
              <h3 className="card-title mb-1">5</h3>
              <p className="text-muted small mb-3">Total Subjects</p>
              <Link
                to="/teacher/dashboard/subjects"
                className="btn btn-light btn-sm d-flex align-items-center gap-2"
              >
                Manage Subjects <i className="bi bi-arrow-right"></i>
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card h-100 dashboard-card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div className="icon-wrapper bg-success-subtle rounded-3 p-3">
                  <Grid3x3 size={24} className="text-success" />
                </div>
                <span className="badge bg-success-subtle text-success rounded-pill">
                  Topics
                </span>
              </div>
              <h3 className="card-title mb-1">15</h3>
              <p className="text-muted small mb-3">Total Topics</p>
              <Link
                to="/teacher/dashboard/topics"
                className="btn btn-light btn-sm d-flex align-items-center gap-2"
              >
                Manage Topics <i className="bi bi-arrow-right"></i>
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card h-100 dashboard-card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div className="icon-wrapper bg-info-subtle rounded-3 p-3">
                  <QuestionCircle size={24} className="text-info" />
                </div>
                <span className="badge bg-info-subtle text-info rounded-pill">
                  Questions
                </span>
              </div>
              <h3 className="card-title mb-1">50</h3>
              <p className="text-muted small mb-3">Total Questions</p>
              <Link
                to="/teacher/dashboard/questions"
                className="btn btn-light btn-sm d-flex align-items-center gap-2"
              >
                Manage Questions <i className="bi bi-arrow-right"></i>
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card h-100 dashboard-card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div className="icon-wrapper bg-warning-subtle rounded-3 p-3">
                  <PencilSquare size={24} className="text-warning" />
                </div>
                <span className="badge bg-warning-subtle text-warning rounded-pill">
                  Exams
                </span>
              </div>
              <h3 className="card-title mb-1">3</h3>
              <p className="text-muted small mb-3">Total Exams</p>
              <Link
                to="/teacher/dashboard/exams"
                className="btn btn-light btn-sm d-flex align-items-center gap-2"
              >
                Manage Exams <i className="bi bi-arrow-right"></i>
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card h-100 dashboard-card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div className="icon-wrapper bg-danger-subtle rounded-3 p-3">
                  <People size={24} className="text-danger" />
                </div>
                <span className="badge bg-danger-subtle text-danger rounded-pill">
                  Groups
                </span>
              </div>
              <h3 className="card-title mb-1">8</h3>
              <p className="text-muted small mb-3">Active Groups</p>
              <Link
                to="/teacher/dashboard/groups"
                className="btn btn-light btn-sm d-flex align-items-center gap-2"
              >
                Manage Groups <i className="bi bi-arrow-right"></i>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
