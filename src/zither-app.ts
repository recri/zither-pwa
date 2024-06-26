import { LitElement, html, css } from 'lit';
import { property, customElement } from 'lit/decorators.js';

import type { FaustPolyAudioWorkletNode, FaustDspMeta } from './faustwasm';
import { Constant } from './constant.js';
import { expandTuning } from './tuning.js';

import './zither-splash.js';
import './zither-fretboard.js';
import './zither-faust.js';
import { ZitherLog } from './zither-log.js';

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

  @property({ type: String }) audioState: string;

  @property({ type: Object }) audioNode: FaustPolyAudioWorkletNode | null =
    null;

  @property({ type: Object }) dspMeta: FaustDspMeta | null = null;

  @property({ type: Number }) courses: number = ZitherApp.getIntProp(
    'courses',
    parseInt(Constant.defaults.courses, 10)
  );

  @property({ type: Number }) strings: number = ZitherApp.getIntProp(
    'strings',
    parseInt(Constant.defaults.strings, 10)
  );

  @property({ type: Number }) frets: number = ZitherApp.getIntProp(
    'frets',
    parseInt(Constant.defaults.frets, 10)
  );

  @property({ type: Number }) nut: number = ZitherApp.getIntProp(
    'nut',
    parseInt(Constant.defaults.nut, 10)
  );

  @property({ type: String }) tuningName: string = ZitherApp.getProp(
    'tuning',
    Constant.defaults.tuningName
  );

  @property({ type: String }) keyName: string = ZitherApp.getProp(
    'key',
    Constant.defaults.keyName
  );

  @property({ type: String }) modeName: string = ZitherApp.getProp(
    'mode',
    Constant.defaults.modeName
  );

  @property({ type: String }) paletteName: string = ZitherApp.getProp(
    'palette',
    Constant.defaults.paletteName
  );

  @property({ type: String }) dspName: string = ZitherApp.getProp(
    'dsp',
    Constant.defaults.dspName
  );

  @property({ type: Number }) width: number = 200;

  @property({ type: Number }) height: number = 200;

  static styles = css`
    :host {
      display: block;
      border: none;
      padding: 0px;
    }
  `;

  constructor() {
    super();

    /** @type {typeof AudioContext} */
    const AudioCtx = window.AudioContext; // || window.webkitAudioContext;

    const audioContext = new AudioCtx({ latencyHint: 0.00001 }); // , echoCancellation: false, autoGainControl: false, noiseSuppression: false
    audioContext.destination.channelInterpretation = 'discrete';
    audioContext.suspend();
    this.audioContext = audioContext;
    this.audioState = this.audioContext.state;
  }

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

  log(msg: string) {
    this.zitherLog.log(msg);
  }

  render() {
    return html`
      <style>
        :host {
          width: ${this.width}px;
          height: ${this.height}px;
        }
        zither-splash {
          position: absolute;
          top: 0px;
          left: 0px;
          width: ${this.width}px;
          height: ${this.height}px;
          z-index: 2;
        }
        zither-fretboard {
          position: absolute;
          top: 0px;
          left: 0px;
          width: ${this.width}px;
          height: ${this.height}px;
          z-index: 1;
        }
        zither-faust {
          position: absolute;
          top: 0px;
          left: 0px;
          width: ${this.width}px;
          height: ${this.height}px;
          z-index: 0;
        }
      </style>

      ${this.audioState === 'suspended'
        ? html`<zither-splash
            .app=${this}
            .audioContext=${this.audioContext}
          ></zither-splash>`
        : html``}
      ${this.audioState !== 'running'
        ? html``
        : html`<zither-fretboard
            .app=${this}
            .audioContext=${this.audioContext}
            .courses=${this.courses}
            .strings=${this.strings}
            .frets=${this.frets}
            .nut=${this.nut}
            .tuning=${expandTuning(this.courses, this.strings, this.tuningName)}
            .key=${Constant.key.keys[this.keyName]}
            .mode=${Constant.modes[this.modeName]}
            .palette=${Constant.palettes[this.paletteName]}
            .width=${this.width}
            .height=${this.height}
          ></zither-fretboard>`}

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
