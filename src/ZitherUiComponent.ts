import { html, css, LitElement } from 'lit';
import { property } from 'lit/decorators.js';

import type { ZitherUi } from './zither-ui.js';

/*
 ** Common behavior for all zither/faust ui components
 ** They all have a label, a box which encloses the
 ** component content on screen
 */
export class ZitherUiComponent<T> extends LitElement {
  @property({ type: Object }) ui!: T;

  @property({ type: Object }) top!: ZitherUi;

  @property({ type: String }) context!: string;

  @property({ type: String }) label!: string;

  /*
   ** zither-ui css variables
   */
  /* eslint-disable class-methods-use-this */
  componentStyle() {
    return css``;
  }

  componentHeaderRender() {
    return this.context === 'tgroup'
      ? html`<span slot="label" class="label">${this.label}</span>
          <div slot="panel" class="panel"></div>`
      : html`<div class="panel"><span class="label">${this.label}</span></div>`;
  }

  componentFooterRender() {
    return html`</div>`;
  }
  /* eslint-enable class-methods-use-this */

  // should be overridden to supply content
  render() {
    return html`
      <style>
        ${this.componentStyle()}
        <!-- content style here -->
      </style>
      ${this.componentHeaderRender()}
      <!-- content here -->
      ${this.componentFooterRender()}
    `;
  }
}
