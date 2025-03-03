import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { People, PencilSquare, BoxArrowRight } from "react-bootstrap-icons";
import { ToastContainer } from "react-toastify";
import { useAuth } from "../../../hooks";
import "./StudentDashboard.css";

export const StudentDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <nav className="col-md-2 d-none d-md-block sidebar shadow-sm">
          <div className="position-sticky pt-4">
            <h5 className="px-3 mb-4 text-muted">
              <Link
                to="/student/dashboard"
                className="link-dark link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover"
              >
                Student Panel
              </Link>
            </h5>
            <ul className="nav flex-column">
              <li className="nav-item">
                <Link
                  className={`nav-link d-flex align-items-center gap-2 py-3 px-3 ${
                    location.pathname.includes("/student/dashboard/groups")
                      ? "active"
                      : ""
                  }`}
                  to="/student/dashboard/groups"
                >
                  <People size={18} />
                  <span>Groups</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`nav-link d-flex align-items-center gap-2 py-3 px-3 ${
                    location.pathname.includes("/student/dashboard/exams")
                      ? "active"
                      : ""
                  }`}
                  to="/student/dashboard/exams"
                >
                  <PencilSquare size={18} />
                  <span>Exams</span>
                </Link>
              </li>
              <li className="nav-item mt-auto">
                <button
                  className="nav-link d-flex align-items-center gap-2 py-3 px-3 text-danger border-0 bg-transparent w-100 text-start"
                  onClick={handleLogout}
                >
                  <BoxArrowRight size={18} />
                  <span>Logout</span>
                </button>
              </li>
            </ul>
          </div>
        </nav>

        <main className="col-md-10 ms-sm-auto px-md-4 py-4">
          <Outlet />
        </main>
      </div>
      <ToastContainer />
    </div>
  );
};
