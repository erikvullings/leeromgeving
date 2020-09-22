import m from 'mithril';
import { SlimdownView } from 'mithril-ui-form';

const md = `<h4 class="primary-text">Over APPLICATION</h4>

##### Icons attribution

- Created by ... from the Noun Project
`;

export const AboutPage = () => ({
  view: () => m('.row', [m(SlimdownView, { md })]),
});
