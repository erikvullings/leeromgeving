import m from 'mithril';
import { FlatButton, TextInput } from 'mithril-materialized';
import { Dashboards } from '../../../services/dashboard-service';
import { sortByTitle, titleAndDescriptionFilter } from '../../../utils';
import { MeiosisComponent } from '../../../services';
import { IContent } from '../../../models';
import { InfoCard } from '../../ui/info-card';

export const ScenarioList: MeiosisComponent = () => {
  const state = {
    filterValue: '',
  } as {
    filterValue: string;
  };

  const pageSize = 24;

  return {
    oninit: ({ attrs: { actions } }) => actions.scenarios.updateList(),
    view: ({
      attrs: {
        state: {
          scenarios: { list },
        },
        actions,
      },
    }) => {
      const scenarios = list ? list.sort(sortByTitle) : [];
      const query = titleAndDescriptionFilter(state.filterValue);
      const page = m.route.param('page') ? +m.route.param('page') : 0;
      const filteredEvents = scenarios.filter(query).slice(page * pageSize, (page + 1) * pageSize) || [];
      return m('.row', { style: 'margin-top: 1em;' }, [
        m(
          '.col.s12.l3',
          m(
            'ul#slide-out.sidenav.sidenav-fixed',
            {
              oncreate: ({ dom }) => {
                M.Sidenav.init(dom);
              },
            },
            [
              // Auth.isAuthenticated &&
              m(FlatButton, {
                label: 'Nieuw scenario',
                iconName: 'add',
                class: 'col s11 indigo darken-4 white-text',
                style: 'margin: 1em;',
                onclick: () => {
                  actions.scenarios.save(
                    {
                      type: '',
                      title: 'Nieuw scenario',
                      // owner: [Auth.username],
                      // published: false,
                    } as IContent,
                    (c) => actions.changePage(Dashboards.SCENARIOS_EDIT, { id: c.$loki })
                  );
                },
              }),
              m('h4.primary-text', { style: 'margin-left: 0.5em;' }, 'Filter berichten'),
              m(TextInput, {
                label: 'Zoek in de tekst',
                id: 'filter',
                placeholder: 'In titel/omschrijving...',
                iconName: 'filter_list',
                onkeyup: (_: KeyboardEvent, v?: string) => (state.filterValue = v ? v : ''),
                style: 'margin-right:100px',
                className: 'col s12',
              }),
              m(FlatButton, {
                label: 'Wis alle filters',
                iconName: 'clear_all',
                class: 'col s11',
                style: 'margin: 1em;',
                onclick: () => {
                  state.filterValue = '';
                },
              }),
            ]
          )
        ),
        m(
          '.col.s12.l9',
          filteredEvents.map((item) =>
            m(InfoCard, {
              item,
              view: Dashboards.SCENARIOS_VIEW,
              edit: Dashboards.SCENARIOS_EDIT,
              changePage: actions.changePage,
            })
          )
        ),
      ]);
    },
  };
};
