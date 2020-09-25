import m, { FactoryComponent } from 'mithril';
import { FlatButton } from 'mithril-materialized';
import { LayoutForm } from 'mithril-ui-form';
import { IContent } from '../../models';
import { Dashboards } from '../../services';
import { IComment } from '../../models/comment';
import { SlimdownView } from 'mithril-ui-form';

export const ViewFooter: FactoryComponent<{
  current: Partial<IContent>;
  edit: Dashboards;
  changePage: (d: Dashboards, params: { [key: string]: string | number | undefined }) => void;
  save: (item: Partial<IContent>) => void;
}> = () => {
  let editCommentIndex = -1;

  return {
    view: ({ attrs: { current, edit, changePage, save } }) => {
      const { comments = [] } = current;
      return [
        m(
          'ul',
          comments.map((c, i) => {
            const { desc = '', author, created, mutated } = c;
            const d = new Date(mutated || created);
            return editCommentIndex === i
              ? m(
                  '.row',
                  m(LayoutForm, {
                    form: [
                      { id: 'desc', label: 'Commentaar', type: 'textarea' },
                      { id: 'author', label: 'Auteur', type: 'text', className: 'col s6' },
                    ],
                    obj: c,
                  }),
                  m(FlatButton, {
                    label: 'Save',
                    iconName: 'save',
                    className: 'col s3',
                    onclick: () => {
                      editCommentIndex = -1;
                      save(current);
                    },
                  }),
                  m(FlatButton, {
                    label: 'Delete',
                    iconName: 'delete',
                    className: 'col s3',
                    onclick: () => {
                      current.comments?.splice(i, 1);
                      editCommentIndex = -1;
                      save(current);
                    },
                  })
                )
              : m('.comment', [
                  m(SlimdownView, { md: desc, className: 'comment-text' }),
                  m('ul.list-inline', [
                    m('i', `${d.toLocaleString('nl-NL')}${author ? ` door ${author}` : ''}`),
                    m(FlatButton, { className: 'small', iconName: 'edit', onclick: () => (editCommentIndex = i) }),
                  ]),
                ]);
          })
        ),
        m('ul.list-inline', [
          m(
            'li',
            m(FlatButton, {
              label: 'Nieuwe reactie',
              onclick: () => {
                const comment = { created: new Date().valueOf(), desc: '', author: '', rating: 0 } as IComment;
                if (current.comments) {
                  current.comments.push(comment);
                } else {
                  current.comments = [comment];
                }
                editCommentIndex = current.comments.length - 1;
              },
            })
          ),
          m('li', m(FlatButton, { label: 'EDIT', onclick: () => changePage(edit, { id: current.$loki }) })),
          m(
            'li',
            m(FlatButton, {
              label: 'UP',
              onclick: () => {
                current.rating = (current.rating || 0) + 1;
                save(current);
              },
            })
          ),
          m(
            'li',
            m(FlatButton, {
              label: 'DOWN',
              onclick: () => {
                current.rating = (current.rating || 0) - 1;
                save(current);
              },
            })
          ),
        ]),
      ];
    },
  };
};
