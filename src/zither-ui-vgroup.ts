import { css, html } from 'lit';
import { customElement } from 'lit/decorators.js';

import type { FaustUIGroup } from './faust/faustwasm';

import { ZitherUiComponent } from './ZitherUiComponent.js';

@customElement('zither-ui-vgroup')
export class ZitherUiVgroup extends ZitherUiComponent<FaustUIGroup> {
  static styles = css`
    :host {
      display: block;
      padding: 25px;
      color: var(--zither-ui-text-color, #fff);
      background: var(--zither-ui-background-color, #000);
    }

    main {
      display: block flex;
      flex-direction: column;
    }
  `;

  render() {
    console.log(`zither-ui-vgroup render`);
    return html`
      <style>
        ${this.componentStyle()}
      </style>
      ${this.componentHeaderRender()}
      <main>
        <slot name="panel">
          <p>No content for vgroup ${this.label}</p>
        </slot>
      </main>
      ${this.componentFooterRender()}
    `;
  }
}
