import m from 'mithril';
// import { labelResolver } from 'mithril-ui-form';
import { Dashboards, MeiosisComponent } from '../../../services';
import { CircularSpinner, ViewFooter, TitleRating, ImageBox } from '../../ui';
import { SlimdownView } from 'mithril-ui-form';
import { FlatButton, Pagination } from 'mithril-materialized';

export const ScenarioView: MeiosisComponent = () => {
  let loaded = false;
  const id = +m.route.param('id');
  return {
    oninit: ({
      attrs: {
        state: {
          scenarios: { current },
        },
        actions: {
          scenarios: { load },
        },
      },
    }) => {
      if (id && current?.$loki !== id) {
        load(id);
      }
      loaded = true;
    },
    view: ({
      attrs: {
        state: {
          scenarios: { current },
        },
        actions: {
          changePage,
          scenarios: { save },
        },
      },
    }) => {
      if (!current || current.$loki !== id) {
        return m(CircularSpinner, {
          className: 'center-align',
          style: 'margin-top: 20%;',
        });
      }

      const { desc, phases = [] } = current;
      const fase = Math.max(0, Math.min(phases.length - 1, +m.route.param('fase') || 0));
      const phase = phases.length > 0 && phases[fase];
      const showAnswer = m.route.param('toon');

      return [
        m('.scenario-view', [
          m('.row', [
            m('.col.s12.m6', [
              m(TitleRating, { content: current }),
              m(ImageBox, { content: current }),
              m(SlimdownView, { md: desc }),
            ]),
            m('.col.s12.m6', [
              phases.length > 1 &&
                m('.row', [
                  phase &&
                    m('.col.s12', [
                      m('h3', `Fase ${fase + 1}: ${phase.title}`),
                      m(ImageBox, { content: phase }),
                      m(SlimdownView, { md: phase.desc }),
                      phase.dilemmas && [
                        m('h4', 'Vragen'),
                        phase.dilemmas.map((d) =>
                          m('.col.s12', [
                            d.title && m(SlimdownView, { md: '* ' + d.title }),
                            d.desc && m(SlimdownView, { md: d.desc }),
                            showAnswer && d.notes && m(SlimdownView, { md: '> ' + d.notes }),
                          ])
                        ),
                        m(FlatButton, {
                          className: 'right-align',
                          label: showAnswer ? 'Verberg de keuzes' : 'Toon gemaakte keuzes',
                          onclick: () =>
                            changePage(
                              Dashboards.SCENARIOS_VIEW,
                              { id },
                              showAnswer ? { fase } : { fase, toon: 'true' }
                            ),
                        }),
                      ],
                    ]),
                  m(
                    '.col.s12.center-align',
                    m(Pagination, {
                      size: 10,
                      className: 'col s9 offset-s3',
                      curPage: fase + 1,
                      items: phases.map((_p, i) => ({ href: `/draaiboek/${current.$loki}?fase=${i}` })),
                    })
                  ),
                ]),
            ]),
          ]),
          m(
            '.row',
            m(
              '.col.s11.center-align.bottom',
              m(ViewFooter, {
                content: current,
                edit: Dashboards.SCENARIOS_EDIT,
                changePage,
                save,
              })
            )
          ),
        ]),
      ];
    },
  };
};
