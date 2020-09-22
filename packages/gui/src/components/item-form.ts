import M from 'materialize-css';
import m from 'mithril';
import { Button, ModalPanel } from 'mithril-materialized';
import { LayoutForm, I18n } from 'mithril-ui-form';
import { IContent } from '../models';
import { MeiosisComponent } from '../services';
import { Dashboards, dashboardSvc } from '../services/dashboard-service';
import { itemTemplate } from '../templates';
import { capitalizeFirstLetter } from '../utils';
import { CircularSpinner } from './ui/preloader';

const log = console.log;

const close = async (e?: UIEvent) => {
  log('closing...');
  dashboardSvc.switchTo(Dashboards.LIST);
  if (e) {
    e.preventDefault();
  }
};

export const ItemForm: MeiosisComponent = () => {
  const state = {
    // hasChanged: false,
    loaded: false,
    isValid: false,
    error: '',
    /** Relevant context for the Form, can be used with show/disabling */
    context: {
      admin: true,
    },
  };

  return {
    oninit: ({
      attrs: {
        state: {
          items: { current },
        },
        actions,
      },
    }) => {
      const id = +m.route.param('id');
      if (!id && !current) {
        dashboardSvc.switchTo(Dashboards.LIST);
        return;
      }
      if (!id) {
        dashboardSvc.switchTo(Dashboards.EDIT, { id: current?.$loki });
      }
      if (!current || (id && current.$loki !== id)) {
        dashboardSvc.switchTo(Dashboards.EDIT, { id });
        actions.items.load(id);
      }
    },

    view: ({
      attrs: {
        state: {
          items: { current },
        },
        actions,
      },
    }) => {
      if (!current) {
        return m(CircularSpinner, {
          className: 'center-align',
          style: 'margin-top: 20%;',
        });
      }
      const { context } = state;
      // log(event);
      const sections = itemTemplate
        .filter((c) => c.type === 'section')
        .map((c) => ({
          style: 'cursor: pointer;',
          id: c.id,
          title: c.label || capitalizeFirstLetter(c.id),
        }));
      const section = m.route.param('section') || sections[0].id;
      // console.log(JSON.stringify(item?.location, null, 2));
      return (
        current &&
        m('.row', [
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
                m('h4.primary-text', { style: 'margin-left: 20px;' }, 'Inhoud'),
                ...sections.map((s) =>
                  m(
                    'li',
                    m(
                      m.route.Link,
                      {
                        href: dashboardSvc.route(Dashboards.EDIT).replace(':id', `${current.$loki}?section=${s.id}`),
                      },
                      m('span.primary-text', s.title)
                    )
                  )
                ),
                m('.buttons', [
                  m(Button, {
                    label: 'Toon dashboard',
                    iconName: 'visibility',
                    className: 'right col s12',
                    onclick: () =>
                      dashboardSvc.switchTo(Dashboards.VIEW, {
                        id: current.$loki,
                      }),
                  }),
                  // m(Button, {
                  //   label: 'Save event',
                  //   iconName: 'save',
                  //   class: `green col s12 ${hasChanged ? '' : 'disabled'}`,
                  //   onclick: onsubmit,
                  // }),
                  m(Button, {
                    modalId: 'delete-item',
                    label: 'Verwijder item',
                    iconName: 'delete',
                    class: 'red col s12',
                  }),
                ]),
              ]
            )
          ),
          m('.col.s12.l9', [
            m(LayoutForm, {
              key: section,
              form: itemTemplate,
              obj: current,
              i18n: {
                pickOne: 'Kies een',
                pickOneOrMore: 'Kies een of meer',
              } as I18n,
              onchange: (_isValid, obj) => {
                // item.location = undefined;
                console.log(JSON.stringify(obj, null, 2));
                actions.items.save(obj as IContent);
              },
              context,
              section,
            }),
          ]),
          m(ModalPanel, {
            id: 'delete-item',
            title: 'Item verwijderen',
            description: 'Wil je dit item daadwerkelijk verwijderen - er is geen weg terug?',
            options: { opacity: 0.7 },
            buttons: [
              {
                label: 'Delete',
                onclick: async () => {
                  current.$loki && actions.items.del(current.$loki);
                  close();
                },
              },
              {
                label: 'Discard',
              },
            ],
          }),
        ])
      );
    },
  };
};
