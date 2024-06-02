/* eslint-disable @typescript-eslint/no-unused-vars */
/*
 ** zither-ui-root
 */
import { LitElement, html, css } from 'lit';
import { property, customElement } from 'lit/decorators.js';

import type {
  FaustUIDescriptor,
  FaustUIGroup,
  FaustUIInputItem,
  FaustUIOutputItem,
  FaustUIItem,
  FaustUIGroupType,
  FaustUIInputType,
  FaustUIOutputType,
  FaustUIType,
  FaustUIMeta,
} from './faust/faustwasm';

import './zither-ui.js';
import { ZitherApp } from './zither-app.js';

const runUi = {
  type: 'vgroup',
  label: 'run',
  items: [
    {
      type: 'button',
      label: 'activate',
      address: '/zlactivate',
      index: 1234,
      url: '',
    },
  ],
} as FaustUIGroup;

const mechUi = {
  type: 'vgroup',
  label: 'mech',
  items: [],
} as FaustUIGroup;

const decorUi = {
  type: 'vgroup',
  label: 'decor',
  items: [],
} as FaustUIGroup;

const perfUi = {
  type: 'vgroup',
  label: 'perf',
  items: [],
} as FaustUIGroup;

const defInstUi = {
  type: 'vgroup',
  label: 'instr',
  items: [],
} as FaustUIGroup;

const defEffUi = {
  type: 'vgroup',
  label: 'effect',
  items: [],
} as FaustUIGroup;

// The zither-app should parse the url for parameter setting
@customElement('zither-ui-root')
export class ZitherUiRoot extends LitElement {
  @property({ type: Object }) app!: ZitherApp;

  @property({ type: Object }) instUi!: FaustUIGroup;

  @property({ type: Object }) effUi!: FaustUIGroup;

  static styles = css`
    :host {
      display: block;
      border: none;
      padding: 0px;
    }
  `;

  constructUi(): FaustUIDescriptor {
    return [
      {
        type: 'tgroup',
        label: 'root',
        items: [runUi, mechUi, decorUi, this.instUi, this.effUi, perfUi],
      },
    ];
  }

  render() {
    console.log(`zither-ui-root render`);
    return html`<zither-ui .ui=${this.constructUi()}></zither-ui>`;
  }
}
