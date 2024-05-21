/* eslint-disable @typescript-eslint/no-unused-vars */

import { html, css, LitElement } from 'lit';
import { property, customElement } from 'lit/decorators.js';

import type {
  FaustUIInputItem,
  FaustUIItem,
  FaustUIMeta,
} from '@grame/faustwasm';

@customElement('zither-ui-soundfile')
export class ZitherUiSoundfile extends LitElement {
  static styles = css`
    :host {
      display: block;
      padding: 25px;
      color: var(--zither-ui-text-color, #000);
    }

    div {
    }
  `;

  @property({ type: Object }) ui!: FaustUIInputItem;

  render() {
    return html`<div>></div>`;
  }
}
