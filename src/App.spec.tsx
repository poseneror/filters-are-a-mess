import { describe, test } from "vitest";
import { render, screen, within, waitFor } from "@testing-library/react";
import App from "./App";
import userEvent from "@testing-library/user-event";
import { getFilters } from "./api/filters";

export const setupComponent = ({
  filterCount = 1000,
  allChecked = false,
}: { filterCount?: number; allChecked?: boolean } = {}) => {
  const filters = getFilters(filterCount, allChecked);
  const renderResult = render(<App filters={filters} />);
  const user = userEvent.setup();

  const getFilterElement = async (index = 0) => {
    const selectedFilter = filters[index];
    return screen.findByTestId(`filter-${selectedFilter.id}`);
  };

  const clickFilter = async (index = 0) => {
    const filter = await getFilterElement(index);
    await user.click(filter);
  };

  const clickSelectAll = async () => {
    const filter = screen.getByText("Select All");
    await user.click(filter);
  };

  const getCheckboxElement = async (index = 0) => {
    const filter = await getFilterElement(index);
    return within(filter).getByRole("checkbox");
  };

  const toggleFilterAndWaitForResult = async (index = 0) => {
    const isChecked = await isFilterChecked(index);
    await clickFilter(index);
    waitFor(async () => {
      within(await getFilterElement()).getByRole("checkbox", {
        checked: !isChecked,
      });
    });
  };

  const isFilterChecked = async (index = 0) => {
    const checkbox = await getCheckboxElement(index);
    return checkbox.checked;
  };

  const areAllFilterChecked = async () => {
    const checkboxes = screen.getAllByRole("checkbox");
    return checkboxes.every((checkbox) => checkbox.checked);
  };

  const isApplyButtonEnabled = async () => {
    const applyButton = screen.getByRole("button", { name: "Apply Filters" });
    return !applyButton.disabled;
  };

  return {
    ...renderResult,
    isFilterChecked,
    clickFilter,
    toggleFilterAndWaitForResult,
    clickSelectAll,
    areAllFilterChecked,
    isApplyButtonEnabled,
  };
};

describe("App", () => {
  it("renders", async () => {
    const { container } = setupComponent();

    expect(container).toBeInTheDocument();
  });

  it("toggles selected filter", async () => {
    const { isFilterChecked, clickFilter } = setupComponent();
    const isChecked = await isFilterChecked();
    await clickFilter();

    expect(await isFilterChecked()).not.toEqual(isChecked);
  });

  it("toggles all filters", async () => {
    const { clickSelectAll, areAllFilterChecked } = setupComponent();
    await clickSelectAll();

    expect(await areAllFilterChecked()).toBeTruthy();
  });

  it("disables apply button if there are no changes", async () => {
    const { isApplyButtonEnabled } = setupComponent();

    expect(await isApplyButtonEnabled()).toBeFalsy();
  });

  it("enables apply button if there are changes", async () => {
    const { isApplyButtonEnabled, clickFilter } = setupComponent();

    await clickFilter();

    expect(await isApplyButtonEnabled()).toBeTruthy();
  });

  describe("select all", () => {
    it("disables apply button if there are no changes", async () => {
      const { isApplyButtonEnabled } = setupComponent({
        allChecked: true,
      });

      expect(await isApplyButtonEnabled()).toBeFalsy();
    });

    it("enables apply button if there are changes", async () => {
      const { clickSelectAll, isApplyButtonEnabled } = setupComponent({
        allChecked: true,
      });

      await clickSelectAll();

      expect(await isApplyButtonEnabled()).toBeTruthy();
    });
  });
});
