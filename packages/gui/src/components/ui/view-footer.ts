import m, { FactoryComponent } from 'mithril';
import { FlatButton } from 'mithril-materialized';
import { LayoutForm } from 'mithril-ui-form';
import { IContent } from '../../models';
import { Dashboards } from '../../services';
import { IComment } from '../../models/comment';
import { SlimdownView } from 'mithril-ui-form';

export const ViewFooter: FactoryComponent<{
  content: Partial<IContent>;
  edit: Dashboards;
  changePage: (d: Dashboards, params: { [key: string]: string | number | undefined }) => void;
  save: (item: Partial<IContent>) => void;
}> = () => {
  let editCommentIndex = -1;

  return {
    view: ({ attrs: { content, edit, changePage, save } }) => {
      const { comments = [] } = content;
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
                      save(content);
                    },
                  }),
                  m(FlatButton, {
                    label: 'Delete',
                    iconName: 'delete',
                    className: 'col s3',
                    onclick: () => {
                      content.comments?.splice(i, 1);
                      editCommentIndex = -1;
                      save(content);
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
              iconName: 'add',
              onclick: () => {
                const comment = { created: new Date().valueOf(), desc: '', author: '', rating: 0 } as IComment;
                if (content.comments) {
                  content.comments.push(comment);
                } else {
                  content.comments = [comment];
                }
                editCommentIndex = content.comments.length - 1;
              },
            })
          ),
          m('li', m(FlatButton, { iconName: 'edit', onclick: () => changePage(edit, { id: content.$loki }) })),
          m(
            'li',
            m(FlatButton, {
              iconName: 'thumb_up',
              onclick: () => {
                content.rating = (content.rating || 0) + 1;
                save(content);
              },
            })
          ),
          m(
            'li',
            m(FlatButton, {
              iconName: 'thumb_down',
              onclick: () => {
                content.rating = (content.rating || 0) - 1;
                save(content);
              },
            })
          ),
        ]),
      ];
    },
  };
};
