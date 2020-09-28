import m, { FactoryComponent } from 'mithril';
import { Icon } from 'mithril-materialized';
import { SlimdownView } from 'mithril-ui-form';
import { IContent } from '../../models';
import { Dashboards } from '../../services';

export const InfoCard: FactoryComponent<{
  item: Partial<IContent>;
  view: Dashboards;
  edit: Dashboards;
  changePage: (
    page: Dashboards,
    params?:
      | {
          [key: string]: string | number | undefined;
        }
      | undefined,
    query?:
      | {
          [key: string]: string | number | undefined;
        }
      | undefined
  ) => void;
}> = () => {
  return {
    view: ({ attrs: { item, changePage, view, edit } }) => {
      const { rating = 0, comments = [], $loki, tag, title, desc, img, author } = item;
      return m('.col.s12.m6.l4', [
        m(
          '.card.small.hoverable.sticky-action',
          img &&
            m('.card-image.waves-effect.waves-block.waves-light', [
              m('img', {
                alt: title,
                src: `${process.env.SERVER}${img}`,
              }),
              tag && m('span.card-title', title),
            ]),
          m('.card-content', [
            m('span.card-title.activator.grey-text.text-darken-4', [
              tag || title,
              m(Icon, { iconName: 'more_vert', className: 'right' }),
            ]),
            m('p.light.block-with-text', desc),
          ]),
          m('.card-reveal', [
            m('span.card-title.activator.grey-text.text-darken-4', [
              title,
              m(Icon, { iconName: 'close', className: 'right' }),
            ]),
            m(SlimdownView, { md: desc }),
            author && m('p.right', author),
          ]),
          m('.card-action', [
            m(
              'a',
              {
                onclick: () => changePage(view, { id: $loki }),
              },
              m(Icon, {
                className: 'hoverable black-text',
                iconName: 'visibility',
              })
            ),
            m(
              'a',
              {
                onclick: () => changePage(edit, { id: $loki }),
              },
              m(Icon, {
                className: 'hoverable black-text',
                iconName: 'edit',
              })
            ),
            rating > 0 && m.trust(`<span class="badge">${rating}&#9733;</span>`),
            comments.length > 0 && m.trust(`<span class="badge">${comments.length}&#9993;</span>`),
          ])
        ),
      ]);
    },
  };
};
