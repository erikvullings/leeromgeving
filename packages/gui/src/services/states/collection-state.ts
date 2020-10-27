import { CollectionNames, IAppModel, UpdateStream } from '../meiosis';
import { IContent } from '../../models';
import { restServiceFactory } from '../rest-service';
import Stream from 'mithril/stream';

export type CollectionItemMode = 'view' | 'edit' | 'loading';

export type CollectionType<T extends IContent> = {
  section?: string;
  current?: Partial<T>;
  list?: Partial<T>[];
};

export type CollectionsModel<T extends IContent> = Record<CollectionNames, CollectionType<T>>;

/** Actions that can be invoked on each collection */
export type CollectionActions<T extends IContent> = {
  /** Get a list of all the active (?) items */
  updateList: () => void;
  /** Select an item */
  load: (id: number) => void;
  /** Create an item */
  create: (item: Partial<T>, callback?: (current: Partial<T>) => void) => void; // | T;
  /** Save an item */
  save: (item: Partial<T>, callback?: (current: Partial<T>) => void) => void; // | T;
  /** Delete an item */
  del: (id: number) => void;
  /** Change section */
  changeSection: (sectionId: string) => void;
};

/** All actions that can be invoked per collection */
export type CollectionsActions<T extends IContent> = Record<CollectionNames, CollectionActions<T>>;

export interface ICollectionState<T extends IContent> {
  initial: CollectionsModel<T>;
  actions: (us: UpdateStream, states: Stream<IAppModel>) => CollectionsActions<T>;
}

export const collectionFactory = <T extends IContent>(collectionName: CollectionNames) => {
  const restSvc = restServiceFactory<T>(collectionName);

  return {
    initial: {
      [collectionName]: {
        mode: undefined,
        current: undefined,
        list: [] as T[],
      } as CollectionType<T>,
    } as CollectionsModel<T>,
    actions: (us, states) => {
      return {
        [collectionName]: {
          updateList: async () => {
            const list = await restSvc.loadFilteredList();
            if (list) {
              us({ [collectionName]: { list } });
            }
          },
          load: async (id) => {
            const current = await restSvc.load(id);
            if (current) {
              const state = states();
              const { current: old = {} } = state[collectionName];
              Object.keys(old).forEach((k) => (old[k as keyof IContent] = undefined));
              us({ [collectionName]: { current: { ...old, ...current } } });
            }
          },
          create: async (item, callback?: (current: Partial<T>) => void) => {
            const state = states();
            const old = state[collectionName].current as { [key: string]: any };
            if (old) {
              Object.keys(old).forEach((k) => (old[k] = undefined));
            }
            const current = await restSvc.save(item);
            if (current) {
              // const state = states();
              // const list = state[collectionName].list as T[];
              // list.push(current);
              console.table(current);
              us({ [collectionName]: { current: old }, [collectionName]: { current } });
              callback && callback(current);
            }
          },
          save: async (item, callback?: (current: Partial<T>) => void) => {
            const current = await restSvc.save(item);
            if (current) {
              // const state = states();
              // const list = state[collectionName].list as T[];
              // list.push(current);
              console.table(current);
              us({ [collectionName]: { current } });
              callback && callback(current);
            }
          },
          del: async (id) => {
            await restSvc.del(id);
            us({ [collectionName]: { current: undefined } });
          },
          changeSection: (section: string) => us({ [collectionName]: { section } }),
        } as CollectionActions<T>,
      } as CollectionsActions<T>;
    },
  } as ICollectionState<T>;
};
