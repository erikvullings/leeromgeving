import { IBasicContent, IContent } from './content';
import { IDilemma } from './dilemma';

/** Each scenario phase can address certain dilemmas */
export interface IScenarioPhase extends IBasicContent {
  dilemmas?: IDilemma[];
}

/** A scenario may contain multiple phases */
export interface IScenario extends IContent {
  phases: IScenarioPhase[];
}
