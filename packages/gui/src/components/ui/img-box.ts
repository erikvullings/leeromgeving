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
        m('img.materialboxed', {
          style: 'max-width: 100%; max-height: 300px; margin: 0 auto',
          alt: title,
          src: `${process.env.SERVER}${img}`,
          oncreate: ({ dom }) => M.Materialbox.init(dom),
        })
      );
    },
  };
};
