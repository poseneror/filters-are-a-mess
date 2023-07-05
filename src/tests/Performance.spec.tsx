import { describe, test, TestOptions } from "vitest";
import { setupComponent } from "./App.spec";

const testOptions: TestOptions = { timeout: 5000 };

const performanceBenchmarks = [
  { filterCount: 1000, displayName: "small data count [1,000] - ⭐ " },
  { filterCount: 25000, displayName: "medium data count [25,000] - ⭐ ⭐ " },
  {
    filterCount: 100000,
    displayName: "large data count [100,000] - ⭐ ⭐ ⭐ ",
  },
];

describe(
  "performance benchmark",
  () => {
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
        const { toggleFilterAndWaitForResult } = setupComponent({
          filterCount,
        });

        await expect(async () => {
          await toggleFilterAndWaitForResult();
        }).toExecuteInLessThan(1000);
      }
    );

    test.each(performanceBenchmarks)(
      "re-toggling a filter - $displayName",
      async ({ filterCount }) => {
        const { toggleFilterAndWaitForResult } = setupComponent({
          filterCount,
        });

        await toggleFilterAndWaitForResult();

        await expect(async () => {
          await toggleFilterAndWaitForResult();
        }).toExecuteInLessThan(1000);
      }
    );

    test.each(performanceBenchmarks)(
      "select-all - $displayName",
      async ({ filterCount }) => {
        const { toggleFilterAndWaitForResult } = setupComponent({
          filterCount,
        });

        await toggleFilterAndWaitForResult();

        await expect(async () => {
          await toggleFilterAndWaitForResult();
        }).toExecuteInLessThan(1000);
      }
    );
  },
  testOptions
);
