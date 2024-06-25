import { LitElement, html, css } from 'lit';
import { property, customElement } from 'lit/decorators.js';

import 'https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.15.1/cdn/components/icon/icon.js';
import 'https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.15.1/cdn/components/button/button.js';
import 'https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.15.1/cdn/components/tooltip/tooltip.js';

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
      text-color: white;
    }
    div.buttons {
      position: absolute;
      bottom: 0;
      right: 0;
    }
    sl-button {
      font-size: calc(10px + 2vmin);
      margin: 5px;
    }
    div.message {
      display: none;
    }
  `;

  @property({ type: Object }) app!: ZitherApp;

  closeHandler() {
    this.app.closeHandler();
  }

  playHandler() {
    this.app.playHandler();
  }

  tuneHandler() {
    this.app.tuneHandler();
  }

  render() {
    return html`<main>
      <div class="message">
        <p>This app is built for touch screen devices.</p>
        <p>It won't be very interesting on a desktop or laptop.</p>
      </div>
      <div class="buttons">
        <sl-tooltip content="exit the app, if possible">
          <sl-button size="small" @click=${this.closeHandler} circle>
            <sl-icon name="x-lg" label="close small instrument"></sl-icon>
          </sl-button>
        </sl-tooltip>
        <sl-tooltip content="go to the settings page">
          <sl-button size="small" @click=${this.tuneHandler} circle>
            <sl-icon name="gear" label="tune instrument"></sl-icon>
          </sl-button>
        </sl-tooltip>
        <sl-tooltip content="go to the fretboard page and play">
          <sl-button size="small"xsgxs @click=${this.playHandler} circle>
            <sl-icon name="music-note-beamed" label="play instrument"></sl-icon>
          </sl-button>
        </sl-tooltip>
      </div>
    </main>`;
  }
}
