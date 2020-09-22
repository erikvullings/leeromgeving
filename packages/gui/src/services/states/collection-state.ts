import { CollectionNames, UpdateStream } from '../meiosis';
import { IContent } from '../../models';
import { restServiceFactory } from '../rest-service';

export type CollectionType<T extends IContent> = {
  loading: boolean;
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
  /** Save an item */
  save: (item: T) => void;
  /** Delete an item */
  del: (id: number) => void;
};

/** All actions that can be invoked per collection */
export type CollectionsActions<T extends IContent> = Record<CollectionNames, CollectionActions<T>>;

export interface ICollectionState<T extends IContent> {
  initial: CollectionsModel<T>;
  actions: (us: UpdateStream) => CollectionsActions<T>;
}

export const collectionFactory = <T extends IContent>(collectionName: CollectionNames) => {
  const itemsSvc = restServiceFactory<T>(collectionName);
  return {
    initial: {
      [collectionName]: {
        loading: false,
        current: undefined,
        list: [] as T[],
      } as CollectionType<T>,
    } as CollectionsModel<T>,
    actions: (us: UpdateStream) => {
      return {
        [collectionName]: {
          updateList: async () => {
            const list = await itemsSvc.loadFilteredList();
            if (list) {
              us({ [collectionName]: { loading: false, list } });
            }
          },
          load: async (id) => {
            const current = await itemsSvc.load(id);
            if (current) {
              us({ [collectionName]: { loading: false, current } });
            }
          },
          save: async (item) => {
            const current = await itemsSvc.save(item);
            if (current) {
              us({ [collectionName]: { loading: false, current } });
            }
          },
          del: async (id) => {
            await itemsSvc.del(id);
            us({ [collectionName]: { loading: false, current: undefined } });
          },
        } as CollectionActions<T>,
      } as CollectionsActions<T>;
    },
  } as ICollectionState<T>;
};
