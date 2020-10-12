import m from 'mithril';
import { FlatButton, TextInput } from 'mithril-materialized';
import { Dashboards } from '../../../services/dashboard-service';
import { sortByTime, titleAndDescriptionFilter } from '../../../utils';
import { MeiosisComponent } from '../../../services';
import { IContent } from '../../../models';
import { InfoCard } from '../../ui/info-card';

export const DilemmasList: MeiosisComponent = () => {
  const state = {
    filterValue: '',
  } as {
    filterValue: string;
  };

  const pageSize = 24;

  return {
    oninit: ({ attrs: { actions } }) => actions.dilemmas.updateList(),
    view: ({
      attrs: {
        state: {
          dilemmas: { list },
        },
        actions,
      },
    }) => {
      const dilemmas = list ? list.sort(sortByTime) : [];
      const query = titleAndDescriptionFilter(state.filterValue);
      const page = m.route.param('page') ? +m.route.param('page') : 0;
      const filteredEvents =
        dilemmas
          // .filter((ev) => ev.published)
          .filter(query)
          .slice(page * pageSize, (page + 1) * pageSize) || [];
      return m('.row', { style: 'margin-top: 1em;' }, [
        m(
          '.col.s12.l3',
          m(
            'ul#slide-out.sidenav.sidenav-fixed',
            {
              // style: 'height: 95vh',
              oncreate: ({ dom }) => {
                M.Sidenav.init(dom);
              },
            },
            [
              // Auth.isAuthenticated &&
              m(FlatButton, {
                label: 'Nieuwe vraag',
                iconName: 'add',
                class: 'col s11 indigo darken-4 white-text',
                style: 'margin: 1em;',
                onclick: () => {
                  actions.dilemmas.save(
                    {
                      type: '',
                      title: 'Nieuwe vraag',
                      // owner: [Auth.username],
                      // published: false,
                    } as IContent,
                    (c) => actions.changePage(Dashboards.DILEMMAS_EDIT, { id: c.$loki })
                  );
                },
              }),
              m('h4.primary-text', { style: 'margin-left: 0.5em;' }, 'Filter vragen'),
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
              list: Dashboards.DILEMMAS,
              view: Dashboards.DILEMMAS_VIEW,
              edit: Dashboards.DILEMMAS_EDIT,
              changePage: actions.changePage,
            })
          )
        ),
      ]);
    },
  };
};
