import m from 'mithril';
import { FlatButton, ModalPanel, RoundIconButton, TextInput } from 'mithril-materialized';
import { SlimdownView } from 'mithril-ui-form';
import { IContent } from '../models';
import { Auth, Dashboards, MeiosisComponent } from '../services';
import { formatDate, sortByDate, sortByTime, titleAndDescriptionFilter } from '../utils';
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
      const calendarItems = [...newsRelatedItems.filter((c) => c.date), ...infoRelatedItems.filter((c) => c.date)];
      const actualItems = [...newsRelatedItems.filter((c) => c.pinned), ...infoRelatedItems.filter((c) => c.pinned)];

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
                label: 'Wis',
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

              m('.col.s10.offset-s1.section-wrapper'),
              calendarItems.length > 0 &&
                calendarItems.sort(sortByDate).map((i) =>
                  m(FlatButton, {
                    label: i.date ? `${formatDate(i.date)}: ${i.title}` : '',
                    class: 'col s12',
                    style: 'margin: 1em;',
                    iconName: 'visibility',
                    onclick: () => actions.changePage(i.view, { id: i.$loki }),
                  })
                ),
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
                  onclick: () => {
                    actions.news.create(
                      {
                        type: '',
                        title: 'Nieuw bericht',
                        author: [Auth.username],
                        // published: false,
                      } as IContent,
                      (c) => actions.changePage(Dashboards.NEWS_EDIT, { id: c.$loki })
                    );
                  },
                }),
            ]),
            m(
              'ul.hs.full',
              newsRelatedItems
                .filter((c) => !c.pinned)
                .sort(sortByTime)
                .map((n) =>
                  m(
                    'li',
                    m(InfoCard, { className: 'hs-item', item: n, list: n.list, view: n.view, edit: n.edit, changePage })
                  )
                )
            ),
            actualItems.length > 0 && [
              m('h5', [
                'Actueel',
                Auth.isAuthenticated &&
                  m(RoundIconButton, {
                    iconName: 'add',
                    style: 'margin-left: 1rem',
                    onclick: () => {
                      actions.news.create(
                        {
                          type: '',
                          title: 'Nieuw bericht',
                          pinned: true,
                          author: [Auth.username],
                          // published: false,
                        } as IContent,
                        (c) => actions.changePage(Dashboards.NEWS_EDIT, { id: c.$loki })
                      );
                    },
                  }),
              ]),
              m(
                'ul.hs.full',
                actualItems.sort(sortByTime).map((n) =>
                  m(
                    'li',
                    m(InfoCard, {
                      className: 'hs-item',
                      item: n,
                      list: n.list,
                      view: n.view,
                      edit: n.edit,
                      changePage,
                    })
                  )
                )
              ),
            ],
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
                .filter((c) => !c.pinned)
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
              id: 'add-learning-content',
              title: 'Voeg een nieuw bericht toe',
              fixedFooter: true,
              description: m(SlimdownView, {
                md: `Kies uit een van de volgende:
              - **Scenario** dat je meegemaakt hebt
              - **Les** die je geleerd hebt
              - **Tip** die je wil delen
              - **Probleem** waar je mee zit
              - **Vraag** (meerkeuzevraag, open vraag of dilemma)`,
              }),
              options: { opacity: 0.7 },
              buttons: [
                {
                  label: 'Cancel',
                  // onclick: () => alert('You make me sad...'),
                },
                {
                  label: 'Scenario',
                  onclick: () =>
                    actions.scenarios.create(
                      {
                        title: 'Nieuw scenario',
                        author: [Auth.username],
                      },
                      (c) => actions.changePage(Dashboards.SCENARIOS_EDIT, { id: c.$loki })
                    ),
                },
                {
                  label: 'Les',
                  onclick: () =>
                    actions.lessons.create(
                      {
                        title: 'Nieuwe les',
                        author: [Auth.username],
                      },
                      (c) => actions.changePage(Dashboards.LESSON_EDIT, { id: c.$loki })
                    ),
                },
                {
                  label: 'Tip',
                  onclick: () =>
                    actions.tips.create(
                      {
                        title: 'Nieuwe tip',
                        author: [Auth.username],
                      },
                      (c) => actions.changePage(Dashboards.TIPS_EDIT, { id: c.$loki })
                    ),
                },
                {
                  label: 'Probleem',
                  onclick: () =>
                    actions.issues.create(
                      {
                        title: 'Nieuw probleem',
                        author: [Auth.username],
                      },
                      (c) => actions.changePage(Dashboards.ISSUES_EDIT, { id: c.$loki })
                    ),
                },
                {
                  label: 'Vraag',
                  onclick: () =>
                    actions.dilemmas.create(
                      {
                        title: 'Nieuwe vraag',
                        author: [Auth.username],
                      },
                      (c) => actions.changePage(Dashboards.DILEMMAS_EDIT, { id: c.$loki })
                    ),
                },
              ],
            }),
          ])
        ),
      ]);
    },
  };
};
