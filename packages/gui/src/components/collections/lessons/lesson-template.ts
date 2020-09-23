import { UIForm } from 'mithril-ui-form';

export const lessonTemplate = [
  { id: 'title', className: 'col s6', label: 'Title', type: 'text' },
  { id: 'author', className: 'col s6', label: 'Auteurs', type: 'text' },
  { id: 'tag', label: 'Tagline', type: 'text', placeholder: 'Korte samenvatting...' },
  { id: 'desc', label: 'Description', type: 'textarea' },
  { id: 'type', label: 'Type', type: 'text' },
  {
    id: 'img',
    label: 'Foto',
    type: 'file',
    url: `${process.env.SERVER}/upload/lessen`,
  },
] as UIForm;
