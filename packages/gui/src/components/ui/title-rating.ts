import m, { FactoryComponent } from 'mithril';
import { IContent } from '../../models';

export const TitleRating: FactoryComponent<{ content: Partial<IContent> }> = () => {
  return {
    view: ({ attrs: { content } }) => {
      const { title, rating, author } = content;
      return [
        m(
          'h3.center-align',
          m.trust(`${title}${rating ? ` (${rating}<span style="color: gold">&#9733;</span>)` : ''}`)
        ),
        author && m('b.col.s12.center-align', `door ${author}`),
      ];
    },
  };
};
