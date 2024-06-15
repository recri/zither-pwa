import { LitElement, html, css } from 'lit';
import { property, customElement } from 'lit/decorators.js';

import 'https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.15.1/cdn/components/icon/icon.js';
import 'https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.15.1/cdn/components/button/button.js';

import { ZitherApp } from './zither-app.js';

@customElement('zither-splash')
export class ZitherSplash extends LitElement {
  static styles = css`
    :host {
      display: block;
      border: none;
      padding: 0px;
      width: 100%;
      height: 100%;
    }
    main {
      background: green no-repeat center / contain url('/assets/icon.svg');
      height: 100%;
      border: 1px solid black;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    sl-button {
      font-size: calc(16px + 2vmin);
      margin: 20px;
    }
  `;

  @property({ type: Object }) app!: ZitherApp;

  render() {
    return html`<main>
      <sl-button @click=${this.app.closeHandler} size="large" circle>
        <sl-icon name="x-lg" label="close instrument"></sl-icon>
      </sl-button>
      <sl-button @click=${this.app.tuneHandler} size="large" circle>
        <sl-icon name="gear" label="tune instrument"></sl-icon>
      </sl-button>
      <sl-button @click=${this.app.playHandler} size="large" circle>
        <sl-icon name="music-note-beamed" label="play instrument"></sl-icon>
      </sl-button>
    </main>`;
  }
}
