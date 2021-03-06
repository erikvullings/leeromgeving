import { UIForm } from 'mithril-ui-form';

export const tipsTemplate = [
  { id: 'title', className: 'col s6', label: 'Onderwerp van je tip', type: 'text' },
  { id: 'author', className: 'col s6', label: 'Auteur(s)', type: 'text', disabled: true },
  { id: 'desc', label: 'Beschrijving', type: 'textarea' },
  {
    id: 'img',
    label: 'Foto',
    type: 'file',
    options: [{ id: '.gif' }, { id: '.jpg' }, { id: '.jpeg' }, { id: '.png' }, { id: '.svg' }],
    url: `${process.env.SERVER}/upload/tips`,
  },
] as UIForm;
