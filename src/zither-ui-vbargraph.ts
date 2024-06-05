import { html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

import { ZitherUiOutputComponent } from './ZitherUiOutputComponent.js';

@customElement('zither-ui-vbargraph')
export class ZitherUiVbargraph extends ZitherUiOutputComponent {
  static styles = css`
    :host {
      display: block;
      padding: 25px;
      color: var(--zither-ui-text-color, #000);
    }
  `;

  render() {
    const unit = this.metaObject.unit || '';
    const value = this.value.toFixed(3);
    console.log(`zither-ui-vbargraph render`);
    return html`
<div class="flexdiv">
  <div class="canvasdiv">
    <p>zither-ui-vbargraph</p>
    <canvas width="10" height="10"></canvas>
  </div>
  <input type="text" value="${value}${unit}" disabled></input>
</div>`;
  }
}
