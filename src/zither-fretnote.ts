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

  @property({ type: Number }) string!: number;

  @property({ type: Number }) fret!: number;

  @property({ type: Boolean }) isinscale!: boolean;

  @property({ type: String }) offscale!: string;

  @property({ type: String }) backgroundColor: string = '#000000';

  @property({ type: String }) strokeColor: string = '#ffffff';

  @property({ type: Number }) strokeWidth: number = 1.0;

  @property({ type: String }) fillColor: string = '#000000';

  @property({ type: String }) textColor: string = '#ffffff';

  @property({ type: String }) text!: string;

  @property({ type: Number }) width!: number;

  @property({ type: Number }) height!: number;

  @property({ type: Number }) inset: number = 3;

  static styles = css`
    :host {
      background-color: var(--zither-app-background-color);
      overflow: clip;
      overflow-clip-margin: content-box 0px;
    }
  `;

  start_handler(ev: TouchEvent) {
    ev.preventDefault();
    const node = this.fretboard.app.audioNode;
    // console.log(`fretnote start ${node}`);
    if (node) node.keyOn(1, this.note, this.velocity);
  }

  /* eslint-disable @typescript-eslint/no-unused-vars */
  move_handler(ev: TouchEvent) {
    ev.preventDefault();
    const node = this.fretboard.app.audioNode;
  }
  /* eslint-enable @typescript-eslint/no-unused-vars */

  end_handler(ev: TouchEvent) {
    ev.preventDefault();
    const node = this.fretboard.app.audioNode;
    // console.log(`fretnote end ${node}`);
    if (node) node.keyOff(1, this.note, 0);
  }

  render() {
    const w = this.width;
    const h = this.height;
    const i = this.inset;
    const hide = !this.isinscale && this.offscale === 'hide';
    const mute = !this.isinscale && this.offscale === 'mute';
    /* eslint-disable no-nested-ternary */
    return mute
      ? html` <svg viewbox="0 0 ${w} ${h}" width="${w}" height="${h}"></svg>`
      : hide
        ? html` <svg
            viewbox="0 0 ${w} ${h}"
            width="${w}"
            height="${h}"
            @touchstart=${this.start_handler}
            @touchmove=${this.move_handler}
            @touchend=${this.end_handler}
          ></svg>`
        : html` <style>
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
                font: bold ${h * 0.5}px sans-serif;
              }
            </style>
            <svg
              viewbox="0 0 ${w} ${h}"
              width="${w}"
              height="${h}"
              @touchstart=${this.start_handler}
              @touchmove=${this.move_handler}
              @touchend=${this.end_handler}
            >
              <path
                d="M ${i},${h / 2} Q ${i},${h - i} ${w / 2},${h - i} ${w -
                i},${h - i} ${w - i},${h / 2} ${w - i},${i} ${w /
                2},${i} ${i},${i} ${i},${h / 2} Z"
              ></path>
              <text x="${w / 2}" y="${h / 2}">${this.text}</text>
            </svg>`;
    /* eslint-enable no-nested-ternary */
  }
}
