export interface IComment {
  author?: string;
  desc?: string;
  rating?: number;
  /** Created date as number */
  created: number;
  /** Last edit */
  mutated?: number;
}
