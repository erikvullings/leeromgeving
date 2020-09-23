import m from 'mithril';
import { Dashboards, MeiosisComponent } from '../services';
import { InfoCard } from './ui/info-card';

export const HomePage: MeiosisComponent = () => ({
  oninit: ({ attrs: { actions } }) => {
    actions.lessons.updateList();
    actions.news.updateList();
  },
  view: ({
    attrs: {
      state: { lessons, news },
      actions: { changePage },
    },
  }) =>
    m(
      '.row',
      m('.col.s12', [
        m('h5', 'Lessen...'),
        m(
          '.row',
          m(
            '.col.s12',
            lessons &&
              lessons.list &&
              lessons.list.map((n) => m(InfoCard, { item: n, dashboard: Dashboards.LESSONS_DETAILS, changePage }))
          )
        ),
        m('h5', 'Nieuwsberichten...'),
        m(
          '.row',
          m(
            '.col.s12',
            news &&
              news.list &&
              news.list.map((n) => m(InfoCard, { item: n, dashboard: Dashboards.NEWS_DETAILS, changePage }))
          )
        ),
      ])
    ),
});
