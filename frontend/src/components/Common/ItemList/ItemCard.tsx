import { PencilSquare, Trash } from "react-bootstrap-icons";
import "./ItemList.css";

interface ItemCardProps {
  title: string;
  subtitle?: string;
  onEdit: () => void;
  onDelete: () => void;
}

export const ItemCard: React.FC<ItemCardProps> = ({
  title,
  subtitle,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="col-md-4">
      <div className="card h-100 item-card">
        <div className="card-body">
          <h5 className="card-title mb-2">{title}</h5>
          {subtitle && <p className="text-muted small mb-3">{subtitle}</p>}

          <div className="d-flex gap-2 mt-3">
            <button
              className="btn btn-light btn-sm d-flex align-items-center gap-2"
              onClick={onEdit}
            >
              <PencilSquare size={16} />
              Edit
            </button>
            <button
              className="btn btn-danger btn-sm d-flex align-items-center gap-2"
              onClick={onDelete}
            >
              <Trash size={16} />
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
