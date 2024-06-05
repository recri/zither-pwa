import { css, html } from 'lit';
import { customElement } from 'lit/decorators.js';

import { ZitherUiOutputComponent } from './ZitherUiOutputComponent.js';

@customElement('zither-ui-led')
export class ZitherUiLed extends ZitherUiOutputComponent {
  static styles = css`
    :host {
      display: block;
      padding: 25px;
      color: var(--zither-ui-text-color, #000);
    }
  `;

  render() {
    console.log(`zither-ui-led render`);
    return html`<p>zither-ui-led</p>`;
  }
}
