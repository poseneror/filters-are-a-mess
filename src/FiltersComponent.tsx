import "./FiltersComponent.css";
import { useState } from "react";
import { FilterType } from "./api/filters";

export default function FiltersComponent({
  filters,
}: {
  filters: FilterType[];
}) {
  const [pendingFilters, setPendingFilters] = useState<FilterType[]>(filters);

  const onApply = () => {
    console.log("changes applied");
  };

  const hasChanges = !pendingFilters.every(
    (item) =>
      filters.find((serverItem) => serverItem.id === item.id).checked ===
      item.checked
  );

  const allSelected = pendingFilters.every((filter) => filter.checked);

  const setAllFilters = (checked: boolean) => {
    setPendingFilters(pendingFilters.map((f) => ({ ...f, checked })));
  };

  const onFilterSelected = (id, checked) => {
    setPendingFilters(
      pendingFilters.map((f) => (f.id === id ? { ...f, checked } : f))
    );
  };

  const onSelectAll = () => {
    setAllFilters(!allSelected);
  };

  return (
    <div className="app-container">
      <h2>Apply Filters</h2>
      <div className="filters-container">
        <Filter
          checked={allSelected}
          label="Select All"
          onChange={onSelectAll}
        />
        {pendingFilters.map((filter) => (
          <Filter
            key={filter.id}
            checked={filter.checked}
            id={filter.id}
            label={filter.displayName}
            onChange={onFilterSelected}
          />
        ))}
      </div>
      <button
        className="apply-button"
        disabled={!hasChanges}
        onClick={() => onApply()}
      >
        Apply Filters
      </button>
    </div>
  );
}

const Filter = ({
  id,
  checked = false,
  label = "",
  onChange,
}: {
  id: string;
  checked?: boolean;
  label?: string;
  onChange?: (id: string, checked: boolean) => void;
} = {}) => {
  return (
    <div
      className="filter"
      onClick={() => onChange?.(id, !checked)}
      data-testid={`filter-${id}`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={() => onChange?.(id, !checked)}
      />
      <span>{label}</span>
    </div>
  );
};
