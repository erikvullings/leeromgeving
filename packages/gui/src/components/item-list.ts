import m from 'mithril';
import { FlatButton, Icon, TextInput } from 'mithril-materialized';
import { Dashboards, dashboardSvc } from '../services/dashboard-service';
import { nameAndDescriptionFilter } from '../utils';
import { MeiosisComponent } from '../services';
import { IContent } from '../models';

export const ItemList: MeiosisComponent = () => {
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
    oninit: ({ attrs: { actions } }) => actions.items.updateList(),
    view: ({
      attrs: {
        state: {
          app: { apiService },
          items: { list },
        },
        actions,
      },
    }) => {
      // const { policeUnitFilter: policeUnitFilter, eventTypeFilter, cmFunctionFilter, itemTypeFilter } = state;

      const items = list ? list.sort(sortByTitle) : [];
      const query = nameAndDescriptionFilter(state.filterValue);
      const page = m.route.param('page') ? +m.route.param('page') : 0;
      const filteredEvents =
        items
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
                label: 'Nieuw item',
                iconName: 'add',
                class: 'col s11 indigo darken-4 white-text',
                style: 'margin: 1em;',
                onclick: async () => {
                  actions.items.save({
                    type: '',
                    title: 'Nieuw item',
                    // owner: [Auth.username],
                    // published: false,
                    // start: Date.now(),
                  });
                  dashboardSvc.switchTo(Dashboards.EDIT);
                  // dashboardSvc.switchTo(Dashboards.EDIT, { id: ev.$loki });
                },
              }),
              m('h4.primary-text', { style: 'margin-left: 0.5em;' }, 'Filter events'),
              m(TextInput, {
                label: 'Zoek in de tekst',
                id: 'filter',
                placeholder: 'In titel/omschrijving...',
                iconName: 'filter_list',
                onkeyup: (_: KeyboardEvent, v?: string) => (state.filterValue = v ? v : ''),
                style: 'margin-right:100px',
                className: 'col s12',
              }),
              // m(Select, {
              //   placeholder: 'Kies een',
              //   label: 'Politie eenheid',
              //   checkedId: policeUnitFilter,
              //   options: politieEenheden,
              //   iconName: 'public',
              //   multiple: true,
              //   onchange: (f) => (state.policeUnitFilter = f),
              //   className: 'col s12',
              // }),
              // m(Select, {
              //   placeholder: 'Kies een',
              //   label: 'Event type',
              //   checkedId: eventTypeFilter,
              //   options: itemTypes,
              //   iconName: 'event_note',
              //   multiple: true,
              //   onchange: (f) => (state.eventTypeFilter = f),
              //   className: 'col s12',
              // }),
              // m(Select, {
              //   placeholder: 'Kies een',
              //   label: 'Item',
              //   checkedId: itemTypeFilter,
              //   options: itemTypes,
              //   iconName: 'flash_on',
              //   multiple: true,
              //   onchange: (f) => (state.itemTypeFilter = f as string[]),
              //   className: 'col s12',
              // }),
              // m(Select, {
              //   placeholder: 'Kies een',
              //   label: 'CM function',
              //   checkedId: cmFunctionFilter,
              //   options: cmFunctions,
              //   iconName: 'notifications_active',
              //   multiple: true,
              //   onchange: (f) => (state.cmFunctionFilter = f),
              //   className: 'col s12',
              //   dropdownOptions: { container: 'body' as any },
              // }),
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
            m('.col.s12.m6.xl4', [
              m(
                '.card.hoverable',
                m('.card-content', { style: 'height: 150px;' }, [
                  m(
                    m.route.Link,
                    {
                      className: 'card-title',
                      href: dashboardSvc.route(Dashboards.VIEW).replace(':id', `${item.$loki}`),
                    },
                    item.title
                  ),
                  m('p.light.block-with-text', item.desc),
                ]),
                m('.card-action', [
                  m(
                    'a',
                    {
                      target: '_blank',
                      href: `${apiService}/api/items/${item.$loki}`,
                    },
                    m(Icon, {
                      className: 'white-text',
                      iconName: 'cloud_download',
                    })
                  ),
                  // m(
                  //   "span.badge",
                  //   `${
                  //     item.lessons
                  //       ? item.lessons.length === 1
                  //         ? "1 lesson"
                  //         : `${item.lessons.length} lessons`
                  //       : "0 lessons"
                  //   }`
                  // ),
                ])
              ),
            ])
          )
        ),
      ]);
      // return m('.events-list', [
      //   m('.row', [
      //     m(FlatButton, {
      //       label: 'Add event',
      //       iconName: 'add',
      //       class: 'green input-field right btn-medium',
      //       style: 'margin: 1em 1em 0 0;',
      //       onclick: () => {
      //         EventsSvc.new({ title: 'New event' });
      //         dashboardSvc.switchTo(Dashboards.EDIT, { id: -1 });
      //       },
      //     }),
      //     m(TextInput, {
      //       label: 'Text filter of events',
      //       id: 'filter',
      //       iconName: 'filter_list',
      //       onkeyup: (_: KeyboardEvent, v?: string) => (state.filterValue = v ? v : ''),
      //       style: 'margin-right:100px',
      //       className: 'col s12 l4',
      //     }),
      //     m(Select, {
      //       placeholder: 'Kies een',
      //       label: 'Event type filter',
      //       inline: true,
      //       checkedId: filter,
      //       options: eventTypes.map(o => ({ label: capitalizeFirstLetter(o.id), ...o })),
      //       onchange: f => state.filter = f,
      //       className: 'col s12 l4'
      //     }),
      //   ]),
      //   m('.row', m('p', 'Available events.')),
      //   m(
      //     '.row',
      //     filteredEvents.map(event =>
      //       m('.col.s12.l4', [
      //         m(
      //           '.card.hoverable',
      //           m('.card-content', { style: 'height: 150px;' }, [
      //             m(
      //               m.route.Link,
      //               {
      //                 className: 'card-title',
      //                 href: dashboardSvc.route(Dashboards.READ).replace(':id', `${event.$loki}`),
      //               },
      //               event.name || 'Untitled'
      //             ),
      //             m('p.light.block-with-text', event.desc),
      //           ]),
      //           m('.card-action', [
      //             m(
      //               'a',
      //               {
      //                 target: '_blank',
      //                 href: `${AppState.apiService()}/lessons/${event.$loki}`,
      //               },
      //               m(Icon, {
      //                 iconName: 'cloud_download',
      //               })
      //             ),
      //             m(
      //               'span.badge',
      //               `${
      //                 event.lessons
      //                   ? event.lessons.length === 1
      //                     ? '1 lesson'
      //                     : `${event.lessons.length} lessons`
      //                   : '0 lessons'
      //               }`
      //             ),
      //           ])
      //         ),
      //       ])
      //     )
      //   ),
      // ]);
    },
  };
};
