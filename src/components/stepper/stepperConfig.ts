import { FileText, User, Users } from "lucide-react";
import React from "react";

export type Step = {
  id: string;
  titleKey: string;
  descriptionKey: string;
  icon: React.ReactNode;
};

// Default steps configuration
export const defaultSteps: Step[] = [
  {
    id: "personal-info",
    titleKey: "stepper.steps.personalInfo.title",
    descriptionKey: "stepper.steps.personalInfo.description",
    icon: React.createElement(User, { className: "h-5 w-5" }),
  },
  {
    id: "family-financial",
    titleKey: "stepper.steps.familyFinancial.title",
    descriptionKey: "stepper.steps.familyFinancial.description",
    icon: React.createElement(Users, { className: "h-5 w-5" }),
  },
  {
    id: "situation",
    titleKey: "stepper.steps.situation.title",
    descriptionKey: "stepper.steps.situation.description",
    icon: React.createElement(FileText, { className: "h-5 w-5" }),
  },
];
