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
        m('h5', 'Best practices...'),
        m(
          '.row',
          m(
            '.col.s12',
            lessons.list &&
              lessons.list.map((n) =>
                m(InfoCard, { item: n, view: Dashboards.LESSON_VIEW, edit: Dashboards.LESSON_EDIT, changePage })
              )
          )
        ),
        m('h5', 'Nieuwsberichten...'),
        m(
          '.row',
          m(
            '.col.s12',
            news.list &&
              news.list.map((n) =>
                m(InfoCard, { item: n, view: Dashboards.NEWS_VIEW, edit: Dashboards.NEWS_EDIT, changePage })
              )
          )
        ),
      ])
    ),
});
