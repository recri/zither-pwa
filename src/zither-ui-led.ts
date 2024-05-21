/* eslint-disable @typescript-eslint/no-unused-vars */

import { html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

import type { FaustUIOutputItem, FaustUIMeta } from '@grame/faustwasm';

import { ZitherUiValueComponent } from './zither-ui-value-component.js';

@customElement('zither-ui-led')
export class ZitherUiLed extends ZitherUiValueComponent<FaustUIOutputItem> {
  static styles = css`
    :host {
      display: block;
      padding: 25px;
      color: var(--zither-ui-text-color, #000);
    }
  `;
}
