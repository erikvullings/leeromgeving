import m from 'mithril';
// import { labelResolver } from 'mithril-ui-form';
import { labelResolver } from '../../../utils';
import { Dashboards, MeiosisComponent } from '../../../services';
import { CircularSpinner, ViewFooter, TitleRating, ImageBox } from '../../ui';
import { IContent } from '../../../models';
import { tipsTemplate } from '.';
import { SlimdownView } from 'mithril-ui-form';

export const TipsView: MeiosisComponent = () => {
  const state = {
    loaded: false,
    resolveObj: labelResolver(tipsTemplate),
  };
  const id = +m.route.param('id');
  return {
    oninit: ({
      attrs: {
        state: {
          tips: { current },
        },
        actions: {
          tips: { load },
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
          tips: { current },
        },
        actions: {
          changePage,
          tips: { save },
        },
      },
    }) => {
      const { resolveObj, loaded } = state;
      // console.log(JSON.stringify(item, null, 2));
      const resolved = resolveObj<IContent>(current);
      // console.log(JSON.stringify(resolved, null, 2));
      if (!loaded || !current || current.$loki !== id) {
        return m(CircularSpinner, {
          className: 'center-align',
          style: 'margin-top: 20%;',
        });
      }
      if (!resolved) {
        return undefined;
      }

      const { desc } = current;

      return [
        m(
          '.item-view',
          m('.row', [
            m(TitleRating, { content: current }),
            m(ImageBox, { content: current }),
            m('.col.s12', m(SlimdownView, { md: desc })),
          ])
        ),
        m(ViewFooter, {
          content: current,
          edit: Dashboards.TIPS_EDIT,
          changePage,
          save,
        }),
      ];
    },
  };
};
