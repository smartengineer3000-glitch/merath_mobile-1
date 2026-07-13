import { afterEach, beforeEach, vi } from "vitest";

// Mock AsyncStorage
vi.mock("@react-native-async-storage/async-storage", () => ({
  default: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  },
}));

// Clean up after each test
afterEach(() => {
  vi.clearAllMocks();
});

// Set up before each test
beforeEach(() => {
  vi.resetModules();
});
