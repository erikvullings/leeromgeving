import { UIForm } from 'mithril-ui-form';

export const scenarioCategories = [
  { id: 'plofkraak' },
  { id: 'manhunt' },
  { id: 'inbraak' },
  { id: 'overval' },
  { id: 'liquidatie' },
  { id: 'overig' },
];

export const scenarioTemplate = [
  { id: 'title', className: 'col s4', label: 'Onderwerp', type: 'text' },
  { id: 'type', className: 'col s4', label: 'Categorie', type: 'select', options: scenarioCategories },
  { id: 'author', className: 'col s4', label: 'Auteur', type: 'text' },
  { id: 'desc', label: 'Context', type: 'textarea' },
  {
    id: 'img',
    label: 'Foto',
    type: 'file',
    options: [{ id: '.gif' }, { id: '.jpg' }, { id: '.jpeg' }, { id: '.png' }, { id: '.svg' }],
    url: `${process.env.SERVER}/upload/scenarios`,
  },
  {
    id: 'phases',
    label: 'Draaiboek snapshots',
    type: [
      { id: 'title', className: 'col s12', label: 'Fase', type: 'text' },
      { id: 'desc', label: 'Beschrijving van de situatie', type: 'textarea' },
      {
        id: 'img',
        label: 'Foto',
        type: 'file',
        options: [{ id: '.gif' }, { id: '.jpg' }, { id: '.jpeg' }, { id: '.png' }, { id: '.svg' }],
        url: `${process.env.SERVER}/upload/scenarios`,
      },
      {
        id: 'dilemmas',
        label: 'Vragen die we op dit punt hadden',
        type: [
          { id: 'title', className: 'col s12', label: 'Vraag', type: 'text' },
          { id: 'desc', label: 'Toelichting', type: 'textarea' },
          { id: 'notes', label: 'Gemaakte keuze', type: 'textarea' },
        ],
        repeat: true,
        pageSize: 10,
      },
    ],
    repeat: true,
    pageSize: 1,
  },
] as UIForm;
