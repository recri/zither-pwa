import { LitElement, html, css } from 'lit';
import { property, customElement } from 'lit/decorators.js';

import { playIcon, pauseIcon } from './zither-icons.js';
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
    button {
      font-size: calc(16px + 2vmin);
    }
  `;

  @property({ type: Object }) app!: ZitherApp;

  playHandler() {
    this.app.audioContext.resume();
    this.app.zitherState = 'play';
  }

  tuneHandler() {
    this.app.audioContext.resume();
    this.app.zitherState = 'tune';
  }

  render() {
    return html`<main>
      <button @click="${this.playHandler}">${playIcon}Play</button>
      <button @click="${this.tuneHandler}">${pauseIcon}Tune</button>
    </main>`;
  }
}
