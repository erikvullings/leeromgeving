import m from 'mithril';
// import { labelResolver } from 'mithril-ui-form';
import { labelResolver } from '../../../utils';
import { Dashboards, MeiosisComponent } from '../../../services';
import { CircularSpinner } from './../../ui/preloader';
import { IContent } from '../../../models';
import { lessonTemplate } from '.';
import { SlimdownView } from 'mithril-ui-form';
import { LessonTypes } from './lesson-template';
import { ViewFooter } from '../../ui/view-footer';
import { TitleRating } from '../../ui/title-rating';
import { ImageBox } from '../../ui';

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
        state: {
          lessons: { current: content },
        },
        actions: {
          changePage,
          lessons: { save },
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

      const { type, desc, tag, solution, remarks } = content;

      const convertedTypes = type
        ? type instanceof Array
          ? type
              .map((t) =>
                LessonTypes.filter((x) => x.id === t)
                  .map((t) => t.label)
                  .shift()
              )
              .filter(Boolean)
              .join(', ')
          : LessonTypes.filter((x) => x.id === type)
              .map((t) => t.label)
              .shift()
        : undefined;

      return [
        m(
          '.item-view',
          m('.row', [
            m(TitleRating, { content }),
            (tag || type) && m('i.col.s12.center-align', `${tag}${type ? ` (categorie: ${convertedTypes})` : ''}`),
            m(ImageBox, { content }),
            desc && [m('h4', 'Probleem omschrijving'), m(SlimdownView, { md: desc })],
            solution && [m('h4', 'Oplossing'), m(SlimdownView, { md: solution })],
            remarks && [m('h4', 'Opmerkingen'), m(SlimdownView, { md: remarks })],
          ])
        ),

        m(ViewFooter, {
          content: content,
          edit: Dashboards.LESSON_EDIT,
          changePage,
          save,
        }),
      ];
    },
  };
};
