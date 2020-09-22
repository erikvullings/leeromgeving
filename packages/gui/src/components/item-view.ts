import m from 'mithril';
// import { labelResolver } from 'mithril-ui-form';
import { labelResolver } from '../utils';
import { MeiosisComponent } from '../services';
import { Dashboards, dashboardSvc } from '../services/dashboard-service';
import { CircularSpinner } from './ui/preloader';
import { itemTemplate } from '../templates';
import { IContent } from '../models';

export const ItemView: MeiosisComponent = () => {
  const state = {
    refresh: 0,
    loaded: false,
    resolveObj: labelResolver(itemTemplate),
  };
  return {
    oninit: ({
      attrs: {
        state: {
          items: { current },
        },
        actions,
      },
    }) => {
      state.refresh = setInterval(() => m.redraw(), 5000);
      const id = +m.route.param('id');
      if (id && current?.$loki !== id) {
        actions.items.load(id);
      } else if (current) {
        dashboardSvc.switchTo(Dashboards.VIEW, { id: current.$loki });
      }
    },
    onremove: () => {
      clearInterval(state.refresh);
    },
    view: ({
      attrs: {
        state: { items },
      },
    }) => {
      const { current } = items;
      const { resolveObj } = state;
      // console.log(JSON.stringify(item, null, 2));
      const resolved = resolveObj<IContent>(current);
      // console.log(JSON.stringify(resolved, null, 2));
      if (!current) {
        return m(CircularSpinner, {
          className: 'center-align',
          style: 'margin-top: 20%;',
        });
      }
      if (!resolved) {
        return undefined;
      }

      const { title, desc } = current;

      return m('.item-view', m('.row', [m('.col.s6', title), m('.col.s6', desc)]));
    },
  };
};
