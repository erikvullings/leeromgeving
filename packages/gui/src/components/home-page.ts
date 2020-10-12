import m from 'mithril';
import { FloatingActionButton } from 'mithril-materialized';
import { IContent } from '../models';
import { Dashboards, MeiosisComponent } from '../services';
import { dashboardToIcon, sortByTime } from '../utils';
import { InfoCard } from './ui/info-card';

export const HomePage: MeiosisComponent = () => ({
  oninit: ({
    attrs: {
      actions: { lessons, news, dilemmas, tips, issues, scenarios },
    },
  }) => {
    lessons.updateList();
    news.updateList();
    dilemmas.updateList();
    tips.updateList();
    issues.updateList();
    scenarios.updateList();
  },
  view: ({
    attrs: {
      state: { lessons, news, dilemmas, tips, issues, scenarios },
      actions,
    },
  }) => {
    const newsRelatedItems = [] as Array<Partial<IContent> & { list: Dashboards; view: Dashboards; edit: Dashboards }>;
    if (news && news.list)
      newsRelatedItems.push(
        ...news.list.map((i) => ({
          ...i,
          view: Dashboards.NEWS_VIEW,
          edit: Dashboards.NEWS_EDIT,
          list: Dashboards.NEWS,
        }))
      );
    if (lessons && lessons.list)
      newsRelatedItems.push(
        ...lessons.list.map((i) => ({
          ...i,
          view: Dashboards.LESSON_VIEW,
          edit: Dashboards.LESSON_EDIT,
          list: Dashboards.LESSONS,
        }))
      );
    if (scenarios && scenarios.list)
      newsRelatedItems.push(
        ...scenarios.list.map((i) => ({
          ...i,
          view: Dashboards.SCENARIOS_VIEW,
          edit: Dashboards.SCENARIOS_EDIT,
          list: Dashboards.SCENARIOS,
        }))
      );
    const infoRelatedItems = [] as Array<Partial<IContent> & { list: Dashboards; view: Dashboards; edit: Dashboards }>;
    if (tips && tips.list)
      infoRelatedItems.push(
        ...tips.list.map((i) => ({
          ...i,
          view: Dashboards.TIPS_VIEW,
          edit: Dashboards.TIPS_EDIT,
          list: Dashboards.TIPS,
        }))
      );
    if (issues && issues.list)
      infoRelatedItems.push(
        ...issues.list.map((i) => ({
          ...i,
          view: Dashboards.ISSUES_VIEW,
          edit: Dashboards.ISSUES_EDIT,
          list: Dashboards.ISSUES,
        }))
      );
    if (dilemmas && dilemmas.list)
      infoRelatedItems.push(
        ...dilemmas.list.map((i) => ({
          ...i,
          view: Dashboards.DILEMMAS_VIEW,
          edit: Dashboards.DILEMMAS_EDIT,
          list: Dashboards.DILEMMAS,
        }))
      );
    const { changePage } = actions;
    return m(
      '.row',
      m('.col.s12', [
        m(FloatingActionButton, {
          className: 'red',
          style: 'position: fixed',
          iconName: 'mode_edit',
          direction: 'left',
          position: 'inline-right', // Comment this out to get a FAB in the bottom-left of the page.
          buttons: [
            {
              iconName: dashboardToIcon(Dashboards.DILEMMAS),
              className: 'red',
              onClick: () =>
                actions.dilemmas.save(
                  {
                    type: 'dilemma',
                    title: 'Nieuwe vraag',
                  } as IContent,
                  (c) => actions.changePage(Dashboards.DILEMMAS_EDIT, { id: c.$loki })
                ),
            },
            {
              iconName: dashboardToIcon(Dashboards.LESSONS),
              className: 'green darken-2',
              onClick: () =>
                actions.lessons.save(
                  {
                    type: 'lesson',
                    title: 'Nieuwe les',
                  } as IContent,
                  (c) => actions.changePage(Dashboards.LESSON_EDIT, { id: c.$loki })
                ),
            },
            {
              iconName: dashboardToIcon(Dashboards.TIPS),
              className: 'blue',
              onClick: () =>
                actions.tips.save(
                  {
                    type: 'tip',
                    title: 'Nieuwe tip',
                  } as IContent,
                  (c) => actions.changePage(Dashboards.TIPS_EDIT, { id: c.$loki })
                ),
            },
            {
              iconName: dashboardToIcon(Dashboards.SCENARIOS),
              className: 'brown',
              onClick: () =>
                actions.scenarios.save(
                  {
                    type: 'scenario',
                    title: 'Nieuw scenario',
                  } as IContent,
                  (c) => actions.changePage(Dashboards.SCENARIOS_EDIT, { id: c.$loki })
                ),
            },
            {
              iconName: dashboardToIcon(Dashboards.NEWS),
              className: 'yellow darken-1',
              onClick: () =>
                actions.news.save(
                  {
                    type: 'news',
                    title: 'Nieuwtje van de dag',
                  } as IContent,
                  (c) => actions.changePage(Dashboards.NEWS_EDIT, { id: c.$loki })
                ),
            },
            {
              iconName: dashboardToIcon(Dashboards.ISSUES),
              className: 'red',
              onClick: () =>
                actions.issues.save(
                  {
                    type: 'issue',
                    title: 'Hulp gezocht',
                  } as IContent,
                  (c) => actions.changePage(Dashboards.ISSUES_EDIT, { id: c.$loki })
                ),
            },
          ],
        }),
        m('h5', 'Nieuwtjes...'),
        m(
          '.row',
          m(
            '.col.s12',
            newsRelatedItems
              .sort(sortByTime)
              .map((n) => m(InfoCard, { item: n, list: n.list, view: n.view, edit: n.edit, changePage }))
          )
        ),
        m('h5', 'Leren van elkaar...'),
        m(
          '.row',
          m(
            '.col.s12',
            infoRelatedItems
              .sort(sortByTime)
              .map((n) => m(InfoCard, { item: n, list: n.list, view: n.view, edit: n.edit, changePage }))
          )
        ),
      ])
    );
  },
});
