import { css } from 'lit';
import { customElement } from 'lit/decorators.js';

import { ZitherUiButton } from './zither-ui-button.js';

@customElement('zither-ui-checkbox')
export class ZitherUiCheckbox extends ZitherUiButton {
  static styles = css`
    :host {
      display: block;
      padding: 25px;
      color: var(--zither-ui-text-color, #000);
    }
    div {
      display: flex;
      position: relative;
      cursor: pointer;
      border-width: 1px;
      text-align: center;
      border-radius: 1px;
      flex: 1 0 auto;
      border-style: solid;
    }
    span {
      margin: auto;
      user-select: none;
    }
  `;

  pointerDown() {
    this.setValue(1 - this.value);
  }

  /* eslint-disable class-methods-use-this */
  pointerUp() {}
  /* eslint-enable class-methods-use-this */
}
