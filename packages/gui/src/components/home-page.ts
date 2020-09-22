import m from 'mithril';
import { Button, Icon } from 'mithril-materialized';
import { SlimdownView } from 'mithril-ui-form';
import background from '../assets/background.jpg';
import logo from '../assets/logo.svg';
import { Dashboards, dashboardSvc } from '../services/dashboard-service';

export const HomePage = () => ({
  view: () => [
    m('.row', [
      m(
        'nav.blue.darken-3',
        m('.nav-wrapper', [
          m(
            'a.brand-logo[href=#]',
            { style: 'margin: 0 10px 0 10px; left: 50px' },
            m(`img[width=100][height=50][src=${logo}]`, {
              style: 'margin-top: 5px;',
            })
          ),
          // m(
          //   "h3.center.blue.darken-3.hide-on-small-only",
          //   { style: "margin: 0 auto; padding: 10px 0;" },
          //   "BOB-eye"
          // ),
        ]),
        m(
          '.overlay.center',
          {
            style: 'position: relative; top: 350px;',
          },
          m(Button, {
            className: 'btn-large',
            label: 'Start hier',
            onclick: () => dashboardSvc.switchTo(Dashboards.LIST),
          })
        )
      ),
      m('img.responsive-img', { src: background }),
      m(
        '.section.white',
        m('.row.container.center', [
          m(SlimdownView, {
            md: `## `,
          }),
          m('.row', [
            m(
              '.col.s12.m4',
              m('.icon-block', [
                m('.center', m(Icon, { iconName: 'dashboard' })),
                m('h5.center', 'Real-time dashboard'),
                m(
                  'p.light',
                  'Beheers je incident en toon alle beschikbare relevante informatie in een beknopt overzicht.'
                ),
              ])
            ),
            m(
              '.col.s12.m4',
              m('.icon-block', [
                m('.center', m(Icon, { iconName: 'flash_on' })),
                m('h5.center', 'Gemakkelijk in gebruik'),
                m(
                  'p.light',
                  'Meer details zijn slechts een klik van je vandaan, en de gegevens kunnen eenvoudig aangepast worden.'
                ),
              ])
            ),
            m(
              '.col.s12.m4',
              m('.icon-block', [
                m('.center', m(Icon, { iconName: 'group' })),
                m('h5.center', 'Deel en leer'),
                m(
                  'p.light',
                  'Oude incidenten kunnen nogmaals besproken worden, tijdens een briefing of gedurende een training.'
                ),
              ])
            ),
          ]),
        ])
      ),
    ]),
  ],
});
