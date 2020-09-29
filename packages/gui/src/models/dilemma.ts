import { IContent } from '.';

export type DilemmaType = 'role' | 'characteristics' | 'mc' | 'question';

export type Characteristic = {
  /** Time pressure */
  time: boolean;
  /** Information inadequate */
  info: boolean;
  /** Conflicting interests */
  conflict: boolean;
};

export interface IDilemma extends IContent {
  /** Type of dilemma we are dealing with */
  type: DilemmaType;
  /** Notes */
  notes?: string;
  /** ID of the role that is responsible for this dilemma */
  role?: string;
  /** Characteristics of this dilemma */
  characteristics?: Characteristic;
}

export interface IAnsweredDilemma extends IContent {
  /** IDs of the answered characteristic values */
  answers?: {
    /** Time pressure */
    time: boolean;
    /** Information inadequate */
    info: boolean;
    /** Conflicting interests */
    conflict: boolean;
  };
  correct: boolean;
}
