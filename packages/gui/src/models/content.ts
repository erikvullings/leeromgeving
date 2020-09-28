import { IComment } from './comment';
import { ILokiObj } from './loki-object';

export interface IBasicContent {
  /** Is the item ready to be shared with others */
  // published?: boolean;
  /** Category description */
  type?: string | string[];
  /** Title of the item */
  title?: string;
  /** Author of the item */
  author?: string[];
  /** Rating score */
  rating?: number;
  /** Link to a single image */
  img?: string;
  /** Tagline, a brief summary of the item */
  tag?: string;
  /** Longer description of the item */
  desc?: string;
  /** List of comments */
  comments?: IComment[];
}

export interface IContent extends IBasicContent, ILokiObj {}
