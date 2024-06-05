import { css, html } from 'lit';
import { customElement } from 'lit/decorators.js';

import type { FaustUIGroup } from './faust/faustwasm';

import { ZitherUiComponent } from './ZitherUiComponent.js';

@customElement('zither-ui-hgroup')
export class ZitherUiHgroup extends ZitherUiComponent<FaustUIGroup> {
  static styles = css`
    :host {
      display: block;
      padding: 25px;
      color: var(--zither-ui-text-color, #fff);
      background: var(--zither-ui-background-color, #000);
    }

    main {
      display: block flex;
      flex-direction: row;
    }
  `;

  render() {
    console.log(`zither-ui-hgroup render`);
    return html`
      <style>
        ${this.componentStyle()}
      </style>
      ${this.componentHeaderRender()}
      <main>
        <slot name="panel">
          <p>No content for hgroup ${this.label}</p>
        </slot>
      </main>
      ${this.componentFooterRender()}
    `;
  }
}
