import { css } from 'lit';
import { customElement } from 'lit/decorators.js';

import { ZitherUiGroupComponent } from './ZitherUiGroupComponent.js';

@customElement('zither-ui-hgroup')
export class ZitherUiHgroup extends ZitherUiGroupComponent {
  static styles = css`
    :host {
      display: block;
      padding: 25px;
      color: var(--zither-ui-text-color, #000);
    }

    div {
      display: block flex;
      flex-direction: row;
    }
  `;
}
