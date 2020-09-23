import { FactoryComponent } from 'mithril';
import Stream from 'mithril/stream';
import { merge } from '../utils/mergerino';
import { IContent, ILesson } from '../models';
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
export type CollectionNames = 'lessons' | 'tips' | 'news' | 'scenarios' | 'dilemmas';

const lessonsCollection = collectionFactory<ILesson>('lessons');
const newsCollection = collectionFactory<IContent>('news');

export interface IAppModel extends IAppStateModel, CollectionsModel<IContent> {
  lessons: CollectionType<ILesson>;
}

export interface IActions extends IAppStateActions, CollectionsActions<IContent> {}

export type ModelUpdateFunction =
  | Partial<IAppModel>
  | (<T extends IContent>(model: Partial<IAppModel>) => Partial<IAppModel> & Partial<CollectionsModel<T>>);

export type UpdateStream = Stream<Partial<ModelUpdateFunction>>;

export type MeiosisComponent = FactoryComponent<{
  state: IAppModel;
  actions: IActions;
}>;

const app = {
  initial: Object.assign({}, appStateMgmt.initial, lessonsCollection.initial, newsCollection.initial) as IAppModel,
  actions: (update: UpdateStream, states: Stream<IAppModel>) =>
    Object.assign(
      {},
      appStateMgmt.actions(update, states),
      lessonsCollection.actions(update, states),
      newsCollection.actions(update, states)
    ) as IActions,
};

const update = Stream<ModelUpdateFunction>();
export const states = Stream.scan(merge, app.initial, update);
export const actions = app.actions(update, states);
