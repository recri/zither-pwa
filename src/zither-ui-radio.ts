/* eslint-disable @typescript-eslint/no-unused-vars */

import { css } from 'lit';
import { customElement } from 'lit/decorators.js';

import type {
  FaustUIInputItem,
  FaustUIItem,
  FaustUIMeta,
} from '@grame/faustwasm';

import { ZitherUiValueComponent } from './zither-ui-value-component.js';

@customElement('zither-ui-radio')
export class ZitherUiRadio extends ZitherUiValueComponent<FaustUIInputItem> {
  static styles = css`
    :host {
      display: block;
      padding: 25px;
      color: var(--zither-ui-text-color, #000);
    }

    div {
    }
  `;
}
