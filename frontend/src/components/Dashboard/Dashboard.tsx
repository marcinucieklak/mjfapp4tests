import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks";
import { UserType } from "../../types";

export const Dashboard = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (user) {
      switch (user.type) {
        case UserType.EXAMINER:
          navigate("/teacher/dashboard");
          break;
        case UserType.STUDENT:
          navigate("/student/dashboard");
          break;
        default:
          navigate("/login");
      }
    } else if (!isLoading && !user) {
      navigate("/login");
    }
  }, [user, navigate, isLoading]);

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};
