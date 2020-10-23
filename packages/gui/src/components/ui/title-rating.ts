import m, { FactoryComponent } from 'mithril';
import { IContent } from '../../models';

export const TitleRating: FactoryComponent<{ content: Partial<IContent> }> = () => {
  return {
    view: ({ attrs: { content } }) => {
      const { date, title, rating, author } = content;
      const d = date ? '<br>' + new Date(date).toLocaleDateString('nl') : '';
      return [
        m(
          'h3.center-align',
          m.trust(`${title}${rating ? ` (${rating}<span style="color: gold">&#9733;</span>)` : ''}`)
        ),
        author && m('b.col.s12.center-align', m.trust(`door ${author}${d}`)),
      ];
    },
  };
};
