import { UIForm } from 'mithril-ui-form';

export const LessonTypes = [
  { id: 'general', label: 'Algemeen' },
  { id: 'bob', label: 'BOB' },
  { id: 'process', label: 'Proces' },
  { id: 'incident', label: 'Melding' },
];

export const lessonTemplate = [
  { id: 'title', className: 'col s4', label: 'Titel', type: 'text' },
  { id: 'author', className: 'col s4', label: 'Auteur(s)', type: 'text', disabled: true },
  { id: 'type', className: 'col s4', label: 'Soort les', type: 'select', multiple: true, options: LessonTypes },
  { id: 'tag', label: 'Tagline', type: 'text', placeholder: 'Korte samenvatting...' },
  {
    id: 'desc',
    label: 'Situatie omschrijving',
    placeholder: 'Beschrijf kort de situatie en het probleem...',
    type: 'textarea',
  },
  { id: 'solution', label: 'Oplossing', type: 'textarea' },
  { id: 'remarks', label: 'Opmerkingen', type: 'textarea' },
  {
    id: 'img',
    label: 'Foto',
    type: 'file',
    options: [{ id: '.gif' }, { id: '.jpg' }, { id: '.jpeg' }, { id: '.png' }, { id: '.svg' }],
    url: `${process.env.SERVER}/upload/lessen`,
  },
] as UIForm;
