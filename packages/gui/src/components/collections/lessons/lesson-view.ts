import m from 'mithril';
import { labelResolver } from 'mithril-ui-form';
import { Dashboards, MeiosisComponent } from '../../../services';
import { CircularSpinner, ViewFooter, TitleRating, ImageBox } from './../../ui';
import { LessonTypes, lessonTemplate } from '.';
import { SlimdownView } from 'mithril-ui-form';

export const LessonView: MeiosisComponent = () => {
  const state = {
    loaded: false,
    resolveObj: labelResolver(lessonTemplate),
  };
  const id = +m.route.param('id');
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
      if (id && current?.$loki !== id) {
        load(id);
        state.loaded = true;
      }
    },
    view: ({
      attrs: {
        state: {
          lessons: { current },
        },
        actions: {
          changePage,
          lessons: { save },
        },
      },
    }) => {
      const { loaded } = state;
      // console.log(JSON.stringify(item, null, 2));
      // const resolved = resolveObj<IContent>(current);
      // console.log(JSON.stringify(resolved, null, 2));
      if (!loaded || !current || current.$loki !== id) {
        return m(CircularSpinner, {
          className: 'center-align',
          style: 'margin-top: 20%;',
        });
      }

      const { type, desc, tag, solution, remarks } = current;

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
            m(TitleRating, { content: current }),
            (tag || type) && m('i.col.s12.center-align', `${tag}${type ? ` (categorie: ${convertedTypes})` : ''}`),
            m(ImageBox, { content: current }),
            desc && [m('h4', 'Probleem omschrijving'), m(SlimdownView, { md: desc })],
            solution && [m('h4', 'Oplossing'), m(SlimdownView, { md: solution })],
            remarks && [m('h4', 'Opmerkingen'), m(SlimdownView, { md: remarks })],
          ])
        ),

        m(ViewFooter, {
          content: current,
          edit: Dashboards.LESSON_EDIT,
          changePage,
          save,
        }),
      ];
    },
  };
};
