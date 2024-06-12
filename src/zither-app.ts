import { LitElement, html, css } from 'lit';
import { property, customElement } from 'lit/decorators.js';

import { Constant } from './constant.js';

import type {
  FaustPolyAudioWorkletNode,
  FaustUIDescriptor,
  FaustUIGroup,
} from './faust/faustwasm/index.js';

import './zither-ui.js';
import './zither-fretboard.js';
import './zither-faust.js';
import { ZitherLog } from './zither-log.js';

export type ZitherStateType = 'tune' | 'play';

const pauseIcon = html` <svg
  aria-hidden="true"
  xmlns="http://www.w3.org/2000/svg"
  height="64"
  viewBox="0 -960 960 960"
  width="64"
>
  <path d="M560-200v-560h160v560H560Zm-320 0v-560h160v560H240Z" />
</svg>`;

const playIcon = html` <svg
  aria-hidden="true"
  xmlns="http://www.w3.org/2000/svg"
  height="64"
  viewBox="0 -960 960 960"
  width="64"
>
  <path d="M320-200v-560l440 280-440 280Z" />
</svg>`;

// The zither-app should parse the url for parameter setting
@customElement('zither-app')
export class ZitherApp extends LitElement {
  /* eslint-disable no-nested-ternary */
  static urlSearchParams: URLSearchParams = new URL(window.location.href)
    .searchParams;

  static hasProp = (name: string): boolean =>
    ZitherApp.urlSearchParams.has(name) ||
    window.localStorage.getItem(name) !== null;

  // modify this to store new property values to window.localStorage
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

  @property({ type: Object }) audioContext: AudioContext;

  @property({ type: Object }) audioNode: FaustPolyAudioWorkletNode | null =
    null;

  @property({ type: String }) zitherState: ZitherStateType = 'tune';

  @property({ type: Object }) dspUi: FaustUIDescriptor | null = null;

  @property({ type: Object }) zitherLog!: ZitherLog;

  // begin instrument properties

  @property({ type: String }) tuning: string = ZitherApp.getProp(
    'tuning',
    Constant.defaultTuning,
  );

  @property({ type: Number }) frets: number = ZitherApp.getIntProp(
    'frets',
    Constant.defaults.frets,
  );

  @property({ type: Number }) transpose: number = ZitherApp.getIntProp(
    'transpose',
    Constant.defaults.transpose,
  );

  @property({ type: String }) tonic: string = ZitherApp.getProp(
    'tonic',
    Constant.defaultTonic,
  );

  @property({ type: String }) scale: string = ZitherApp.getProp(
    'scale',
    Constant.defaultScale,
  );

  @property({ type: String }) colors: string = ZitherApp.getProp(
    'colors',
    Constant.defaultColors,
  );

  @property({ type: String }) offscale: string = ZitherApp.getProp(
    'offscale',
    Constant.defaultOffscale,
  );

  @property({ type: String }) labels: string = ZitherApp.getProp(
    'labels',
    Constant.defaultLabels,
  );

  // begin dsp properties
  @property({ type: String }) dspName: string = 'eks2'; // name of dsp module

  @property({ type: Number }) velocity: number = 114; // velocity of midi notes

  // window properties

  @property({ type: Number }) width: number = 200;

  @property({ type: Number }) height: number = 200;

  static styles = css`
    :host {
      background-color: var(--zither-app-background-color);
      border: none;
      padding: 0px;
      margin: none;
    }
  `;

  constructor() {
    super();
    // window.localStorage.clear();
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

    /* eslint-disable @typescript-eslint/no-unused-vars */
    const { instUi, effUi } = parseRawUi();
    /* eslint-enable @typescript-eslint/no-unused-vars */

    return html`
      <style>
        :host {
          width: ${this.width}px;
          height: ${this.height}px;
        }
        zither-fretboard,
        zither-faust {
          position: absolute;
          top: 0;
          left: 0;
          width: ${this.width}px;
          height: ${this.height}px;
        }
        zither-fretboard {
          display: ${this.zitherState === 'play' ? 'block' : 'none'};
          z-index: ${this.zitherState === 'play' ? 2 : 0};
        }
        zither-ui {
          position: absolute;
          bottom: 0;
          right: 0;
          width: 60%;
          height: 80%;
          display: ${this.zitherState === 'tune' ? 'block' : 'none'};
          z-index: ${this.zitherState === 'tune' ? 2 : 0};
        }
        zither-faust {
          z-index: 0;
        }
        button {
          position: absolute;
          bottom: 0;
          right: 0;
          z-index: 3;
        }
      </style>
      <button @click="${this.handler}">
        ${this.zitherState === 'play' ? pauseIcon : playIcon}
      </button>
      <zither-ui .app=${this} .audioNode=${this.audioNode}></zither-ui>
      <zither-fretboard
        .app=${this}
        .velocity=${this.velocity}
        .tuning=${this.tuning}
        .frets=${this.frets}
        .transpose=${this.transpose}
        .tonic=${this.tonic}
        .scale=${this.scale}
        .offscale=${this.offscale}
        .labels=${this.labels}
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
