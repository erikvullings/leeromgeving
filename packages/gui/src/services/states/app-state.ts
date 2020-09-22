import { UpdateStream } from '../meiosis';
/** Application state */

export interface IAppStateModel {
  app: {
    apiService: string;
    isSearching: boolean;
    searchQuery?: string;
  };
}

export interface IAppStateActions {
  search: (isSearching: boolean, searchQuery?: string) => void;
}

export interface IAppState {
  initial: IAppStateModel;
  actions: (us: UpdateStream) => IAppStateActions;
}

export const appStateMgmt = {
  initial: {
    app: {
      apiService: '',
      isSearching: false,
      searchQuery: '',
      items: [],
    },
  },
  actions: (update: UpdateStream) => {
    return {
      search: (isSearching: boolean, searchQuery?: string) => update({ app: { isSearching, searchQuery } }),
    };
  },
} as IAppState;
