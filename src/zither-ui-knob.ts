import { css } from 'lit';
import { customElement } from 'lit/decorators.js';

import { ZitherUiInputComponent } from './ZitherUiInputComponent.js';

@customElement('zither-ui-knob')
export class ZitherUiKnob extends ZitherUiInputComponent {
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
