import { IContent } from './content';

export interface ILesson extends IContent {
  solution?: string;
  remarks?: string;
}
