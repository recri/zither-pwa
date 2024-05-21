/* eslint-disable @typescript-eslint/no-unused-vars */

import { css } from 'lit';
import { customElement } from 'lit/decorators.js';

import type { FaustUIGroup, FaustUIItem, FaustUIMeta } from '@grame/faustwasm';

import { ZitherUiGroupComponent } from './zither-ui-group-component.js';

@customElement('zither-ui-hgroup')
export class ZitherUiHgroup extends ZitherUiGroupComponent {
  static styles = css`
    :host {
      display: block;
      padding: 25px;
      color: var(--zither-ui-text-color, #000);
    }

    div {
      display: block flex;
      flex-direction: row;
    }
  `;
}
