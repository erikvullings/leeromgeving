import { UIForm } from 'mithril-ui-form';
import { DilemmaType } from '../../../models';

export const roleOptions = [
  { id: 'HOVD', label: 'HOVD' },
  { id: 'OVD-P', label: 'OVD-P' },
  { id: 'OVD-R', label: 'OVD-R' },
  { id: 'OVD-I', label: 'OVD-I' },
  { id: 'DSI', label: 'DSI' },
  { id: 'DBB', label: 'DBB' },
  { id: 'SGBO', label: 'SGBO' },
  { id: 'OVJ', label: 'OvJ' },
  { id: 'BURGEMEESTER', label: 'Burgemeester' },
  { id: 'ROT', label: 'ROT' },
  { id: 'RBT', label: 'RBT' },
  { id: 'BRW', label: 'Brandweer' },
  { id: 'GHOR', label: 'GHOR' },
];

export const dilemmaOptions = [
  { id: 'role', label: 'Rol verantwoordelijkheid' },
  { id: 'characteristics', label: 'Karakteristieken' },
] as Array<{ id: DilemmaType; label: string }>;

export const dilemmasTemplate = [
  { id: 'title', className: 'col s4', label: 'Onderwerp', type: 'text' },
  { id: 'author', className: 'col s4', label: 'Auteur(s)', type: 'text' },
  { id: 'type', className: 'col s4', label: 'Type', type: 'select', options: dilemmaOptions },
  { id: 'desc', label: 'Dilemma', type: 'textarea' },
  { id: 'role', label: 'Verantwoordelijke rol', show: 'type=role', type: 'select', options: roleOptions },
  {
    id: 'characteristic',
    label: 'Karakteristieken van het dilemma',
    show: 'type=characteristics',
    className: 'col s12 question',
    type: [
      {
        id: 'time',
        label: 'Tijdsdruk',
        className: 'col s4',
        description: 'Hoge tijdsdruk',
        type: 'checkbox',
      },
      {
        id: 'info',
        label: 'Onzekere informatie',
        className: 'col s4',
        description: 'Veel onzekerheid',
        type: 'checkbox',
      },
      {
        id: 'conflict',
        label: 'Conflicterende belangen',
        className: 'col s4',
        description: 'Er zijn conflicterende belangen',
        type: 'checkbox',
      },
      // Show explanation about the chosen set
      {
        type: 'md',
        value: '_Soort beslissing: Routine beslissing_',
        className: 'col s12',
        show: 'time=false & info=false & conflict=false',
      },
      {
        type: 'md',
        value: '_Soort beslissing: Onderhandeling_',
        className: 'col s12',
        show: 'time=false & info=false & conflict=true',
      },
      {
        type: 'md',
        value: '_Soort beslissing: Consultatieve beslissing_',
        className: 'col s12',
        show: 'time=false & info=true & conflict=false',
      },
      {
        type: 'md',
        value: '_Soort beslissing: Consultatie en onderhandelen_',
        className: 'col s12',
        show: 'time=false & info=true & conflict=true',
      },
      { type: 'md', value: 'Hamerstuk', className: 'col s12', show: 'time=true & info=false & conflict=false' },
      {
        type: 'md',
        value: '_Soort beslissing: Autoritaire beslissing_',
        className: 'col s12',
        show: 'time=true & info=false & conflict=true',
      },
      {
        type: 'md',
        value: '_Soort beslissing: Intuïtieve beslissing_',
        className: 'col s12',
        show: ['time=true & info=true & conflict=true', 'time=true & info=true & conflict=false'],
      },
    ],
  },
  {
    id: 'notes',
    label: 'Opmerkingen',
    type: 'textarea',
    description: 'Opmerkingen worden pas zichtbaar na het beantwoorden van het dilemma.',
  },
  {
    id: 'img',
    label: 'Foto',
    type: 'file',
    options: [{ id: '.gif' }, { id: '.jpg' }, { id: '.jpeg' }, { id: '.png' }, { id: '.svg' }],
    url: `${process.env.SERVER}/upload/dilemmas`,
  },
] as UIForm;
