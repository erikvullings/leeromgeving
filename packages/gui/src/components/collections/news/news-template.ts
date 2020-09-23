import { UIForm } from 'mithril-ui-form';

export const newsTemplate = [
  { id: 'type', label: 'Type', type: 'text' },
  { id: 'title', label: 'Title', type: 'text' },
  { id: 'desc', label: 'Description', type: 'text' },
  {
    id: 'img',
    label: 'Foto',
    type: 'file',
    url: `${process.env.SERVER}/upload/nieuwsberichten`,
  },
] as UIForm;
