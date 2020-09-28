import m from 'mithril';
import { Dashboards, MeiosisComponent } from '../services';
import { InfoCard } from './ui/info-card';

export const HomePage: MeiosisComponent = () => ({
  oninit: ({
    attrs: {
      actions: { lessons, news, dilemmas, tips },
    },
  }) => {
    lessons.updateList();
    news.updateList();
    dilemmas.updateList();
    tips.updateList();
  },
  view: ({
    attrs: {
      state: { lessons, news, dilemmas, tips },
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
        m('h5', 'Dilemmas...'),
        m(
          '.row',
          m(
            '.col.s12',
            dilemmas.list &&
              dilemmas.list.map((n) =>
                m(InfoCard, { item: n, view: Dashboards.DILEMMAS_VIEW, edit: Dashboards.DILEMMAS_EDIT, changePage })
              )
          )
        ),
        m('h5', 'Tips & Tricks...'),
        m(
          '.row',
          m(
            '.col.s12',
            tips.list &&
              tips.list.map((n) =>
                m(InfoCard, { item: n, view: Dashboards.TIPS_VIEW, edit: Dashboards.TIPS_EDIT, changePage })
              )
          )
        ),
      ])
    ),
});
