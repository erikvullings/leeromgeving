import m from 'mithril';
import { labelResolver } from 'mithril-ui-form';
import { l } from '../../../utils';
import { Dashboards, MeiosisComponent } from '../../../services';
import { CircularSpinner, ViewFooter, TitleRating, ImageBox } from '../../ui';
import { Characteristic, IDilemma } from '../../../models';
import { dilemmasTemplate, roleOptions } from '.';
import { SlimdownView } from 'mithril-ui-form';
import { FlatButton, InputCheckbox, Select } from 'mithril-materialized';

export const DilemmasView: MeiosisComponent = () => {
  const state = {
    resolveObj: labelResolver(dilemmasTemplate),
    characteristics: {},
    answered: false,
    loaded: false,
  } as {
    resolveObj: <IDilemma>(obj: any, parent?: string) => IDilemma | undefined;
    role?: string;
    characteristics: Characteristic;
    correct?: boolean;
    answered: boolean;
    loaded: boolean;
  };

  const id = +m.route.param('id');

  return {
    oninit: ({
      attrs: {
        state: {
          dilemmas: { current },
        },
        actions: {
          dilemmas: { load },
        },
      },
    }) => {
      if (id && current?.$loki !== id) {
        load(id);
      }
      state.loaded = true;
    },
    view: ({
      attrs: {
        state: {
          dilemmas: { current },
        },
        actions: {
          changePage,
          dilemmas: { save },
        },
      },
    }) => {
      const { resolveObj, answered, role, characteristics, correct, loaded } = state;
      // console.log(JSON.stringify(item, null, 2));
      const resolved = resolveObj<IDilemma>(current);
      // console.log(JSON.stringify(resolved, null, 2));
      if (!loaded || !current || current.$loki !== id) {
        return m(CircularSpinner, {
          className: 'center-align',
          style: 'margin-top: 20%;',
        });
      }
      console.log('Showing current: ' + current?.$loki);
      console.table(current);
      if (!resolved) {
        return undefined;
      }

      const { desc, type, notes } = current;
      const { time: cTime = false, info: cInfo = false, conflict: cConflict = false } = current.characteristics || {};

      const decisionModel =
        current.type !== 'characteristics'
          ? undefined
          : !cTime && !cInfo && !cConflict
          ? 'routine beslissing'
          : !cTime && !cInfo && cConflict
          ? 'onderhandelingsbeslissing'
          : !cTime && cInfo && !cConflict
          ? 'consultatieve beslissing'
          : !cTime && cInfo && cConflict
          ? 'consultatieve/onderhandelingsbeslissing'
          : cTime && !cInfo && cConflict
          ? 'autoritaire beslissing'
          : 'intuïtieve beslissing';

      const hasAnswered =
        role ||
        typeof characteristics.time === 'boolean' ||
        typeof characteristics.info === 'boolean' ||
        typeof characteristics.conflict === 'boolean';

      return m('.dilemma-view', [
        m(
          '.item-view',
          m('.row', [
            m(TitleRating, { content: current }),
            m(ImageBox, { content: current }),
            m('.col.s12', m(SlimdownView, { md: desc })),
            type === 'role' &&
              m(Select, {
                label: 'Verantwoordelijke rol',
                className: 'col s12 m6',
                placeholder: 'Kies de verantwoordelijke rol',
                options: roleOptions,
                onchange: (v) => {
                  state.role = (v instanceof Array ? v[0] : v) as string;
                  state.answered = false;
                },
              }),
            type === 'characteristics' && [
              m('.col.s12.question', 'Karakteristieken van deze situatie'),
              m(InputCheckbox, {
                label: 'Tijdsdruk',
                className: 'col s12 m4',
                onchange: (v) => {
                  state.characteristics.time = v;
                  state.answered = false;
                },
              }),
              m(InputCheckbox, {
                label: 'Onzekere informatie',
                className: 'col s12 m4',
                onchange: (v) => {
                  state.characteristics.info = v;
                  state.answered = false;
                },
              }),
              m(InputCheckbox, {
                label: 'Conflicterende belangen',
                className: 'col s12 m4',
                onchange: (v) => {
                  state.characteristics.conflict = v;
                  state.answered = false;
                },
              }),
            ],
            m(FlatButton, {
              label: answered ? 'Verberg het antwoord' : 'Controleer je antwoord',
              iconName: 'check',
              className: 'col s12 m6',
              disabled: !hasAnswered,
              onclick: () => {
                const { time = false, info = false, conflict = false } = characteristics;
                state.answered = !answered;
                state.correct =
                  (type === 'role' && role === current.role) ||
                  (type === 'characteristics' && time === cTime && info === cInfo && conflict === cConflict);
              },
            }),
            answered && [
              correct && [
                type === 'role' &&
                  m('h4.col.s12.center-align', `Goed gedaan, de ${resolved.role} is verantwoordelijk.`),
                type === 'characteristics' &&
                  m('h4.col.s12.center-align', `Goed gedaan, we hebben inderdaad te maken met een ${decisionModel}!`),
              ],
              !correct && [
                type === 'role' &&
                  m('h4.col.s12.center-align', `Helaas, de verantwoording ligt bij de ${resolved.role}.`),
                type === 'characteristics' &&
                  m(
                    'h4.col.s12.center-align',
                    `Helaas, we hebben te maken met een ${decisionModel} met de volgende eigenschap(pen): ${l([
                      cTime && 'hoge tijdsdruk',
                      cInfo && 'grote onzekerheid over de informatie',
                      cConflict && 'conflicterende belangen',
                    ])}.`
                  ),
              ],
              notes && [m('h5.col.s12', 'Terugkoppeling'), m(SlimdownView, { md: notes })],
            ],
          ])
        ),
        m(ViewFooter, {
          content: current,
          edit: Dashboards.DILEMMAS_EDIT,
          changePage,
          save,
        }),
      ]);
    },
  };
};
