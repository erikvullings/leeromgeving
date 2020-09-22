import { FactoryComponent } from 'mithril';
import Stream from 'mithril/stream';
import { merge } from '../utils/mergerino';
import { IContent } from '../models';
import {
  appStateMgmt,
  IAppStateActions,
  IAppStateModel,
  CollectionsActions,
  collectionFactory,
  CollectionsModel,
} from './states';

/*
 * For each item that you want to save in a separate collection:
 * - Create a collection name and add it to the CollectionNames type
 * - Create a collection using the collectionFactory
 * - Add the collection interfaces to the IAppModel and IActions interfaces
 * - Add the collections to the app constant
 */

/** Names of the collections */
export type CollectionNames = 'items' | 'items2';

const itemsCollection = collectionFactory<IContent>('items');

export interface IAppModel extends IAppStateModel, CollectionsModel<IContent> {}

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
  initial: Object.assign({}, appStateMgmt.initial, itemsCollection.initial) as IAppModel,
  actions: (update: UpdateStream) =>
    Object.assign({}, appStateMgmt.actions(update), itemsCollection.actions(update)) as IActions,
};

const update = Stream<ModelUpdateFunction>();
export const states = Stream.scan(merge, app.initial, update);
export const actions = app.actions(update);
