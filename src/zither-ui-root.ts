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

import 'https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.15.1/cdn/shoelace.js';
// import '@shoelace-style/shoelace/cdn/shoelace.js';
// import 'https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.15.1/cdn/components/tab-group/tab-group.js';
// import 'https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.15.1/cdn/components/tab/tab.js';
// import 'https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.15.1/cdn/components/tab-panel/tab-panel.js';
// import 'https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.15.1/cdn/components/button/button.js';

// The zither-app should parse the url for parameter setting
@customElement('zither-ui-root')
export class ZitherUiRoot extends LitElement {
  @property({ type: Object }) app!: ZitherApp;

  @property({ type: Object }) instUi!: FaustUIGroup;

  @property({ type: Object }) effUi!: FaustUIGroup;

  static styles = css`
    @import 'https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.15.1/cdn/themes/light.css';
    :host {
      font: 16px sans-serif;
      background-color: var(--sl-color-neutral-0);
      color: var(--sl-color-neutral-900);
      padding: 1rem;
    }
  `;

  render() {
    console.log(`zither-ui-root render`);
    return html`
      <sl-tab-group>
        <sl-tab slot="nav" panel="run" selected><span>run</span></sl-tab>
        <sl-tab slot="nav" panel="mech"><span>mech</span></sl-tab>
        <sl-tab slot="nav" panel="decor"><span>decor</span></sl-tab>
        <sl-tab slot="nav" panel="inst"><span>inst</span></sl-tab>
        <sl-tab slot="nav" panel="eff"><span>eff</span></sl-tab>
        <sl-tab slot="nav" panel="perf"><span>perf</span></sl-tab>

        <sl-tab-panel name="run">
          This is the run panel.
          <sl-button>run</sl-button>
        </sl-tab-panel>

        <sl-tab-panel name="mech"> This is the mechanics panel. </sl-tab-panel>

        <sl-tab-panel name="decor">
          This is the decorations panel.
        </sl-tab-panel>

        <sl-tab-panel name="inst"> This is the instrument panel. </sl-tab-panel>

        <sl-tab-panel name="eff"> This is the effects panel. </sl-tab-panel>

        <sl-tab-panel name="perf">
          This is the performance panel.
        </sl-tab-panel>
      </sl-tab-group>

      <sl-tab-group>
        <sl-tab slot="nav" panel="general">General</sl-tab>
        <sl-tab slot="nav" panel="custom">Custom</sl-tab>
        <sl-tab slot="nav" panel="advanced">Advanced</sl-tab>
        <sl-tab slot="nav" panel="disabled" disabled>Disabled</sl-tab>

        <sl-tab-panel name="general"
          >This is the general tab panel.</sl-tab-panel
        >
        <sl-tab-panel name="custom">This is the custom tab panel.</sl-tab-panel>
        <sl-tab-panel name="advanced"
          >This is the advanced tab panel.</sl-tab-panel
        >
        <sl-tab-panel name="disabled"
          >This is a disabled tab panel.</sl-tab-panel
        >
      </sl-tab-group>
    `;
  }
}
