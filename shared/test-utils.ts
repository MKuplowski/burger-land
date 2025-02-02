import { TEST_IDS, TestId } from "./test-ids";

/**
 * @param id - ID from TEST_IDS
 * @returns - CSS selector
 */
export const getTestSelector = (id: TestId) => `[data-testid="${TEST_IDS[id]}"]`;