import { FractionClass } from "../fraction";

export interface HeirShareObject {
  key: string;
  name: string;
  type: string;
  fraction: FractionClass;
  count: number;
  reason: string;
  addToExisting?: boolean;
}

export interface EngineState {
  blockedHeirs: string[];
  hijabTypes: string[];
  awlApplied: boolean;
  raddApplied: boolean;
  bloodRelativesApplied: boolean;
  confidenceFactors: string[];
  specialCases: { type: string; name: string; description: string }[];
}
