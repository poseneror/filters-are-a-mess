import { describe, test } from "vitest";
import { setupComponent } from "./App.spec";

const performanceBenchmarks = [
  { filterCount: 1000, displayName: "small data count [1000] - ⭐ " },
  { filterCount: 50000, displayName: "medium data count [50000] - ⭐ ⭐ " },
  {
    filterCount: 1000000,
    displayName: "large data count [1000000] - ⭐ ⭐ ⭐ ",
  },
];

describe("performance benchmark", () => {
  test.each(performanceBenchmarks)(
    "render - $displayName",
    async ({ filterCount }) => {
      await expect(async () => {
        await setupComponent({ filterCount });
      }).toExecuteInLessThan(1000);
    }
  );

  test.each(performanceBenchmarks)(
    "toggling a filter - $displayName",
    async ({ filterCount }) => {
      const { toggleFilterAndWaitForResult } = setupComponent({ filterCount });

      await expect(async () => {
        await toggleFilterAndWaitForResult();
      }).toExecuteInLessThan(1000);
    }
  );

  test.each(performanceBenchmarks)(
    "re-toggling a filter - $displayName",
    async ({ filterCount }) => {
      const { toggleFilterAndWaitForResult } = setupComponent({ filterCount });

      await toggleFilterAndWaitForResult();

      await expect(async () => {
        await toggleFilterAndWaitForResult();
      }).toExecuteInLessThan(1000);
    }
  );

  test.each(performanceBenchmarks)(
    "select-all - $displayName",
    async ({ filterCount }) => {
      const { toggleFilterAndWaitForResult } = setupComponent({ filterCount });

      await toggleFilterAndWaitForResult();

      await expect(async () => {
        await toggleFilterAndWaitForResult();
      }).toExecuteInLessThan(1000);
    }
  );
});
