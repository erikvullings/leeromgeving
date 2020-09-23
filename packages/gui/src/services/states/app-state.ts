import Stream from 'mithril/stream';
import { Dashboards, dashboardSvc } from '..';
import { IAppModel, UpdateStream } from '../meiosis';
/** Application state */

export interface IAppStateModel {
  app: {
    apiService: string;
    isSearching: boolean;
    searchQuery?: string;
    page?: Dashboards;
  };
}

export interface IAppStateActions {
  search: (isSearching: boolean, searchQuery?: string) => void;
  changePage: (
    page: Dashboards,
    params?: { [key: string]: string | number | undefined },
    query?: { [key: string]: string | number | undefined }
  ) => void;
}

export interface IAppState {
  initial: IAppStateModel;
  actions: (us: UpdateStream, states: Stream<IAppModel>) => IAppStateActions;
}

export const appStateMgmt = {
  initial: {
    app: {
      /** During development, use this URL to access the server. */
      apiService: process.env.SERVER || window.location.origin,
      isSearching: false,
      searchQuery: '',
    },
  },
  actions: (update, _states) => {
    return {
      search: (isSearching: boolean, searchQuery?: string) => update({ app: { isSearching, searchQuery } }),
      changePage: (page, params, query) => {
        dashboardSvc.switchTo(page, params, query);
        update({ app: { page } });
      },
    };
  },
} as IAppState;
