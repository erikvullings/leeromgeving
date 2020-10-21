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
  /** Rated by, either positive or negative */
  ratedBy?: Array<{ author: string; rating: 1 | -1 }>;
  /** Link to an image, e.g. for the front page */
  img?: string;
  /** Link to an image, e.g. to go with the answer */
  img2?: string;
  /** Tagline, a brief summary of the item */
  tag?: string;
  /** Longer description of the item */
  desc?: string;
  /** List of comments */
  comments?: IComment[];
}

export interface IContent extends IBasicContent, ILokiObj {}
