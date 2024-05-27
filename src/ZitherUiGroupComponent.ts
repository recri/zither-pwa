import { html } from 'lit';

import type { FaustUIGroup } from './faust/faustwasm';

import { ZitherUiComponent } from './ZitherUiComponent.js';

export class ZitherUiGroupComponent extends ZitherUiComponent<FaustUIGroup> {
  render = () =>
    html`
      <style>
        ${this.componentStyle()}
      </style>
      ${this.componentHeaderRender()}
      <div><slot></slot></div>
      ${this.componentFooterRender()}
    `;
}
