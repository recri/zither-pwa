import { html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

import { ZitherUiInputComponent } from './ZitherUiInputComponent.js';

@customElement('zither-ui-soundfile')
export class ZitherUiSoundfile extends ZitherUiInputComponent {
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
    console.log(`zither-ui-soundfile render`);
    return html`<div><p>zither-ui-soundfile</p></div>`;
  }
}
