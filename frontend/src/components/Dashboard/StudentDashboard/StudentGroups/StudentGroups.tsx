import { useEffect, useState } from "react";
import { People } from "react-bootstrap-icons";
import { toast } from "react-toastify";
import { LoadingSpinner } from "../../../Common";
import { Group } from "../../../../types/models";
import { formatDate } from "../../../../utils";
import { studentsService } from "../../../../services";
import "./StudentGroups.css";

export const StudentGroups = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const data = await studentsService.getMyGroups();
        setGroups(data);
      } catch {
        toast.error("Failed to load groups");
      } finally {
        setIsLoading(false);
      }
    };

    fetchGroups();
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mt-4">
      <div className="card shadow-sm">
        <div className="card-body">
          <h4 className="card-title mb-4">My Groups</h4>

          <div className="row g-4">
            {groups.map((group) => (
              <div key={group.id} className="col-md-6 col-lg-4">
                <div className="card h-100">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div className="icon-wrapper bg-primary-subtle rounded-3 p-3">
                        <People size={24} className="text-primary" />
                      </div>
                      <span className="badge bg-primary-subtle text-primary rounded-pill">
                        {group.students.length} students
                      </span>
                    </div>

                    <h5 className="card-title mb-2">{group.name}</h5>
                    <p className="text-muted small mb-3">
                      Teacher: {group.createdBy.name} {group.createdBy.surname}
                    </p>

                    <div className="mt-3 d-flex justify-content-between align-items-center">
                      <small className="text-muted">
                        Created {formatDate(new Date(group.createdAt))}
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {groups.length === 0 && (
              <div className="col-12">
                <div className="alert alert-info">
                  You are not a member of any groups yet.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
