import { UIForm } from 'mithril-ui-form';

export const LessonTypes = [
  { id: 'general', label: 'Algemeen' },
  { id: 'bob', label: 'BOB' },
  { id: 'process', label: 'Proces' },
  { id: 'incident', label: 'Melding' },
];

export const lessonTemplate = [
  { id: 'title', className: 'col s4', label: 'Title', type: 'text' },
  { id: 'author', className: 'col s4', label: 'Auteur(s)', type: 'text' },
  { id: 'type', className: 'col s4', label: 'Soort les', type: 'select', multiple: true, options: LessonTypes },
  { id: 'tag', label: 'Tagline', type: 'text', placeholder: 'Korte samenvatting...' },
  { id: 'desc', label: 'Probleem omschrijving', type: 'textarea' },
  { id: 'solution', label: 'Oplossing', type: 'textarea' },
  { id: 'remarks', label: 'Opmerkingen', type: 'textarea' },
  {
    id: 'img',
    label: 'Foto',
    type: 'file',
    url: `${process.env.SERVER}/upload/lessen`,
  },
] as UIForm;
