import m, { FactoryComponent } from 'mithril';
import { IContent } from '../../models';

export const ImageBox: FactoryComponent<{ content: Partial<IContent> }> = () => {
  return {
    view: ({
      attrs: {
        content: { img, title },
      },
    }) => {
      return (
        img &&
        m(
          '.row',
          m(
            '.col.s12',
            m('img.materialboxed', {
              style: 'max-width: 100%; max-height: 500px; margin: 0px auto',
              alt: title,
              src: `${process.env.SERVER}${img}`,
              oncreate: ({ dom }) => M.Materialbox.init(dom),
            })
          )
        )
      );
    },
  };
};
