/* eslint-disable fp/no-unused-expression, jest/no-hooks, jest/require-top-level-describe */
require("next"); //Get fetch polyfilled
import { server } from "./mock-service-worker/server";

beforeAll(() => {
  // Enable the mocking in tests.
  return server.listen();
});

afterEach(() => {
  // Reset any runtime handlers tests may use.
  return server.resetHandlers();
});

afterAll(() => {
  // Clean up once the tests are done.
  return server.close();
});
