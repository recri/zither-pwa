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

  @property({ type: Number }) width!: number;

  @property({ type: Number }) height!: number;

  @property({ type: Number }) inset: number = 1;

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
  }

  /* eslint-disable @typescript-eslint/no-unused-vars */
  move_handler(ev: TouchEvent) {
    ev.preventDefault();
    const node = this.fretboard.app.audioNode;
  }
  /* eslint-enable @typescript-eslint/no-unused-vars */

  end_handler(ev: TouchEvent) {
    ev.preventDefault();
    this.fretboard.app.audioNode!.keyOff(1, this.note, 0);
  }

  render() {
    const w = this.width;
    const h = this.height;
    const i = this.inset;

    const style = html`
      <style>
        svg {
          width: ${w}px;
          height: ${h}px;
          /*  padding: 3px; */
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
        <svg viewbox="0 0 ${w} ${h}"></svg>
      `;

    if (!this.isinscale && this.offscale === 'hide')
      return html`
        ${style}
        <svg
          viewbox="0 0 ${w} ${h}"
          @touchstart=${this.start_handler}
          @touchmove=${this.move_handler}
          @touchend=${this.end_handler}
        ></svg>
      `;

    return html` ${style}
      <svg
        viewbox="0 0 ${w} ${h}"
        @touchstart=${this.start_handler}
        @touchmove=${this.move_handler}
        @touchend=${this.end_handler}
      >
        <path
          d="M ${i},${h / 2} Q ${i},${h - i} ${w / 2},${h - i} ${w - i},${h -
          i} ${w - i},${h / 2} ${w - i},${i} ${w / 2},${i} ${i},${i} ${i},${h /
          2} Z"
        ></path>
        <text x="${w / 2}" y="${h / 2}">${this.text}</text>
      </svg>`;
  }
}
