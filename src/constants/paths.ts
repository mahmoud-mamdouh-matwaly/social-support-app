export const PathConstants = {
  HOME: "/",
  APPLY: "/apply",
} as const;

export type PathConstantsType = (typeof PathConstants)[keyof typeof PathConstants];
