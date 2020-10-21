import m, { FactoryComponent } from 'mithril';
import { Icon } from 'mithril-materialized';
import { render } from 'mithril-ui-form';
import { IContent } from '../../models';
import { Dashboards } from '../../services';
import { dashboardToIcon } from '../../utils';

export const InfoCard: FactoryComponent<{
  item: Partial<IContent>;
  list: Dashboards;
  view: Dashboards;
  edit: Dashboards;
  className?: string;
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
    view: ({ attrs: { item, changePage, className = 'col s12 m4', view, edit, list } }) => {
      const { rating = 0, comments = [], $loki, tag, title, desc, img, author, type } = item;
      return m('div', { className }, [
        m(
          '.card.hoverable.sticky-action.small', // + (img ? '.medium' : '.small'),
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
            m('p.light.block-with-text', m.trust(render((type === 'mc' ? title : desc) || '', true))),
          ]),
          m('.card-reveal', [
            m('span.card-title.activator.grey-text.text-darken-4', [
              title,
              m(Icon, { iconName: 'close', className: 'right' }),
            ]),
            m.trust(render((type === 'mc' ? title : desc) || '', true)),
            author && m('p.right', author),
          ]),
          m('.card-action', [
            m(
              'a',
              {
                onclick: () => changePage(list),
              },
              m(Icon, {
                className: 'hoverable black-text',
                iconName: dashboardToIcon(list),
              })
            ),
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
