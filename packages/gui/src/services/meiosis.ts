import { FactoryComponent } from 'mithril';
import Stream from 'mithril/stream';
import { merge } from '../utils/mergerino';
import { IContent, IDilemma, ILesson, IScenario } from '../models';
import {
  appStateMgmt,
  IAppStateActions,
  IAppStateModel,
  CollectionsActions,
  collectionFactory,
  CollectionsModel,
  CollectionType,
} from './states';

/*
 * For each item that you want to save in a separate collection:
 * - Create a collection name and add it to the CollectionNames type
 * - Create a collection using the collectionFactory
 * - Add the collection interfaces to the IAppModel and IActions interfaces
 * - Add the collections to the app constant
 */

/** Names of the collections */
export type CollectionNames = 'lessons' | 'tips' | 'news' | 'scenarios' | 'dilemmas' | 'issues';

const lessonsCollection = collectionFactory<ILesson>('lessons');
const newsCollection = collectionFactory<IContent>('news');
const tipsCollection = collectionFactory<IContent>('tips');
const scenariosCollection = collectionFactory<IScenario>('scenarios');
const dilemmasCollection = collectionFactory<IDilemma>('dilemmas');
const issuesCollection = collectionFactory<IContent>('issues');

export interface IAppModel extends IAppStateModel, CollectionsModel<IContent> {
  lessons: CollectionType<ILesson>;
  scenarios: CollectionType<IScenario>;
  dilemmas: CollectionType<IDilemma>;
}

export interface IActions extends IAppStateActions, CollectionsActions<IContent> {}

export type ModelUpdateFunction = Partial<IAppModel> | ((model: Partial<IAppModel>) => Partial<IAppModel>);

export type UpdateStream = Stream<Partial<ModelUpdateFunction>>;

export type MeiosisComponent = FactoryComponent<{
  state: IAppModel;
  actions: IActions;
}>;

const app = {
  initial: Object.assign(
    {},
    appStateMgmt.initial,
    lessonsCollection.initial,
    newsCollection.initial,
    tipsCollection.initial,
    scenariosCollection.initial,
    dilemmasCollection.initial,
    issuesCollection.initial
  ) as IAppModel,
  actions: (update: UpdateStream, states: Stream<IAppModel>) =>
    Object.assign(
      {},
      appStateMgmt.actions(update, states),
      lessonsCollection.actions(update, states),
      newsCollection.actions(update, states),
      tipsCollection.actions(update, states),
      scenariosCollection.actions(update, states),
      dilemmasCollection.actions(update, states),
      issuesCollection.actions(update, states)
    ) as IActions,
};

const update = Stream<ModelUpdateFunction>();
export const states = Stream.scan(merge, app.initial, update);
export const actions = app.actions(update, states);
