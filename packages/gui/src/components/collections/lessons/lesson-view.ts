import m from 'mithril';
// import { labelResolver } from 'mithril-ui-form';
import { labelResolver } from '../../../utils';
import { MeiosisComponent } from '../../../services';
import { CircularSpinner } from './../../ui/preloader';
import { IContent } from '../../../models';
import { lessonTemplate } from '.';

export const LessonView: MeiosisComponent = () => {
  const state = {
    loaded: false,
    resolveObj: labelResolver(lessonTemplate),
  };
  return {
    oninit: ({
      attrs: {
        state: {
          lessons: { current },
        },
        actions: {
          lessons: { load },
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
        state: { lessons },
      },
    }) => {
      const { current } = lessons;
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

      const { title, desc } = current;

      return m('.item-view', m('.row', [m('.col.s6', title), m('.col.s6', desc)]));
    },
  };
};
