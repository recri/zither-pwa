/*
 ** an explanation of a tabbed pane here
 ** https://medium.com/@blueyorange/make-a-tabs-web-component-in-litelement-using-slots-and-css-293c55dbd155
 */

import { html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

import { ZitherUiGroupComponent } from './ZitherUiGroupComponent.js';

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
