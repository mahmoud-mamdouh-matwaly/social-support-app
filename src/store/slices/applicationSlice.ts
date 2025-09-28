import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type PersonalInformation = {
  name: string;
  nationalId: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  city: string;
  state: string;
  country: string;
  phone: string;
  email: string;
};

export type FamilyFinancialInfo = {
  maritalStatus: string;
  dependents: string;
  employmentStatus: string;
  monthlyIncome: string;
  housingStatus: string;
};

export type SituationDescriptions = {
  currentFinancialSituation: string;
  employmentCircumstances: string;
  reasonForApplying: string;
};

export type ApplicationState = {
  personalInformation: PersonalInformation;
  familyFinancialInfo: FamilyFinancialInfo;
  situationDescriptions: SituationDescriptions;
  currentStep: number;
  isSubmitting: boolean;
};

const initialState: ApplicationState = {
  personalInformation: {
    name: "",
    nationalId: "",
    dateOfBirth: "",
    gender: "",
    address: "",
    city: "",
    state: "",
    country: "",
    phone: "",
    email: "",
  },
  familyFinancialInfo: {
    maritalStatus: "",
    dependents: "",
    employmentStatus: "",
    monthlyIncome: "",
    housingStatus: "",
  },
  situationDescriptions: {
    currentFinancialSituation: "",
    employmentCircumstances: "",
    reasonForApplying: "",
  },
  currentStep: 1,
  isSubmitting: false,
};

const applicationSlice = createSlice({
  name: "application",
  initialState,
  reducers: {
    updatePersonalInformation: (state, action: PayloadAction<PersonalInformation>) => {
      state.personalInformation = action.payload;
    },
    updateFamilyFinancialInfo: (state, action: PayloadAction<FamilyFinancialInfo>) => {
      state.familyFinancialInfo = action.payload;
    },
    updateSituationDescriptions: (state, action: PayloadAction<SituationDescriptions>) => {
      state.situationDescriptions = action.payload;
    },
    setCurrentStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload;
    },
    setSubmitting: (state, action: PayloadAction<boolean>) => {
      state.isSubmitting = action.payload;
    },
    resetApplication: () => initialState,
  },
});

export const {
  updatePersonalInformation,
  updateFamilyFinancialInfo,
  updateSituationDescriptions,
  setCurrentStep,
  setSubmitting,
  resetApplication,
} = applicationSlice.actions;

export default applicationSlice.reducer;
