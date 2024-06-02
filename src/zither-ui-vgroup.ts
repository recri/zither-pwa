/* eslint-disable @typescript-eslint/no-unused-vars */

import { css, html } from 'lit';
import { customElement } from 'lit/decorators.js';

import type { FaustUIGroup } from './faust/faustwasm';

import { ZitherUiComponent } from './ZitherUiComponent.js';

@customElement('zither-ui-vgroup')
export class ZitherUiVgroup extends ZitherUiComponent<FaustUIGroup> {
  static styles = css`
    :host {
      display: block;
      padding: 25px;
      color: var(--zither-ui-text-color, #000);
    }

    div {
      display: block flex;
      flex-direction: column;
    }
  `;

  render() {
    return html`
      <style>
        ${this.componentStyle()}
      </style>
      ${this.componentHeaderRender()}
      <div><slot></slot></div>
      ${this.componentFooterRender()}
    `;
  }
}
