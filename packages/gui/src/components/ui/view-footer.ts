import m, { FactoryComponent } from 'mithril';
import { FlatButton } from 'mithril-materialized';
import { LayoutForm, UIForm } from 'mithril-ui-form';
import { IContent } from '../../models';
import { Auth, Dashboards } from '../../services';
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
      const { comments = [], ratedBy = [] } = content;
      const curRating = ratedBy.filter((r) => r.author === Auth.username).shift();

      const rate = (rating: 1 | -1) => {
        if (curRating) {
          curRating.rating = rating;
        } else {
          ratedBy.push({ author: Auth.username, rating });
          content.ratedBy = ratedBy;
        }
        content.rating = ratedBy.reduce((acc, cur) => acc + cur.rating, 0);
      };

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
                      {
                        id: 'author',
                        label: 'Auteur',
                        type: 'text',
                        disabled: true,
                        className: 'col s6',
                      },
                    ] as UIForm,
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
                    Auth.isOwner(c) &&
                      m(FlatButton, { className: 'small', iconName: 'edit', onclick: () => (editCommentIndex = i) }),
                  ]),
                ]);
          })
        ),
        Auth.isAuthenticated &&
          m('ul.list-inline', [
            m(
              'li',
              m(FlatButton, {
                label: 'Nieuwe reactie',
                iconName: 'add',
                onclick: () => {
                  const comment = {
                    created: new Date().valueOf(),
                    desc: '',
                    author: [Auth.username],
                    rating: 0,
                  } as IComment;
                  if (content.comments) {
                    content.comments.push(comment);
                  } else {
                    content.comments = [comment];
                  }
                  editCommentIndex = content.comments.length - 1;
                },
              })
            ),
            Auth.isOwner(content) &&
              m('li', m(FlatButton, { iconName: 'edit', onclick: () => changePage(edit, { id: content.$loki }) })),
            Auth.isAuthenticated &&
              m(
                'li',
                m(FlatButton, {
                  iconName: 'thumb_up',
                  iconClass: curRating && curRating.rating === 1 ? 'orange-text' : '',
                  disabled: curRating && curRating.rating === 1,
                  onclick: () => {
                    rate(1);
                    save(content);
                  },
                })
              ),
            Auth.isAuthenticated &&
              m(
                'li',
                m(FlatButton, {
                  iconName: 'thumb_down',
                  iconClass: curRating && curRating.rating === -1 ? 'orange-text' : '',
                  disabled: curRating && curRating.rating === -1,
                  onclick: () => {
                    rate(-1);
                    save(content);
                  },
                })
              ),
          ]),
      ];
    },
  };
};
