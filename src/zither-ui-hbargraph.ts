import { css, html } from 'lit';
import { customElement } from 'lit/decorators.js';

import { ZitherUiOutputComponent } from './ZitherUiOutputComponent.js';

@customElement('zither-ui-hbargraph')
export class ZitherUiHbargraph extends ZitherUiOutputComponent {
  static styles = css`
    :host {
      display: block;
      padding: 25px;
      color: var(--zither-ui-text-color, #000);
    }
  `;

  render() {
    return html`<p>zither-ui-hbargraph</p>`;
  }
}
