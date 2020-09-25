import m from 'mithril';
import { IContent } from '../models';

const log = console.log;
const error = console.error;

const createRestServiceFactory = (apiService: string) => {
  return <T extends IContent>(urlFragment: string) => {
    console.log(apiService);
    const url = `${apiService}/api/${urlFragment}/`;
    const withCredentials = false;

    const create = async (item: Partial<T>, fd?: FormData) => {
      try {
        return await m.request<T>({
          method: 'POST',
          url,
          body: fd || item,
          withCredentials,
        });
      } catch (err) {
        return error(err.message);
      }
    };

    const update = async (item: Partial<T>, fd?: FormData) => {
      try {
        console.debug('put');
        return await m
          .request<T>({
            method: 'PUT',
            url: url + item.$loki,
            body: fd || item,
            withCredentials,
          })
          .catch((e) => console.error(e));
      } catch (err) {
        return error(err.message);
      }
    };

    const save = async (item: Partial<T>, fd?: FormData) =>
      item.$loki ? await update(item, fd) : await create(item, fd);

    const del = async (id: number) => {
      try {
        await m.request<T>({
          method: 'DELETE',
          url: url + id,
          withCredentials,
        });
        log(`Deleted with id: ${id}.`);
      } catch (err) {
        return error(err.message);
      }
    };

    const load = async (id?: number) =>
      await m.request<T>({
        method: 'GET',
        url: url + id,
        withCredentials,
      });

    const loadList = async () => {
      const result = await m.request<T[]>({
        method: 'GET',
        url,
        withCredentials,
      });
      if (!result) {
        console.warn(`No result found at ${url}`);
      }
      return result;
    };

    const loadFilteredList = async (
      props: string[] = ['$loki', 'title', 'author', 'desc', 'img', 'tag', 'author', 'rating', 'comments']
    ) => {
      const filter = 'view?props=' + props.join(',');
      const result = await m.request<T[]>({
        method: 'GET',
        url: url + filter,
        withCredentials,
      });
      if (!result) {
        console.warn(`No result found at ${url}`);
      }
      return result;
    };

    return {
      create,
      update,
      save,
      del,
      load,
      loadList,
      loadFilteredList,
    };
  };
};

export const restServiceFactory = createRestServiceFactory(process.env.SERVER || location.origin);
