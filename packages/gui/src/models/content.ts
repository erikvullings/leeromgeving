import { IComment } from './comment';
import { ILokiObj } from './loki-object';

export interface IContent extends ILokiObj {
  type: string | string[];
  title?: string;
  author?: string[];
  rating?: number;
  img?: string;
  tag?: string;
  desc?: string;
  comments?: IComment[];
}
