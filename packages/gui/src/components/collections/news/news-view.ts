import m from 'mithril';
// import { labelResolver } from 'mithril-ui-form';
import { labelResolver } from '../../../utils';
import { Dashboards, MeiosisComponent } from '../../../services';
import { CircularSpinner, ViewFooter, TitleRating, ImageBox } from './../../ui';
import { IContent } from '../../../models';
import { newsTemplate } from '.';
import { SlimdownView } from 'mithril-ui-form';

export const NewsView: MeiosisComponent = () => {
  const state = {
    loaded: false,
    resolveObj: labelResolver(newsTemplate),
  };
  const id = +m.route.param('id');
  return {
    oninit: ({
      attrs: {
        state: {
          news: { current },
        },
        actions: {
          news: { load },
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
          news: { current },
        },
        actions: {
          changePage,
          news: { save },
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

      const { desc, link } = current;

      return [
        m(
          '.item-view',
          m('.row', [
            m(TitleRating, { content: current }),
            m(ImageBox, { content: current }),
            m(SlimdownView, { md: desc }),
            link &&
              m(
                '.col.s12',
                m('a', { href: link, alt: 'Bron', target: '_target' }, m('i', 'Voor meer informatie, klik hier.'))
              ),
          ])
        ),
        m(ViewFooter, {
          content: current,
          edit: Dashboards.NEWS_EDIT,
          changePage,
          save,
        }),
      ];
    },
  };
};
