import { UIForm } from 'mithril-ui-form';

export const newsTemplate = [
  { id: 'title', className: 'col s8 m10', label: 'Onderwerp', type: 'text' },
  { id: 'pinned', className: 'col s4 m2', label: 'Pin', type: 'checkbox' },
  { id: 'date', className: 'col s6', label: 'Datum (optioneel)', type: 'date' },
  { id: 'author', className: 'col s6', disabled: true, label: 'Auteur(s)', type: 'text' },
  { id: 'desc', label: 'Bericht', type: 'textarea' },
  { id: 'link', label: 'Webpagina', type: 'url' },
  {
    id: 'img',
    label: 'Foto',
    type: 'file',
    options: [{ id: '.gif' }, { id: '.jpg' }, { id: '.jpeg' }, { id: '.png' }, { id: '.svg' }],
    url: `${process.env.SERVER}/upload/nieuwsberichten`,
  },
] as UIForm;
