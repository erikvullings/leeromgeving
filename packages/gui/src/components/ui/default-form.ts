import M from 'materialize-css';
import m from 'mithril';
import { Button, FlatButton, ModalPanel } from 'mithril-materialized';
import { LayoutForm, I18n, UIForm } from 'mithril-ui-form';
import { IContent } from '../../models';
import { MeiosisComponent, Dashboards, CollectionNames } from '../../services';
import { capitalizeFirstLetter } from '../../utils';
import { CircularSpinner } from '.';

export const DefaultForm = (
  template: UIForm,
  collectionName: CollectionNames,
  name: string,
  overviewDashboard: Dashboards,
  viewDashboard: Dashboards
): MeiosisComponent => () => {
  return {
    oninit: ({
      attrs: {
        state: {
          [collectionName]: { current },
        },
        actions: {
          changePage,
          [collectionName]: { load },
        },
      },
    }) => {
      const id = +m.route.param('id');
      if (!id && !current) {
        changePage(Dashboards.OVERVIEW);
        return;
      }
      if (!current || (id && current.$loki !== id)) {
        load(id);
      }
    },

    view: ({
      attrs: {
        state: {
          [collectionName]: { current, section },
        },
        actions: {
          [collectionName]: { save, del, changeSection },
          changePage,
        },
      },
    }) => {
      if (!current) {
        return m(CircularSpinner, {
          className: 'center-align',
          style: 'margin-top: 20%;',
        });
      }

      const sections = template
        .filter((c) => c.type === 'section')
        .map((c) => ({
          style: 'cursor: pointer;',
          id: c.id,
          title: c.label || capitalizeFirstLetter(c.id),
        }));
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
                sections.length > 0 && m('h4.primary-text', { style: 'margin-left: 20px;' }, 'Inhoud'),
                ...sections.map((s) =>
                  m(
                    'li',
                    m(FlatButton, {
                      label: s.title,
                      onclick: changeSection(s.id as string),
                    })
                  )
                ),
                m('.buttons', [
                  m(Button, {
                    label: `Toon ${name}`,
                    iconName: 'visibility',
                    className: 'right col s12',
                    onclick: () => changePage(viewDashboard, { id: current.$loki }),
                  }),
                  // m(Button, {
                  //   label: 'Save event',
                  //   iconName: 'save',
                  //   class: `green col s12 ${hasChanged ? '' : 'disabled'}`,
                  //   onclick: onsubmit,
                  // }),
                  m(Button, {
                    modalId: 'delete-item',
                    label: `Verwijder ${name}`,
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
              form: template,
              obj: current,
              i18n: {
                pickOne: 'Kies een',
                pickOneOrMore: 'Kies een of meer',
              } as I18n,
              onchange: (_isValid, obj) => {
                // item.location = undefined;
                console.log(JSON.stringify(obj, null, 2));
                save(obj as IContent);
              },
              section,
            }),
          ]),
          m(ModalPanel, {
            id: 'delete-item',
            title: `Verwijder ${name}`,
            description: 'Weet je het zeker? Er is geen weg terug!',
            options: { opacity: 0.7 },
            buttons: [
              {
                label: 'Delete',
                onclick: async () => {
                  current.$loki && del(current.$loki);
                  changePage(overviewDashboard);
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
