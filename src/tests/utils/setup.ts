import { expect, afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
import { toExecuteInLessThan } from "./matchers";
import * as matchers from "@testing-library/jest-dom/matchers";

expect.extend({
  ...matchers,
  toExecuteInLessThan,
});

afterEach(() => {
  cleanup();
});
