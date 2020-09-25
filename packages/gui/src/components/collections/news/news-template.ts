import { UIForm } from 'mithril-ui-form';

export const newsTemplate = [
  { id: 'title', className: 'col s6', label: 'Onderwerp', type: 'text' },
  { id: 'author', className: 'col s6', label: 'Auteur(s)', type: 'text' },
  { id: 'desc', label: 'Het nieuwtje', type: 'textarea' },
  {
    id: 'img',
    label: 'Foto',
    type: 'file',
    options: [{ id: '.gif' }, { id: '.jpg' }, { id: '.jpeg' }, { id: '.png' }, { id: '.svg' }],
    url: `${process.env.SERVER}/upload/nieuwsberichten`,
  },
] as UIForm;
