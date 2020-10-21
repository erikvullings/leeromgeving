import m from 'mithril';
import { FlatButton, ModalPanel, RoundIconButton, TextInput } from 'mithril-materialized';
import { IContent } from '../models';
import { Auth, Dashboards, MeiosisComponent } from '../services';
import { sortByTime, titleAndDescriptionFilter } from '../utils';
import { InfoCard } from './ui/info-card';

export const HomePage: MeiosisComponent = () => {
  let filterValue = '';
  return {
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
      const newsRelatedItems = [] as Array<
        Partial<IContent> & { list: Dashboards; view: Dashboards; edit: Dashboards }
      >;
      let filterTitleAndDescription = titleAndDescriptionFilter(filterValue);
      if (news && news.list)
        newsRelatedItems.push(
          ...news.list.filter(filterTitleAndDescription).map((i) => ({
            ...i,
            view: Dashboards.NEWS_VIEW,
            edit: Dashboards.NEWS_EDIT,
            list: Dashboards.NEWS,
          }))
        );
      const infoRelatedItems = [] as Array<
        Partial<IContent> & { list: Dashboards; view: Dashboards; edit: Dashboards }
      >;
      if (lessons && lessons.list)
        infoRelatedItems.push(
          ...lessons.list.filter(filterTitleAndDescription).map((i) => ({
            ...i,
            view: Dashboards.LESSON_VIEW,
            edit: Dashboards.LESSON_EDIT,
            list: Dashboards.LESSONS,
          }))
        );
      if (scenarios && scenarios.list)
        infoRelatedItems.push(
          ...scenarios.list.filter(filterTitleAndDescription).map((i) => ({
            ...i,
            view: Dashboards.SCENARIOS_VIEW,
            edit: Dashboards.SCENARIOS_EDIT,
            list: Dashboards.SCENARIOS,
          }))
        );
      if (tips && tips.list)
        infoRelatedItems.push(
          ...tips.list.filter(filterTitleAndDescription).map((i) => ({
            ...i,
            view: Dashboards.TIPS_VIEW,
            edit: Dashboards.TIPS_EDIT,
            list: Dashboards.TIPS,
          }))
        );
      if (issues && issues.list)
        infoRelatedItems.push(
          ...issues.list.filter(filterTitleAndDescription).map((i) => ({
            ...i,
            view: Dashboards.ISSUES_VIEW,
            edit: Dashboards.ISSUES_EDIT,
            list: Dashboards.ISSUES,
          }))
        );
      if (dilemmas && dilemmas.list)
        infoRelatedItems.push(
          ...dilemmas.list.filter(filterTitleAndDescription).map((i) => ({
            ...i,
            view: Dashboards.DILEMMAS_VIEW,
            edit: Dashboards.DILEMMAS_EDIT,
            list: Dashboards.DILEMMAS,
          }))
        );
      const { changePage } = actions;
      return m('.row', [
        m(
          '.col.s12.l3',
          m(
            'ul#slide-out.sidenav.sidenav-fixed',
            {
              oncreate: ({ dom }) => {
                M.Sidenav.init(dom);
              },
            },
            m('div', { style: 'margin-top: 10px;' }, [
              m(TextInput, {
                label: 'Zoek in de tekst',
                id: 'filter',
                placeholder: 'In titel/omschrijving...',
                iconName: 'filter_list',
                initialValue: filterValue,
                onkeyup: (_: KeyboardEvent, v?: string) => (filterValue = v ? v : ''),
                style: 'margin-right:100px',
                className: 'col s12',
              }),
              m(FlatButton, {
                label: 'Wis alle filters',
                iconName: 'clear_all',
                class: 'col s11',
                style: 'margin: 1em;',
                onclick: () => {
                  filterValue = '';
                  // state.policeUnitFilter.length = 0;
                  // state.cmFunctionFilter.length = 0;
                  // state.eventTypeFilter.length = 0;
                  // state.itemTypeFilter.length = 0;
                },
              }),
            ])
          )
        ),
        m(
          '.col.s12.l9',
          m('.hs-container', [
            m('h5', [
              'OC Sociaal',
              Auth.isAuthenticated &&
                m(RoundIconButton, {
                  iconName: 'add',
                  style: 'margin-left: 1rem',
                  modalId: 'add-social-content',
                }),
            ]),
            m(
              'ul.hs.full',
              newsRelatedItems
                .sort(sortByTime)
                .map((n) =>
                  m(
                    'li',
                    m(InfoCard, { className: 'hs-item', item: n, list: n.list, view: n.view, edit: n.edit, changePage })
                  )
                )
            ),
            m('h5', [
              'Actueel',
              Auth.isAuthenticated &&
                m(RoundIconButton, {
                  iconName: 'add',
                  style: 'margin-left: 1rem',
                  modalId: 'add-learning-content',
                }),
            ]),
            m(
              'ul.hs.full',
              infoRelatedItems
                .sort(sortByTime)
                .map((n) =>
                  m(
                    'li',
                    m(InfoCard, { className: 'hs-item', item: n, list: n.list, view: n.view, edit: n.edit, changePage })
                  )
                )
            ),
            m('h5', [
              'Leren van elkaar',
              Auth.isAuthenticated &&
                m(RoundIconButton, {
                  iconName: 'add',
                  style: 'margin-left: 1rem',
                  modalId: 'add-learning-content',
                }),
            ]),
            m(
              'ul.hs.full',
              infoRelatedItems
                .sort(sortByTime)
                .map((n) =>
                  m(
                    'li',
                    m(InfoCard, { className: 'hs-item', item: n, list: n.list, view: n.view, edit: n.edit, changePage })
                  )
                )
            ),
            m('h5', ['Overig?']),
            m(ModalPanel, {
              id: 'add-social-content',
              title: 'Do you like this library?',
              description: 'This is some content.',
              options: { opacity: 0.7 },
              buttons: [
                {
                  label: 'Disagree',
                  onclick: () => alert('You make me sad...'),
                },
                {
                  label: 'Agree',
                  onclick: () => alert('Thank you for the compliment!'),
                },
              ],
            }),
          ])
        ),
      ]);
    },
  };
};
