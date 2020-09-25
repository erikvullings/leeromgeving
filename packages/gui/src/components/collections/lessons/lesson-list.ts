import m from 'mithril';
import { FlatButton, TextInput } from 'mithril-materialized';
import { Dashboards } from '../../../services/dashboard-service';
import { titleAndDescriptionFilter } from '../../../utils';
import { MeiosisComponent } from '../../../services';
import { IContent } from '../../../models';
import { InfoCard } from '../../ui/info-card';

export const LessonsList: MeiosisComponent = () => {
  const state = {
    filterValue: '',
    policeUnitFilter: [],
    eventTypeFilter: [],
    itemTypeFilter: [],
    cmFunctionFilter: [],
  } as {
    policeUnitFilter: Array<string | number>;
    eventTypeFilter: Array<string | number>;
    itemTypeFilter: string[];
    cmFunctionFilter: Array<string | number>;
    filterValue: string;
  };

  const sortByTitle: ((a: Partial<IContent>, b: Partial<IContent>) => number) | undefined = (a, b) =>
    (a.title || '') > (b.title || '') ? 1 : (a.title || '') < (b.title || '') ? -1 : 0;

  const pageSize = 24;

  return {
    oninit: ({ attrs: { actions } }) => actions.lessons.updateList(),
    view: ({
      attrs: {
        state: {
          lessons: { list },
        },
        actions,
      },
    }) => {
      const lessons = list ? list.sort(sortByTitle) : [];
      const query = titleAndDescriptionFilter(state.filterValue);
      const page = m.route.param('page') ? +m.route.param('page') : 0;
      const filteredEvents =
        lessons
          // .filter(
          //   (ev) => ev.published || (Auth.isAuthenticated && (Auth.roles.indexOf(Roles.ADMIN) >= 0 || Auth.canEdit(ev)))
          // )
          .filter(query)
          // .filter(typeFilter('policeUnit', policeUnitFilter))
          // .filter(typeFilter('eventType', eventTypeFilter))
          // .filter(typeFilter('cmFunctions', cmFunctionFilter))
          // .filter(itemFilter(itemTypeFilter))
          .slice(page * pageSize, (page + 1) * pageSize) || [];
      return m('.row', { style: 'margin-top: 1em;' }, [
        m(
          '.col.s12.l3',
          m(
            'ul#slide-out.sidenav.sidenav-fixed',
            {
              style: 'height: 95vh',
              oncreate: ({ dom }) => {
                M.Sidenav.init(dom);
              },
            },
            [
              // Auth.isAuthenticated &&
              m(FlatButton, {
                label: 'Nieuwe les',
                iconName: 'add',
                class: 'col s11 indigo darken-4 white-text',
                style: 'margin: 1em;',
                onclick: () => {
                  actions.lessons.save({
                    type: '',
                    title: 'Nieuwe les',
                    // owner: [Auth.username],
                    // published: false,
                  } as IContent);
                },
              }),
              m('h4.primary-text', { style: 'margin-left: 0.5em;' }, 'Filter lessen'),
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
                  state.policeUnitFilter.length = 0;
                  state.cmFunctionFilter.length = 0;
                  state.eventTypeFilter.length = 0;
                  state.itemTypeFilter.length = 0;
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
              view: Dashboards.LESSON_VIEW,
              edit: Dashboards.LESSON_EDIT,
              changePage: actions.changePage,
            })
          )
        ),
      ]);
    },
  };
};
