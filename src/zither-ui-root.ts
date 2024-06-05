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

import { constructUi } from './ZitherUiConstruct.js';
import { renderType } from './ZitherUiRender.js';
import { ZitherApp } from './zither-app.js';

import './zither-ui.js';
import './zither-ui-button.js';
import './zither-ui-checkbox.js';
import './zither-ui-hbargraph.js';
import './zither-ui-hgroup.js';
import './zither-ui-hslider.js';
import './zither-ui-knob.js';
import './zither-ui-led.js';
import './zither-ui-menu.js';
import './zither-ui-nentry.js';
import './zither-ui-numerical.js';
import './zither-ui-radio.js';
import './zither-ui-soundfile.js';
import './zither-ui-tgroup.js';
import './zither-ui-vbargraph.js';
import './zither-ui-vgroup.js';
import './zither-ui-vslider.js';

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

  render() {
    console.log(`zither-ui-root render`);
    return html`
      <zither-ui-tgroup .top=${this} .label="root" .context="">
        <zither-ui-vgroup .top=${this} .label="run" .context="tgroup">
          <zither-ui-button .top=${this} .label="play" .context="vgroup">
          </zither-ui-button>
        </zither-ui-vgroup>
        <zither-ui-vgroup .top=${this} .label="mech" .context="tgroup">
        </zither-ui-vgroup>
        <zither-ui-vgroup .top=${this} .label="mech" .context="tgroup">
        </zither-ui-vgroup>
        <zither-ui-vgroup .top=${this} .label="decor" .context="tgroup">
        </zither-ui-vgroup>
        ${renderType(this.instUi, 'tgroup', this)}
        ${renderType(this.effUi, 'tgroup', this)}
        <zither-ui-vgroup .top=${this} .label="perf" .context="tgroup">
        </zither-ui-vgroup>
      </zither-ui-tgroup>
    `;
  }
}
