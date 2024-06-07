import { LitElement, html, css } from 'lit';
import { property, customElement } from 'lit/decorators.js';

import { Constant } from './constant.js';
import { expandTuning } from './tuning.js';

import type {
  FaustPolyAudioWorkletNode,
  FaustUIDescriptor,
  FaustUIGroup,
} from './faust/faustwasm/index.js';

import './zither-ui-root.js';
import './zither-fretboard.js';
import './zither-faust.js';
import { ZitherLog } from './zither-log.js';

export type ZitherStateType = 'tune' | 'play';

// The zither-app should parse the url for parameter setting
@customElement('zither-app')
export class ZitherApp extends LitElement {
  /* eslint-disable no-nested-ternary */
  static urlSearchParams: URLSearchParams = new URL(window.location.href)
    .searchParams;

  static hasProp = (name: string): boolean =>
    ZitherApp.urlSearchParams.has(name) ||
    window.localStorage.getItem(name) !== null;

  static getProp = (name: string, defValue: string): string =>
    ZitherApp.urlSearchParams.has(name)
      ? ZitherApp.urlSearchParams.get(name)!
      : window.localStorage.getItem(name) !== null
      ? window.localStorage.getItem(name)!
      : defValue;

  static putProp = (name: string, value: string) =>
    window.localStorage.setItem(name, value);

  static getIntProp = (name: string, defValue: number): number =>
    ZitherApp.hasProp(name)
      ? parseInt(ZitherApp.getProp(name, '')!, 10)
      : defValue;

  static putIntProp = (name: string, value: number) =>
    ZitherApp.putProp(name, `${value}`);

  static getBoolProp = (name: string, defValue: boolean): boolean =>
    ZitherApp.hasProp(name)
      ? ZitherApp.getProp(name, `${defValue}`) === 'true'
      : defValue;

  static putBoolProp = (name: string, value: boolean) =>
    ZitherApp.putProp(name, `${value}`);
  /* eslint-enable no-nested-ternary */

  @property({ type: Object }) zitherLog!: ZitherLog;

  @property({ type: Object }) audioContext: AudioContext;

  @property({ type: Object }) audioNode: FaustPolyAudioWorkletNode | null =
    null;

  @property({ type: String }) zitherState: ZitherStateType = 'tune';

  @property({ type: Object }) dspUi: FaustUIDescriptor | null = null;

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

  @property({ type: String }) dspName: string = 'eks2';

  @property({ type: Object }) hostWindow!: Window;

  static styles = css``;

  constructor() {
    super();

    /** @type {typeof AudioContext} */
    const AudioCtx = window.AudioContext; // || window.webkitAudioContext;

    const audioContext = new AudioCtx({ latencyHint: 0.00001 }); // , echoCancellation: false, autoGainControl: false, noiseSuppression: false
    audioContext.destination.channelInterpretation = 'discrete';
    audioContext.suspend();
    this.audioContext = audioContext;
  }

  handleResize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
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

  log(msg: string) {
    this.zitherLog.log(msg);
  }

  handler() {
    if (this.audioContext.state !== 'running') {
      this.audioContext.resume();
    }
    if (this.zitherState === 'play') {
      this.zitherState = 'tune';
    } else {
      this.zitherState = 'play';
    }
  }

  render() {
    const parseRawUi = () =>
      this.dspUi &&
      this.dspUi[0] &&
      this.dspUi[0].type === 'tgroup' &&
      this.dspUi[0].items &&
      this.dspUi[0].items.length === 2
        ? {
            instUi: this.dspUi[0].items[0] as FaustUIGroup,
            effUi: this.dspUi[0].items[1] as FaustUIGroup,
          }
        : {
            instUi: {
              type: 'vgroup',
              label: 'inst',
              items: [],
            } as FaustUIGroup,
            effUi: { type: 'vgroup', label: 'eff', items: [] } as FaustUIGroup,
          };

    const { instUi, effUi } = parseRawUi();

    return html`
      <style>
        :host {
          width: ${this.width}px;
          height: ${this.height}px;
        }
        zither-fretboard,
        zither-ui-root,
        zither-faust {
          position: absolute;
          top: 0px;
          left: 0px;
          width: ${this.width}px;
          height: ${this.height}px;
        }
        zither-fretboard {
          display: ${this.zitherState === 'play' ? 'block' : 'none'};
          z-index: ${this.zitherState === 'play' ? 2 : 0};
        }
        zither-ui-root {
          display: ${this.zitherState === 'tune' ? 'block' : 'none'};
          z-index: ${this.zitherState === 'tune' ? 2 : 0};
        }
        zither-faust {
          z-index: 0;
        }
        button {
          position: absolute;
          top: ${this.height - 100}px;
          left: 0px;
          font-size: calc(16px + 2vmin);
          z-index: 3;
        }
      </style>
      <button @click="${this.handler}">
        ${this.zitherState === 'play' ? 'tune' : 'play'}
      </button>
      <zither-ui-root .app=${this} .instUi=${instUi} .effUi=${effUi}>
      </zither-ui-root>
      <zither-fretboard
        .app=${this}
        .audioContext=${this.audioContext}
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
      ></zither-fretboard>
      <zither-faust
        .app=${this}
        .audioContext=${this.audioContext}
        .dspName=${this.dspName}
      >
      </zither-faust>
      <zither-log .app=${this}></zither-log>
    `;
  }
}
