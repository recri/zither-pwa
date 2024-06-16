import { LitElement, html, css } from 'lit';
import { property, customElement } from 'lit/decorators.js';

// import { Constant } from 'constant.js';

import { Fretboard } from './zither-fretboard.js';

@customElement('zither-fretmute')
export class Fretmute extends LitElement {
  @property({ type: Object }) fretboard!: Fretboard;

  @property({ type: String }) backgroundColor: string = '#000000';

  @property({ type: String }) strokeColor: string = '#ffffff';

  @property({ type: Number }) strokeWidth: number = 1.0;

  @property({ type: String }) fillColor: string = '#000000';

  static styles = css`
    :host {
      background-color: var(--zither-app-background-color);
      overflow: clip;
      overflow-clip-margin: content-box 0px;
    }
  `;

  start_handler(ev: TouchEvent) {
    ev.preventDefault();
    this.fretboard.app.audioNode!.allNotesOff(false);
  }

  /* eslint-disable class-methods-use-this */
  move_handler(ev: TouchEvent) {
    ev.preventDefault();
  }

  end_handler(ev: TouchEvent) {
    ev.preventDefault();
  }
  /* eslint-enable class-methods-use-this */

  render() {
    const style = html`
      <style>
        svg {
          width: 100%;
          height: 100%;
        }
        path {
          fill: ${this.fillColor};
          stroke: ${this.strokeColor};
          stroke-width: ${this.strokeWidth};
        }
      </style>
    `;

    return html` ${style}
      <svg
        viewbox="0 0 100 100"
        preserveAspectRatio="none"
        @touchstart=${this.start_handler}
        @touchmove=${this.move_handler}
        @touchend=${this.end_handler}
      >
        <path
          d="M 5,25 Q 5,50 5,75 5,95 25,95 50,95 75,95 95,95 95,75 95,50 95,25 95,5 75,5 50,5 25,5 5,5 5,25 Z"
        ></path>
      </svg>`;
  }
}
