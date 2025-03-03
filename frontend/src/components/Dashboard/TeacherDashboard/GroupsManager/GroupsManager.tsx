import { useEffect, useState } from "react";
import { Plus, Trash, PersonAdd } from "react-bootstrap-icons";
import { toast } from "react-toastify";
import { Group, User } from "../../../../types";
import { groupsService, studentsService } from "../../../../services";
import { useForm } from "react-hook-form";
import { Modal } from "react-bootstrap";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import "./GroupsManager.css";

interface AddGroupForm {
  name: string;
}

interface AddStudentForm {
  studentId: number;
}

const addGroupSchema = Joi.object({
  name: Joi.string().required().messages({
    "string.empty": "Group name is required",
  }),
});

const addStudentSchema = Joi.object({
  studentId: Joi.number().required().messages({
    "number.base": "Please select a student",
  }),
});

export const GroupManager = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [students, setStudents] = useState<User[]>([]);
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);

  const {
    register: registerGroup,
    handleSubmit: handleSubmitGroup,
    formState: { errors: groupErrors },
    reset: resetGroupForm,
  } = useForm<AddGroupForm>({
    resolver: joiResolver(addGroupSchema),
  });

  const {
    register: registerStudent,
    handleSubmit: handleSubmitStudent,
    formState: { errors: studentErrors },
    reset: resetStudentForm,
  } = useForm<AddStudentForm>({
    resolver: joiResolver(addStudentSchema),
  });

  const onSubmitGroup = handleSubmitGroup(async (data) => {
    await handleAddGroup(data.name);
    resetGroupForm();
  });

  const onSubmitStudent = handleSubmitStudent(async (data) => {
    if (selectedGroup) {
      await handleAddStudent(selectedGroup.id, data.studentId);
      resetStudentForm();
    }
  });

  useEffect(() => {
    fetchGroups();
    fetchStudents();
  }, []);

  const fetchGroups = async () => {
    try {
      const data = await groupsService.getGroups();
      setGroups(data);
    } catch {
      toast.error("Failed to fetch groups");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStudents = async () => {
    setIsLoadingStudents(true);
    try {
      const data = await studentsService.getStudents();
      setStudents(data);
    } catch {
      toast.error("Failed to fetch students");
    } finally {
      setIsLoadingStudents(false);
    }
  };

  const handleAddGroup = async (name: string) => {
    try {
      const newGroup = await groupsService.createGroup({ name });
      setGroups([...groups, newGroup]);
      setShowAddModal(false);
      toast.success("Group created successfully");
    } catch {
      toast.error("Failed to create group");
    }
  };

  const handleAddStudent = async (groupId: number, studentId: number) => {
    try {
      await groupsService.addStudent({ groupId, studentId });
      await fetchGroups();
      setShowAddStudentModal(false);
      toast.success("Student added to group");
    } catch {
      toast.error("Failed to add student");
    }
  };

  const handleDeleteStudent = async (groupId: number, studentId: number) => {
    try {
      await groupsService.removeStudent(groupId, studentId);
      setGroups(
        groups.map((group) =>
          group.id === groupId
            ? {
                ...group,
                students: group.students.filter((s) => s.id !== studentId),
              }
            : group
        )
      );
      toast.success("Student removed from group");
    } catch {
      toast.error("Failed to remove student");
    }
  };

  const getAvailableStudents = (groupId: number) => {
    const group = groups.find((g) => g.id === groupId);
    if (!group) return students;

    return students.filter(
      (student) =>
        !group.students?.some((groupStudent) => groupStudent.id === student.id)
    );
  };

  if (isLoading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "400px" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Groups Management</h2>
        <button
          className="btn btn-primary"
          onClick={() => setShowAddModal(true)}
        >
          <Plus size={20} className="me-2" />
          Add Group
        </button>
      </div>

      <div className="row g-4">
        {groups.map((group) => (
          <div key={group.id} className="col-md-6 col-lg-4">
            <div className="card h-100">
              <div className="card-header bg-white d-flex justify-content-between align-items-center">
                <h5 className="mb-0">{group.name}</h5>
                <button
                  className="btn btn-outline-primary btn-sm"
                  onClick={() => {
                    setShowAddStudentModal(true);
                    setSelectedGroup(group);
                  }}
                >
                  <PersonAdd size={16} />
                </button>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Surname</th>
                        <th>Email</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {group.students.map((student) => (
                        <tr key={student.id}>
                          <td>{student.name}</td>
                          <td>{student.surname}</td>
                          <td>{student.email}</td>
                          <td>
                            <button
                              className="btn btn-outline-danger btn-sm"
                              onClick={() =>
                                handleDeleteStudent(group.id, student.id)
                              }
                            >
                              <Trash size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Group</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={onSubmitGroup}>
            <div className="mb-3">
              <label className="form-label">Group Name</label>
              <input
                type="text"
                className={`form-control ${
                  groupErrors.name ? "is-invalid" : ""
                }`}
                {...registerGroup("name")}
              />
              {groupErrors.name && (
                <div className="invalid-feedback">
                  {groupErrors.name.message}
                </div>
              )}
            </div>
            <div className="d-flex justify-content-end gap-2">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Create Group
              </button>
            </div>
          </form>
        </Modal.Body>
      </Modal>

      <Modal
        show={showAddStudentModal}
        onHide={() => {
          setShowAddStudentModal(false);
          setSelectedGroup(null);
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Add Student to Group</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={onSubmitStudent}>
            <div className="mb-3">
              <label className="form-label">Select Student</label>
              <select
                className={`form-select ${
                  studentErrors.studentId ? "is-invalid" : ""
                }`}
                {...registerStudent("studentId", { valueAsNumber: true })}
                disabled={isLoadingStudents}
              >
                <option value="">Choose a student...</option>
                {selectedGroup &&
                  getAvailableStudents(selectedGroup.id).map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.name} {student.surname} ({student.email})
                    </option>
                  ))}
              </select>
              {isLoadingStudents && (
                <div className="text-center mt-2">
                  <div
                    className="spinner-border spinner-border-sm"
                    role="status"
                  >
                    <span className="visually-hidden">Loading students...</span>
                  </div>
                </div>
              )}
              {studentErrors.studentId && (
                <div className="invalid-feedback">
                  {studentErrors.studentId.message}
                </div>
              )}
            </div>
            <div className="d-flex justify-content-end gap-2">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setShowAddStudentModal(false);
                  setSelectedGroup(null);
                }}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Add Student
              </button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
};
