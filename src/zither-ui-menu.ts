import { css, html } from 'lit';
import { customElement } from 'lit/decorators.js';

import { ZitherUiInputComponent } from './ZitherUiInputComponent.js';

@customElement('zither-ui-menu')
export class ZitherUiMenu extends ZitherUiInputComponent {
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
    console.log(`zither-ui-menu render`);
    return html`<p>zither-ui-menu</p>`;
  }
}
