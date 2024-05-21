/* eslint-disable @typescript-eslint/no-unused-vars */

import { html, css } from 'lit';
import { property, customElement } from 'lit/decorators.js';

import type {
  FaustUIOutputItem,
  FaustUIItem,
  FaustUIMeta,
} from '@grame/faustwasm';

import { ZitherUiValueComponent } from './zither-ui-value-component.js';

@customElement('zither-ui-vbargraph')
export class ZitherUiVbargraph extends ZitherUiValueComponent<FaustUIOutputItem> {
  static styles = css`
    :host {
      display: block;
      padding: 25px;
      color: var(--zither-ui-text-color, #000);
    }
  `;

  override render() {
    const unit = this.metaObject.unit || '';
    const value = this.value.toFixed(3);
    return html`
<div class="flexdiv">
  <div class="canvasdiv">
    <canvas width="10" height="10"></canvas>
  </div>
  <input type="text" value="${value}${unit}" disabled></input>
</div>`;
  }
}
