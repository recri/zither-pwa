/* eslint-disable @typescript-eslint/no-unused-vars */
/*
 ** zither-ui renders using faust-ui
 */
import { LitElement, html, css } from 'lit';
import { property, customElement } from 'lit/decorators.js';

import { FaustUI } from '@shren/faust-ui';
import type {
  FaustUIDescriptor,
  FaustUIGroupType,
  FaustUIInputItem,
  FaustUIInputType,
  FaustUIItem,
  FaustUIMeta,
  FaustUIOutputType,
  FaustUIType,
} from './faust/faustwasm';

const mainui: FaustUIDescriptor = [
  {
    type: 'tgroup',
    label: 'root',
    items: [
      { type: 'vgroup', label: 'launch', items: [] },
      { type: 'vgroup', label: 'mechanics', items: [] },
      { type: 'vgroup', label: 'ornaments', items: [] },
      { type: 'vgroup', label: 'instruments', items: [] },
      { type: 'vgroup', label: 'effects', items: [] },
    ],
  },
];
// The zither-app should parse the url for parameter setting
@customElement('zither-ui')
export class ZitherUi extends LitElement {
  @property({ type: Object }) ui!: any;

  static styles = css`
    :host {
      display: block;
      border: none;
      padding: 0px;
    }
  `;

  render() {
    return html`<div class="root"></div>`;
  }
}
