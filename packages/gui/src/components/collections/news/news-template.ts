import { UIForm } from 'mithril-ui-form';

export const newsTemplate = [
  { id: 'tag', label: 'Onderwerp', type: 'text' },
  { id: 'desc', label: 'Het nieuwtje', type: 'textarea' },
  {
    id: 'img',
    label: 'Foto',
    type: 'file',
    options: [{ id: '.gif' }, { id: '.jpg' }, { id: '.jpeg' }, { id: '.png' }, { id: '.svg' }],
    url: `${process.env.SERVER}/upload/nieuwsberichten`,
  },
] as UIForm;
