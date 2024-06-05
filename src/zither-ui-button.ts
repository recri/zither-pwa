/* eslint-disable class-methods-use-this */

import { html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

import { ZitherUiInputComponent } from './ZitherUiInputComponent.js';

@customElement('zither-ui-button')
export class ZitherUiButton extends ZitherUiInputComponent {
  static styles = css`
    :host {
      display: block;
      padding: 25px;
      color: var(--zither-ui-text-color, #000);
      fontname: var(--zither-ui-fontname, "Arial"),
      fontsize: var(--zither-ui-fontsize, undefined),
      fontface: var(--zither-ui-fontface, "normal"),
      bgcolor: var(--zither-ui-bgcolor, "rgba(40, 40, 40, 1)"),
      bgoncolor: var(--zither-ui-bgoncolor, "rgba(18, 18, 18, 1)"),
      bordercolor: var(--zither-ui-bordercolor, "rgba(80, 80, 80, 1)"),
      borderoncolor: var(--zither-ui-borderoncolor, "rgba(255, 165, 0, 1)"),
      textcolor: var(--zither-ui-textcolor, "rgba(226, 222, 255, 0.5)"),
      textoncolor: var(--zither-ui-textoncolor, "rgba(255, 165, 0, 1)")
    }

     div.button {
        display: flex;
        position: relative;
        cursor: pointer;
        border-width: 1px;
        text-align: center;
        border-radius: 4px;
        flex: 1 0 auto;
        border-style: solid;
       > span {
          user-select: none;
          margin: auto;
       }
    }
  `;

  setValue(value: number) {
    this.value = value;
    this.top.setValue(this.ui.address, this.value);
  }

  pointerDown() {
    this.setValue(1);
  }

  pointerUp() {
    this.setValue(0);
  }

  buttonStyle() {
    return css``;
  }

  render() {
    console.log(`zither-ui-button render`);
    return html` <style>
        ${this.componentStyle()}
        ${this.buttonStyle()}
      </style>
      ${this.componentHeaderRender()}
      <div
        class="button"
        @pointerDown=${this.pointerDown}
        @pointerUp=${this.pointerUp}
      >
        <span>${this.ui.label}</span>
      </div>
      ${this.componentFooterRender()}`;
  }
}
