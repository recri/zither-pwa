/*
  
Primitives and their variations

Faust have 3 organizational UI primitives, aka groups, a group contains other UI items that can also be groups:

vgroup for a group whose items are aligned vertically

hgroup for a group whose items are aligned horizontally

tgroup for a group that has tabs to switch panels for each item.

5 "input" UI primitives that are UI-to-DSP controllers:

button for a buton that gives 1 on press and 0 on release.

checkbox for a toggle that gives 1 or 0 by its state.

hslider for a horizontal slider.

vslider for a vertical slider.

nentry for a numerical entry that is basically an input box

2 "output" UI primitives that are DSP-to-UI monitors:

hbargraph for a horizontal bar-graph that can be used to show any number in range. (e.g. signal level meter)

vbargraph for a vertical bar-graph

By defining a style metadata, user can eventually override the look of a UI primitive. Variations that are supported officially for hslider, vslider and nentry:

knob ([style:knob] Metadata) for a rotary control knob

menu ([style:menu{'Name0':value0;'Name1':value1}] Metadata) for a drop-down menu that provide options and their values.

radio ([style:radio{'Name0':value0;'Name1':value1}] Metadata) for a radio menu.

hbargraph and vbargraph's variations:

led ([style:led] Metadata) for a colored light.

numerical ([style:numerical) Metadata) for a numerical box that displays only values.

*/

import { LitElement, html, css } from 'lit';
import { property, customElement } from 'lit/decorators.js';

// The zither-app should parse the url for parameter setting
@customElement('faust-ui')
export class FaustUi extends LitElement {
  @property({ type: Object }) ui!: any;

  static styles = css`
    :host {
      display: block;
      border: none;
      padding: 0px;
    }
  `;

  render() {
    switch (this.ui.type) {
      case 'vgroup':
      case 'hgroup':
      case 'tgroup':
        return html`<div id="${this.ui.path}"><slot></slot></div>`;
      default:
        return html`<div id="${this.ui.path}"></div>`;
    }
  }
}
