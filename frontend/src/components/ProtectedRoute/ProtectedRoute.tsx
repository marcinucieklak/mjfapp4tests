import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks";
import { UserType } from "../../types";
import { PropsWithChildren } from "react";

type Props = {
  type: UserType;
};

export const ProtectedRoute = ({
  children,
  type,
}: PropsWithChildren<Props>) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (user?.type !== type) {
    return <Navigate to="/dashboard" />;
  }

  return <>{children}</>;
};
