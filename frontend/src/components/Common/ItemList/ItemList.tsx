import React from "react";
import { Plus, Search } from "react-bootstrap-icons";

interface ItemListProps {
  title: string;
  onAdd: () => void;
  children: React.ReactNode;
  searchTerm?: string;
  onSearch?: (term: string) => void;
  placeholder?: string;
}

export const ItemList = ({
  title,
  onAdd,
  children,
  searchTerm = "",
  onSearch,
  placeholder = "Search...",
}: ItemListProps) => {
  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>{title}</h4>
        <button
          className="btn btn-primary d-flex align-items-center gap-2"
          onClick={onAdd}
        >
          <Plus size={20} />
          Add New
        </button>
      </div>

      <div className="card shadow-sm mb-4">
        <div className="card-body">
          {onSearch && (
            <div className="input-group mb-4">
              <span className="input-group-text bg-light border-end-0">
                <Search size={16} />
              </span>
              <input
                type="text"
                className="form-control border-start-0 ps-0"
                placeholder={placeholder}
                value={searchTerm}
                onChange={(e) => onSearch(e.target.value)}
              />
            </div>
          )}

          <div className="row g-4">{children}</div>
        </div>
      </div>
    </div>
  );
};
