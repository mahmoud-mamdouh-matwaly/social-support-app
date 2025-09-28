export const PathConstants = {
  HOME: "/",
  APPLY: "/apply",
  APPLY_STEP_1: "/apply/personal-information",
  APPLY_STEP_2: "/apply/family-financial-info",
  APPLY_STEP_3: "/apply/situation-descriptions",
} as const;

export type PathConstantsType = (typeof PathConstants)[keyof typeof PathConstants];
