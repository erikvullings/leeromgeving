import { ILokiObj } from './loki-object';

export interface IContent extends ILokiObj {
  type: string;
  title?: string;
  desc?: string;
}
