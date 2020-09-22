import m from "mithril";
import { SlimdownView } from "mithril-ui-form";

const md = `<h4 class="primary-text">Help pagina</h4>
<h5 class="primary-text">Objective</h5>`;

export const HelpPage = () => ({
  view: () => m(".row", [m(SlimdownView, { md })]),
});
