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

// Mock FileSystem
vi.mock("expo-file-system", () => ({
  documentDirectory: "/mock/directory/",
  getInfoAsync: vi.fn(),
  deleteAsync: vi.fn(),
  writeAsStringAsync: vi.fn(),
  readAsStringAsync: vi.fn(),
}));

// Mock Sharing
vi.mock("expo-sharing", () => ({
  isAvailableAsync: vi.fn().mockResolvedValue(true),
  shareAsync: vi.fn(),
}));

// Mock Print
vi.mock("expo-print", () => ({
  printToFileAsync: vi.fn().mockResolvedValue({ uri: "/mock/pdf.pdf" }),
}));

// Clean up after each test
afterEach(() => {
  vi.clearAllMocks();
});

// Set up before each test
beforeEach(() => {
  vi.resetModules();
});
