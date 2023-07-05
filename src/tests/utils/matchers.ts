import { MatcherFunction } from "expect";

const measureExecution = async (callback: () => Promise<void>) => {
  const start = performance.now();
  await callback();
  return performance.now() - start;
};

export const toExecuteInLessThan: MatcherFunction<[timeToMatch: number]> =
  async function (actual: unknown, timeToMatch) {
    if (typeof actual !== "function") {
      throw new Error(
        "The measured instance must be a function / async function"
      );
    }

    const executionTime = await measureExecution(actual as any);

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

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    interface AsymmetricMatchers {
      toExecuteInLessThan(timeToMatch: number): void;
    }

    interface Matchers<R> {
      toExecuteInLessThan(timeToMatch: number): R;
    }
  }
}
