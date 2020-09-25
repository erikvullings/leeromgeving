import m from 'mithril';
// import { labelResolver } from 'mithril-ui-form';
import { labelResolver } from '../../../utils';
import { Dashboards, MeiosisComponent } from '../../../services';
import { CircularSpinner } from '../../ui/preloader';
import { IContent } from '../../../models';
import { newsTemplate } from '.';
import { ViewFooter } from '../../ui/view-footer';
import { SlimdownView } from 'mithril-ui-form';
import { TitleRating } from '../../ui';

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
          news: { current },
        },
        actions: {
          changePage,
          news: { save },
        },
      },
    }) => {
      const { resolveObj } = state;
      // console.log(JSON.stringify(item, null, 2));
      const resolved = resolveObj<IContent>(current);
      // console.log(JSON.stringify(resolved, null, 2));
      if (!current) {
        return m(CircularSpinner, {
          className: 'center-align',
          style: 'margin-top: 20%;',
        });
      }
      if (!resolved) {
        return undefined;
      }

      const { title, desc, author, img } = current;

      return [
        m(
          '.item-view',
          m('.row', [
            m(TitleRating, { content: current }),
            img &&
              m('img.materialboxed', {
                style: 'max-width: 100%; max-height: 300px; margin: 0 auto',
                alt: title,
                src: `${process.env.SERVER}${img}`,
                oncreate: ({ dom }) => M.Materialbox.init(dom),
              }),
            m('.col.s12', m(SlimdownView, { md: desc })),
          ])
        ),
        m(ViewFooter, {
          current,
          edit: Dashboards.NEWS_EDIT,
          changePage,
          save,
        }),
      ];
    },
  };
};
