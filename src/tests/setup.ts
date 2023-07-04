import { expect, afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
import matchers from "@testing-library/jest-dom/matchers";
import type { MatcherFunction } from "expect";

expect.extend(matchers);

const messure = async (callback: () => Promise<void>) => {
  const start = performance.now();
  await callback();
  return performance.now() - start;
};

const toExecuteInLessThan: MatcherFunction<[timeToMatch: number]> =
  async function (actual: unknown, timeToMatch) {
    if (typeof actual !== "function") {
      throw new Error(
        "The measured instance must be a function / async function"
      );
    }

    const executionTime = await messure(actual as any);

    const pass = executionTime < timeToMatch;

    if (pass) {
      return {
        message: () =>
          `expected not to execute in less than ${this.utils.printExpected(
            `${timeToMatch} ms`
          )} but execution took ${this.utils.printReceived(
            `${executionTime} ms`
          )}`,
        pass: true,
      };
    } else {
      return {
        message: () =>
          `expected to execute in less than ${this.utils.printExpected(
            `${timeToMatch} ms`
          )} but execution took ${this.utils.printReceived(
            `${executionTime} ms`
          )}`,
        pass: false,
      };
    }
  };

expect.extend({
  toExecuteInLessThan,
});

declare module "expect" {
  interface AsymmetricMatchers {
    toExecuteInLessThan(timeToMatch: number): void;
  }
  interface Matchers<R> {
    toExecuteInLessThan(timeToMatch: number): R;
  }
}

afterEach(() => {
  cleanup();
});
