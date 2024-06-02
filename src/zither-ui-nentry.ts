import { css, html } from 'lit';
import { customElement } from 'lit/decorators.js';

import { ZitherUiInputComponent } from './ZitherUiInputComponent.js';

@customElement('zither-ui-nentry')
export class ZitherUiNentry extends ZitherUiInputComponent {
  static styles = css`
    :host {
      display: block;
      padding: 25px;
      color: var(--zither-ui-text-color, #000);
    }

    div {
    }
  `;

  render() {
    return html`<p>zither-ui-nentry</p>`;
  }
}
