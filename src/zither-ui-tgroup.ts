/*
 ** an explanation of a tabbed pane here
 ** https://medium.com/@blueyorange/make-a-tabs-web-component-in-litelement-using-slots-and-css-293c55dbd155
 */

import { html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

import type { FaustUIGroup } from './faust/faustwasm';

import { ZitherUiComponent } from './ZitherUiComponent.js';

@customElement('zither-ui-tgroup')
export class ZitherUiTgroup extends ZitherUiComponent<FaustUIGroup> {
  static styles = css`
    :host {
      display: block;
      padding: 25px;
      color: var(--zither-ui-text-color, #fff);
      background: var(--zither-ui-background-color, #000);
    }
    nav {
      display: flex;
    }
    nav > ::slotted([slot='tab']) {
      padding: 1rem 2rem;
      flex: 1 1 auto;
      color: lightgrey;
      border-bottom: 2px solid lightgrey;
      text-align: center;
    }
    nav > ::slotted([slot='tab'][selected]) {
      border-color: black;
    }
    ::slotted([slot='panel']) {
      display: none;
    }
    ::slotted([slot='panel'][selected]) {
      display: block;
    }
  `;

  _tabs: Array<Element> = [];

  _panels: Array<Element> = [];

  /* eslint-disable wc/guard-super-call */
  connectedCallback() {
    super.connectedCallback();
    this._tabs = Array.from(this.querySelectorAll('[slot=tab]'));
    this._panels = Array.from(this.querySelectorAll('[slot=panel]'));
    this.selectTab(0);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._tabs = [];
    this._panels = [];
  }
  /* eslint-enable wc/guard-super-call */

  selectTab(tabIndex: number) {
    this._tabs.forEach(tab => tab.removeAttribute('selected'));
    this._tabs[tabIndex].setAttribute('selected', '');
    this._panels.forEach(panel => panel.removeAttribute('selected'));
    this._panels[tabIndex].setAttribute('selected', '');
  }

  handleSelect(e: Event) {
    const index = this._tabs.indexOf(e.target as Element);
    this.selectTab(index);
  }

  /* eslint-disable lit-a11y/click-events-have-key-events */
  render() {
    console.log(`zither-ui-tgroup render`);
    return html`
      <style>
        ${this.componentStyle()}
      </style>
      ${this.componentHeaderRender()}
      <nav>
        <slot name="label" @click=${(e: Event) => this.handleSelect(e)}>
          <p>No content for tgroup ${this.label} label slot</p>
        </slot>
      </nav>
      <main>
        <slot name="panel">
          <p>No content for tgroup ${this.label} panel slot</p>
        </slot>
      </main>
      ${this.componentFooterRender()}
    `;
  }
}
