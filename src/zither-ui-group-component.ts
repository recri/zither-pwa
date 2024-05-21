/* eslint-disable @typescript-eslint/no-unused-vars */

import { html } from 'lit';

import type { FaustUIGroup, FaustUIItem, FaustUIMeta } from '@grame/faustwasm';

import { ZitherUiComponent } from './zither-ui-component.js';

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
