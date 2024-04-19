import { LitElement, html, css } from 'lit';
import { property, customElement } from 'lit/decorators.js';

import { Constant } from './constant.js';
import { expandTuning } from './tuning.js';
import './fretboard.js';

//
// The zither-app should parse the url for parameter setting
@customElement('zither-app')
export class ZitherApp extends LitElement {
  static hasProp = (name: string): boolean =>
    window.localStorage.getItem(name) !== null;

  static getProp = (name: string, defValue: string): string =>
    ZitherApp.hasProp(name) ? window.localStorage.getItem(name)! : defValue;

  static putProp = (name: string, value: string) =>
    window.localStorage.setItem(name, value);

  static getIntProp = (name: string, defValue: number): number =>
    ZitherApp.hasProp(name)
      ? parseInt(window.localStorage.getItem(name)!, 10)
      : defValue;

  static putIntProp = (name: string, value: number) =>
    window.localStorage.setItem(name, `${value}`);

  static getBoolProp = (name: string, defValue: boolean): boolean =>
    ZitherApp.hasProp(name)
      ? window.localStorage.getItem(name) === 'true'
      : defValue;

  static putBoolProp = (name: string, value: boolean) =>
    window.localStorage.setItem(name, `${value}`);

  @property({ type: Number }) courses: number = Constant.defaults.courses;

  @property({ type: Number }) strings: number = Constant.defaults.strings;

  @property({ type: Number }) frets: number = Constant.defaults.frets;

  @property({ type: Number }) nut: number = Constant.defaults.nut;

  @property({ type: String }) tuningName: string = Constant.defaultTuningName;

  @property({ type: String }) keyName: string = Constant.defaultKeyName;

  @property({ type: String }) modeName: string = Constant.defaultModeName;

  @property({ type: Array }) colors: Array<string> = Constant.defaultColors;

  @property({ type: Number }) width: number = 200;

  @property({ type: Number }) height: number = 200;

  static styles = css`
    :host {
      display: block;
      border: none;
      padding: 0px;
    }
  `;

  handleResize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    // console.log(`handleResize ${this.width} x ${this.height}`);
  }

  resizeHandler = () => this.handleResize();

  /* eslint-disable wc/guard-super-call */
  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('resize', this.resizeHandler);
    this.handleResize();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('resize', this.resizeHandler);
  }
  /* eslint-enable wc/guard-super-call */

  // Log events flag
  logEvents = false;

  start_handler(ev: TouchEvent) {
    // If the user makes simultaneous touches, the browser will fire a
    // separate touchstart event for each touch point. Thus if there are
    // three simultaneous touches, the first touchstart event will have
    // targetTouches length of one, the second event will have a length
    // of two, and so on.
    ev.preventDefault();
    if (this.logEvents) console.log('TouchStart');
  }

  move_handler(ev: TouchEvent) {
    // Note: if the user makes more than one "simultaneous" touches, most browsers
    // fire at least one touchmove event and some will fire several touchmoves.
    // Consequently, an application might want to "ignore" some touchmoves.
    //
    // This function sets the target element's border to "dashed" to visually
    // indicate the target received a move event.
    //
    ev.preventDefault();
    if (this.logEvents) console.log(`touchMove ${ev}`);
  }

  end_handler(ev: TouchEvent) {
    ev.preventDefault();
    if (this.logEvents) console.log(`${ev.type} ${ev}`);
  }

  render() {
    return html`
      <style>
        :host {
          width: ${this.width}px;
          height: ${this.height}px;
        }
        zither-fretboard {
          width: ${this.width}px;
          height: ${this.height}px;
        }
      </style>
      <zither-fretboard
        .courses=${this.courses}
        .strings=${this.strings}
        .frets=${this.frets}
        .nut=${this.nut}
        .tuning=${expandTuning(this.courses, this.strings, this.tuningName)}
        .key=${Constant.key.keys[this.keyName]}
        .mode=${Constant.modes[this.modeName]}
        .colors=${this.colors}
        .width=${this.width}
        .height=${this.height}
      >
      </zither-fretboard>
    `;
  }
}
