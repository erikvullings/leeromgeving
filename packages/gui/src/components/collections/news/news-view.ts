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
      const id = +m.route.param('id');
      if (id && current?.$loki !== id) {
        load(id);
      }
    },
    view: ({
      attrs: {
        state: {
          news: { current: content },
        },
        actions: {
          changePage,
          news: { save },
        },
      },
    }) => {
      const { resolveObj } = state;
      // console.log(JSON.stringify(item, null, 2));
      const resolved = resolveObj<IContent>(content);
      // console.log(JSON.stringify(resolved, null, 2));
      if (!content) {
        return m(CircularSpinner, {
          className: 'center-align',
          style: 'margin-top: 20%;',
        });
      }
      if (!resolved) {
        return undefined;
      }

      const { desc } = content;

      return [
        m(
          '.item-view',
          m('.row', [
            m(TitleRating, { content }),
            m(ImageBox, { content }),
            m('.col.s12', m(SlimdownView, { md: desc })),
          ])
        ),
        m(ViewFooter, {
          content,
          edit: Dashboards.NEWS_EDIT,
          changePage,
          save,
        }),
      ];
    },
  };
};
