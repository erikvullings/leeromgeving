import m from 'mithril';
// import { labelResolver } from 'mithril-ui-form';
import { labelResolver } from '../../../utils';
import { Dashboards, MeiosisComponent } from '../../../services';
import { CircularSpinner } from './../../ui/preloader';
import { IContent } from '../../../models';
import { lessonTemplate } from '.';
import { SlimdownView } from 'mithril-ui-form';
import { LessonTypes } from './lesson-template';
import { FlatButton } from 'mithril-materialized';
import { ViewFooter } from '../../ui/view-footer';

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
          lessons: { current },
        },
        actions: {
          changePage,
          lessons: { save },
        },
      },
    }) => {
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

      const { title, type, desc, tag, rating, solution, img, author, remarks } = current;

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
            m(
              'h3.center-align',
              m.trust(`${title}${rating ? ` (${rating}<span style="color: gold">&#9733;</span>)` : ''}`)
            ),
            author && m('b.col.s12.center-align', author),
            (tag || type) && m('i.col.s12.center-align', `${tag}${type ? ` (categorie: ${convertedTypes})` : ''}`),
            img &&
              m('img.materialboxed', {
                style: 'max-width: 100%; max-height: 300px; margin: 0 auto',
                alt: title,
                src: `${process.env.SERVER}${img}`,
                oncreate: ({ dom }) => M.Materialbox.init(dom),
              }),
            desc && [m('h4', 'Probleem omschrijving'), m(SlimdownView, { md: desc })],
            solution && [m('h4', 'Oplossing'), m(SlimdownView, { md: solution })],
            remarks && [m('h4', 'Opmerkingen'), m(SlimdownView, { md: remarks })],
          ])
        ),

        m(ViewFooter, {
          current,
          edit: Dashboards.LESSON_EDIT,
          changePage,
          save,
        }),
      ];
    },
  };
};
