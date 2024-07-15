import { LitElement, html, css } from 'lit';
import { property, customElement } from 'lit/decorators.js';

// import { Constant } from 'constant.js';

import { Fretboard } from './zither-fretboard.js';

@customElement('zither-fretnote')
export class Fretnote extends LitElement {
  @property({ type: Object }) fretboard!: Fretboard;

  @property({ type: Number }) freq!: number;

  @property({ type: Number }) note!: number;

  @property({ type: Number }) velocity!: number;

  @property({ type: Boolean }) isinscale!: boolean;

  @property({ type: String }) offscale!: string;

  @property({ type: String }) backgroundColor: string = '#000000';

  @property({ type: String }) strokeColor: string = '#ffffff';

  @property({ type: Number }) strokeWidth: number = 1.0;

  @property({ type: String }) fillColor: string = '#000000';

  @property({ type: String }) textColor: string = '#ffffff';

  @property({ type: Number }) fontSize: number = 12;

  @property({ type: String }) text!: string;

  static styles = css`
    :host {
      background-color: var(--zither-app-background-color);
      overflow: clip;
      overflow-clip-margin: content-box 0px;
    }
  `;

  start_handler(ev: TouchEvent) {
    ev.preventDefault();
    this.fretboard.app.audioNode!.keyOn(1, this.note, this.velocity);
    this.fretboard.markKeyTime();
    this.fretboard.touchLog('s', ev);
  }

  /* eslint-disable @typescript-eslint/no-unused-vars */
  move_handler(ev: TouchEvent) {
    ev.preventDefault();
    const node = this.fretboard.app.audioNode;
    this.fretboard.markKeyTime();
    this.fretboard.touchLog('m', ev);
  }
  /* eslint-enable @typescript-eslint/no-unused-vars */

  end_handler(ev: TouchEvent) {
    ev.preventDefault();
    this.fretboard.app.audioNode!.keyOff(1, this.note, 0);
    this.fretboard.markKeyTime();
    this.fretboard.touchLog('e', ev);
  }

  mousedown_handler(ev: MouseEvent) {
    ev.preventDefault();
    this.fretboard.app.audioNode!.keyOn(1, this.note, this.velocity);
    this.fretboard.markKeyTime();
    this.fretboard.markMouseTime();
    // console.log(`mousedown`);
  }

  /* eslint-disable @typescript-eslint/no-unused-vars */
  mousemove_handler(ev: MouseEvent) {
    ev.preventDefault();
    const node = this.fretboard.app.audioNode;
    this.fretboard.markKeyTime();
    this.fretboard.markMouseTime();
    // console.log(`mousemove`);
  }
  /* eslint-enable @typescript-eslint/no-unused-vars */

  mouseup_handler(ev: MouseEvent) {
    ev.preventDefault();
    this.fretboard.app.audioNode!.keyOff(1, this.note, 0);
    this.fretboard.markKeyTime();
    this.fretboard.markMouseTime();
    // console.log(`mouseup`);
  }

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
        text {
          text-anchor: middle;
          alignment-baseline: middle;
          stroke: none;
          fill: ${this.textColor};
          font: bold ${this.fontSize}px sans-serif;
        }
      </style>
    `;

    if (!this.isinscale && this.offscale === 'cover') return html``;

    if (!this.isinscale && this.offscale === 'mute')
      return html`
        ${style}
        <svg viewbox="0 0 100 100" preserveAspectRatio="none"></svg>
      `;

    if (!this.isinscale && this.offscale === 'hide')
      return html`
        ${style}
        <svg
          viewbox="0 0 100 100"
          preserveAspectRatio="none"
          @touchstart=${this.start_handler}
          @touchmove=${this.move_handler}
          @touchend=${this.end_handler}
          @mousedown=${this.mousedown_handler}
          @mousemove=${this.mousemove_handler}
          @mouseup=${this.mouseup_handler}
        ></svg>
      `;

    return html` ${style}
      <svg
        viewbox="0 0 100 100"
        preserveAspectRatio="none"
        @touchstart=${this.start_handler}
        @touchmove=${this.move_handler}
        @touchend=${this.end_handler}
        @mousedown=${this.mousedown_handler}
        @mousemove=${this.mousemove_handler}
        @mouseup=${this.mouseup_handler}
      >
        <path
          d="M 5,25 Q 5,50 5,75 5,95 25,95 50,95 75,95 95,95 95,75 95,50 95,25 95,5 75,5 50,5 25,5 5,5 5,25 Z"
        ></path>
        <text x="50" y="50">${this.text}</text>
      </svg>`;
  }
}
/*
  square        d="M 5,25 Q 5,50 5,75 5,95 25,95 50,95 75,95 95,95 95,75 95,50 95,25 95,5 75,5 50,5 25,5 5,5 5,25 Z"
  round         d="M 5,50 Q 5,95 50,95 95,95 95,50 95,5 50,5 5,5 5,50 Z"
*/
