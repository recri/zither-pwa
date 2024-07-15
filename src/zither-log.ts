import { LitElement, html, css } from 'lit';
import { property, customElement } from 'lit/decorators.js';

import { ZitherApp } from './zither-app.js';

@customElement('zither-log')
export class ZitherLog extends LitElement {
  @property() app!: ZitherApp;

  @property() messages: Array<string> = [];

  @property() nmessages: number = 0;

  static styles = css`
    :host {
      display: block;
      border: none;
      padding: 0px;
      width: 100%;
      height: 100%;
      overflow-y: auto;
    }
  `;

  /* eslint-disable wc/guard-super-call */
  connectedCallback() {
    super.connectedCallback();
    this.app.zitherLog = this;
  }
  /* eslint-enable wc/guard-super-call */

  log(msg: string) {
    this.messages.push(`${msg}\n`);
    this.nmessages = this.messages.length;
  }

  clear() {
    this.messages = [];
    this.nmessages = this.messages.length;
  }

  render() {
    return html`
      ${this.nmessages} messages
      <button @click=${this.clear}>Clear Log</button>
      <pre id="log" style="border: 1px solid #ccc;">
${this.messages.map(a => html`${a}`)}
      </pre
      >
    `;
  }
}
