import m, { FactoryComponent } from 'mithril';
import { Icon } from 'mithril-materialized';
import { IContent } from '../../models';
import { Dashboards } from '../../services';

export const InfoCard: FactoryComponent<{
  item: Partial<IContent>;
  dashboard: Dashboards;
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
    view: ({ attrs: { item, changePage, dashboard } }) =>
      m('.col.s12.m6.xl4', [
        m(
          '.card.hoverable',
          m('.card-content', { style: 'min-height: 150px;' }, [
            item.img
              ? m('.card-image', [
                  m('img', { alt: item.title, src: `${process.env.SERVER}${item.img}` }),
                  m('span.card-title', item.title),
                ])
              : m('span.card-title', item.title),
            m('p.light.block-with-text', item.tag || item.desc),
          ]),
          m('.card-action', [
            m(
              'a',
              {
                onclick: () => changePage(dashboard, { id: item.$loki }, { mode: 'view' }),
              },
              m(Icon, {
                className: 'hoverable black-text',
                iconName: 'visibility',
              })
            ),
            m(
              'a',
              {
                onclick: () => changePage(dashboard, { id: item.$loki }, { mode: 'edit' }),
              },
              m(Icon, {
                className: 'hoverable black-text',
                iconName: 'edit',
              })
            ),
            // m(
            //   "span.badge",
            //   `${
            //     item.lessons
            //       ? item.lessons.length === 1
            //         ? "1 lesson"
            //         : `${item.lessons.length} lessons`
            //       : "0 lessons"
            //   }`
            // ),
          ])
        ),
      ]),
  };
};
