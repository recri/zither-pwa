/* eslint-disable @typescript-eslint/no-unused-vars */

/*
 ** an explanation of a tabbed pane here
 ** https://medium.com/@blueyorange/make-a-tabs-web-component-in-litelement-using-slots-and-css-293c55dbd155
 */

import { html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

import type { FaustUIGroup, FaustUIItem, FaustUIMeta } from '@grame/faustwasm';

import { ZitherUiGroupComponent } from './zither-ui-group-component.js';

@customElement('zither-ui-tgroup')
export class ZitherUiTgroup extends ZitherUiGroupComponent {
  static styles = css`
    :host {
      display: block;
      padding: 25px;
      color: var(--zither-ui-text-color, #000);
    }
  `;

  render = () =>
    html`
	  <style>
	    ${this.componentStyle()}
	  </style>
	  ${this.componentHeaderRender()}
	  <nav><slot name="label"></slot></nav>
	  <div><slog name="panel"></slot></div>
          ${this.componentFooterRender()}
        `;
}
