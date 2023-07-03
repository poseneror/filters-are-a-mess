import "./App.css";
import { useState, useEffect } from "react";
import { FilterType, getFilters } from "./api/filters";

export default function App() {
  const [serverResponseFilters, setServerResponseFilters] = useState<
    FilterType[]
  >([]);
  const [pendingFilters, setPendingFilters] = useState<FilterType[]>([]);

  useEffect(() => {
    const filtersToSet = getFilters(20000);
    setServerResponseFilters(filtersToSet);
    setPendingFilters(filtersToSet);
  }, []);

  const onApply = () => {
    console.log("changes applied");
  };

  const hasChanges = !pendingFilters.every(
    (item) =>
      serverResponseFilters.find((serverItem) => serverItem.id === item.id)
        .checked === item.checked
  );

  const allSelected = pendingFilters.every((filter) => filter.checked);

  return (
    <div className="app-container">
      <h2>Apply Filters</h2>
      <div className="filters-container">
        <Filter
          checked={allSelected}
          label="Select All"
          onChange={() => {
            if (allSelected) {
              setPendingFilters(
                pendingFilters.map((f) => ({ ...f, checked: false }))
              );
            } else {
              setPendingFilters(
                pendingFilters.map((f) => ({ ...f, checked: true }))
              );
            }
          }}
        />
        {pendingFilters.map((filter) => (
          <Filter
            key={filter.id}
            checked={filter.checked}
            label={filter.id}
            onChange={(checked) => {
              setPendingFilters(
                pendingFilters.map((f) =>
                  f.id === filter.id ? { id: filter.id, checked } : f
                )
              );
            }}
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
  checked = false,
  label = "",
  onChange = () => {},
}: {
  checked?: boolean;
  label?: string;
  onChange?: (checked: boolean) => void;
} = {}) => {
  return (
    <div className="filter" onClick={() => onChange(!checked)}>
      <input
        type="checkbox"
        checked={checked}
        onChange={() => onChange(!checked)}
      />{" "}
      {label}
    </div>
  );
};
