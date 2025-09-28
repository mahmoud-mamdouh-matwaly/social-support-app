import type { ApplicationState } from "../store/slices/applicationSlice";

const APPLICATION_DATA_KEY = "financial_assistance_application";

export type SubmittedApplicationData = {
  applicationId: string;
  submissionDate: string;
  personalInformation: ApplicationState["personalInformation"];
  familyFinancialInfo: ApplicationState["familyFinancialInfo"];
  situationDescriptions: ApplicationState["situationDescriptions"];
};

export const saveApplicationToLocalStorage = (
  applicationData: Omit<SubmittedApplicationData, "applicationId" | "submissionDate">
): string => {
  try {
    // Generate application ID
    const applicationId = `APP-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Create complete data object
    const submittedData: SubmittedApplicationData = {
      applicationId,
      submissionDate: new Date().toISOString(),
      ...applicationData,
    };

    // Save to localStorage
    localStorage.setItem(APPLICATION_DATA_KEY, JSON.stringify(submittedData));

    return applicationId;
  } catch (error) {
    console.error("Error saving application to localStorage:", error);
    throw new Error("Failed to save application data");
  }
};

export const getApplicationFromLocalStorage = (): SubmittedApplicationData | null => {
  try {
    const data = localStorage.getItem(APPLICATION_DATA_KEY);
    if (!data) {
      return null;
    }

    return JSON.parse(data) as SubmittedApplicationData;
  } catch (error) {
    console.error("Error reading application from localStorage:", error);
    return null;
  }
};

export const clearApplicationFromLocalStorage = (): void => {
  try {
    localStorage.removeItem(APPLICATION_DATA_KEY);
  } catch (error) {
    console.error("Error clearing application from localStorage:", error);
  }
};

export const hasSubmittedApplication = (): boolean => {
  return localStorage.getItem(APPLICATION_DATA_KEY) !== null;
};
