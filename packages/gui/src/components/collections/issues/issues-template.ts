import { UIForm } from 'mithril-ui-form';

export const issueCategories = [{ id: 'proces' }, { id: 'pc', label: 'PC' }, { id: 'GMS' }, { id: 'BOB' }];

export const issuesTemplate = [
  { id: 'title', className: 'col s4', label: 'Onderwerp van je probleem', type: 'text' },
  { id: 'type', className: 'col s4', label: 'Categorie', type: 'select', options: issueCategories },
  { id: 'author', className: 'col s4', label: 'Auteur', type: 'text', disabled: true },
  { id: 'desc', label: 'Beschrijf het probleem waar je mee zit', type: 'textarea' },
  {
    id: 'img',
    label: 'Foto',
    type: 'file',
    options: [{ id: '.gif' }, { id: '.jpg' }, { id: '.jpeg' }, { id: '.png' }, { id: '.svg' }],
    url: `${process.env.SERVER}/upload/issues`,
  },
] as UIForm;
