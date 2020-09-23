import M from 'materialize-css';
import m from 'mithril';
import { Button, FlatButton, ModalPanel } from 'mithril-materialized';
import { LayoutForm, I18n } from 'mithril-ui-form';
import { newsTemplate } from '.';
import { IContent } from '../../../models';
import { MeiosisComponent } from '../../../services';
import { Dashboards } from '../../../services/dashboard-service';
import { capitalizeFirstLetter } from '../../../utils';
import { CircularSpinner } from '../../ui/preloader';
import { NewsView } from './news-view';

// const log = console.log;

// const close = async (e?: UIEvent, changePage: (id: Dashboards) => void) => {
//   log('closing...');
//   changePage(Dashboards.OVERVIEW);
//   if (e) {
//     e.preventDefault();
//   }
// };

export const NewsForm: MeiosisComponent = () => {
  return {
    oninit: ({
      attrs: {
        state: {
          news: { current },
        },
        actions: {
          changePage,
          news: { load },
        },
      },
    }) => {
      const id = +m.route.param('id');
      if (!id && !current) {
        changePage(Dashboards.OVERVIEW);
        return;
      }
      if (!current || (id && current.$loki !== id)) {
        changePage(Dashboards.NEWS_DETAILS, { id });
        load(id);
      }
    },

    view: ({ attrs: { state, actions } }) => {
      const {
        news: { current, section, mode },
      } = state;

      if (!current) {
        return m(CircularSpinner, {
          className: 'center-align',
          style: 'margin-top: 20%;',
        });
      }

      if (!/mode=edit/.test(m.route.get()) && mode !== 'edit') {
        return [
          m(NewsView, { state, actions }),
          m(FlatButton, { label: 'EDIT', onclick: () => actions.news.changeMode('edit') }),
        ];
      }
      const {
        news: { save, del, changeSection, changeMode },
        changePage,
      } = actions;
      // const { context } = state;
      // log(event);
      const sections = newsTemplate
        .filter((c) => c.type === 'section')
        .map((c) => ({
          style: 'cursor: pointer;',
          id: c.id,
          title: c.label || capitalizeFirstLetter(c.id),
        }));
      // const sectionId = section || m.route.param('section') || (sections.length > 0 ? sections[0].id : undefined);
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
                sections.length > 0 && m('h4.primary-text', { style: 'margin-left: 20px;' }, 'Inhoud'),
                ...sections.map((s) =>
                  m(
                    'li',
                    // TODO REPLACE with a button and use the action.changeSection
                    m(
                      FlatButton,
                      {
                        label: s.title,
                        onclick: changeSection(s.id as string),
                      }
                      // m.route.Link,
                      // {
                      //   href: dashboardSvc
                      //     .route(Dashboards.LESSONS_DETAILS)
                      //     .replace(':id', `${current.$loki}?section=${s.id}`),
                      // },
                      // m('span.primary-text', s.title)
                    )
                  )
                ),
                m('.buttons', [
                  m(Button, {
                    label: 'Toon bericht',
                    iconName: 'visibility',
                    className: 'right col s12',
                    onclick: () => changeMode('view'),
                  }),
                  // m(Button, {
                  //   label: 'Save event',
                  //   iconName: 'save',
                  //   class: `green col s12 ${hasChanged ? '' : 'disabled'}`,
                  //   onclick: onsubmit,
                  // }),
                  m(Button, {
                    modalId: 'delete-item',
                    label: 'Verwijder bericht',
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
              form: newsTemplate,
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
            title: 'Les verwijderen',
            description: 'Wil je deze les daadwerkelijk verwijderen - er is geen weg terug?',
            options: { opacity: 0.7 },
            buttons: [
              {
                label: 'Delete',
                onclick: async () => {
                  current.$loki && del(current.$loki);
                  changePage(Dashboards.NEWS);
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
