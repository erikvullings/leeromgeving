import m, { FactoryComponent } from 'mithril';
import { FlatButton } from 'mithril-materialized';
import { IContent } from '../../models';
import { Dashboards } from '../../services';

export const ViewFooter: FactoryComponent<{
  current: Partial<IContent>;
  edit: Dashboards;
  changePage: (d: Dashboards, params: { [key: string]: string | number | undefined }) => void;
  save: (item: Partial<IContent>) => void;
}> = () => {
  return {
    view: ({ attrs: { current, edit, changePage, save } }) => {
      return [
        m('ul.list-inline', [
          m('li', m(FlatButton, { label: 'EDIT', onclick: () => changePage(edit, { id: current.$loki }) })),
          m(
            'li',
            m(FlatButton, {
              label: 'UP',
              onclick: () => {
                current.rating = (current.rating || 0) + 1;
                save(current);
              },
            })
          ),
          m(
            'li',
            m(FlatButton, {
              label: 'DOWN',
              onclick: () => {
                current.rating = (current.rating || 0) - 1;
                save(current);
              },
            })
          ),
        ]),
      ];
    },
  };
};
