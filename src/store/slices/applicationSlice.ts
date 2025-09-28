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
  // Add family and financial fields later
};

export type SituationDescriptions = {
  // Add situation description fields later
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
  familyFinancialInfo: {},
  situationDescriptions: {},
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
