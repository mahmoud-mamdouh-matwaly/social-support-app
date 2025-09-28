import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  clearApplicationFromLocalStorage,
  getApplicationFromLocalStorage,
  saveApplicationToLocalStorage,
} from "../localStorage";

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

const mockApplicationData = {
  personalInformation: {
    name: "John Doe",
    nationalId: "123456789",
    dateOfBirth: "1990-01-15",
    gender: "male" as const,
    phone: "+971501234567",
    email: "john.doe@example.com",
    address: "123 Main Street",
    city: "Dubai",
    state: "Dubai",
    country: "UAE",
  },
  familyFinancialInfo: {
    maritalStatus: "married" as const,
    dependents: "2",
    employmentStatus: "employed" as const,
    monthlyIncome: "5000",
    housingStatus: "rent" as const,
  },
  situationDescriptions: {
    currentFinancialSituation: "Facing temporary financial difficulties due to medical expenses.",
    employmentCircumstances: "Currently employed but reduced hours due to company restructuring.",
    reasonForApplying: "Need assistance to cover medical bills and basic living expenses.",
  },
};

describe("localStorage utilities", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.spyOn(Date.prototype, "toISOString").mockReturnValue("2024-01-15T10:30:00.000Z");
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("saveApplicationToLocalStorage", () => {
    it("saves application data with generated ID and timestamp", () => {
      const applicationId = saveApplicationToLocalStorage(mockApplicationData);

      expect(applicationId).toMatch(/^APP-[A-Z0-9]{9}$/);
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        "financial_assistance_application",
        JSON.stringify({
          applicationId,
          submissionDate: "2024-01-15T10:30:00.000Z",
          ...mockApplicationData,
        })
      );
    });

    it("throws error when localStorage throws error", () => {
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error("Storage quota exceeded");
      });

      expect(() => saveApplicationToLocalStorage(mockApplicationData)).toThrow("Failed to save application data");
      expect(console.error).toHaveBeenCalledWith("Error saving application to localStorage:", expect.any(Error));
    });

    it("generates unique IDs for different calls", () => {
      const id1 = saveApplicationToLocalStorage(mockApplicationData);
      const id2 = saveApplicationToLocalStorage(mockApplicationData);

      expect(id1).toMatch(/^APP-[A-Z0-9]{9}$/);
      expect(id2).toMatch(/^APP-[A-Z0-9]{9}$/);
      expect(id1).not.toBe(id2);
    });
  });

  describe("getApplicationFromLocalStorage", () => {
    it("retrieves and parses stored application data", () => {
      const storedData = {
        applicationId: "APP-123456",
        submissionDate: "2024-01-15T10:30:00.000Z",
        ...mockApplicationData,
      };

      localStorageMock.getItem.mockReturnValue(JSON.stringify(storedData));

      const result = getApplicationFromLocalStorage();

      expect(localStorageMock.getItem).toHaveBeenCalledWith("financial_assistance_application");
      expect(result).toEqual(storedData);
    });

    it("returns null when no data is stored", () => {
      localStorageMock.getItem.mockReturnValue(null);

      const result = getApplicationFromLocalStorage();

      expect(result).toBeNull();
    });

    it("returns null and logs error when JSON parsing fails", () => {
      localStorageMock.getItem.mockReturnValue("invalid json");

      const result = getApplicationFromLocalStorage();

      expect(result).toBeNull();
      expect(console.error).toHaveBeenCalledWith("Error reading application from localStorage:", expect.any(Error));
    });

    it("returns null and logs error when localStorage throws error", () => {
      localStorageMock.getItem.mockImplementation(() => {
        throw new Error("localStorage not available");
      });

      const result = getApplicationFromLocalStorage();

      expect(result).toBeNull();
      expect(console.error).toHaveBeenCalledWith("Error reading application from localStorage:", expect.any(Error));
    });
  });

  describe("clearApplicationFromLocalStorage", () => {
    it("removes application data from localStorage", () => {
      clearApplicationFromLocalStorage();

      expect(localStorageMock.removeItem).toHaveBeenCalledWith("financial_assistance_application");
    });

    it("logs error when localStorage throws error", () => {
      localStorageMock.removeItem.mockImplementation(() => {
        throw new Error("localStorage not available");
      });

      clearApplicationFromLocalStorage();

      expect(console.error).toHaveBeenCalledWith("Error clearing application from localStorage:", expect.any(Error));
    });
  });

  describe("integration tests", () => {
    it("can save and retrieve the same data", () => {
      // Mock successful storage and retrieval
      let storedValue: string;
      localStorageMock.setItem.mockImplementation((_key: string, value: string) => {
        storedValue = value;
      });
      localStorageMock.getItem.mockImplementation(() => storedValue);

      const applicationId = saveApplicationToLocalStorage(mockApplicationData);
      const retrievedData = getApplicationFromLocalStorage();

      expect(retrievedData).toEqual({
        applicationId,
        submissionDate: "2024-01-15T10:30:00.000Z",
        ...mockApplicationData,
      });
    });

    it("handles complete workflow: save, retrieve, clear", () => {
      let storedValue: string | null = null;

      localStorageMock.setItem.mockImplementation((_key: string, value: string) => {
        storedValue = value;
      });
      localStorageMock.getItem.mockImplementation(() => storedValue);
      localStorageMock.removeItem.mockImplementation(() => {
        storedValue = null;
      });

      // Save data
      const applicationId = saveApplicationToLocalStorage(mockApplicationData);
      expect(applicationId).toMatch(/^APP-[A-Z0-9]{9}$/);

      // Retrieve data
      let retrievedData = getApplicationFromLocalStorage();
      expect(retrievedData).not.toBeNull();
      expect(retrievedData?.applicationId).toBe(applicationId);

      // Clear data
      clearApplicationFromLocalStorage();

      // Verify data is cleared
      retrievedData = getApplicationFromLocalStorage();
      expect(retrievedData).toBeNull();
    });
  });
});
