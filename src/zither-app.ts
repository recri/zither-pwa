import { LitElement, html, css } from 'lit';
import { property, customElement } from 'lit/decorators.js';

import type { FaustPolyAudioWorkletNode } from './faust/faustwasm/index.js';

import { Constant } from './constant.js';
import './zither-splash.js';
import './zither-ui.js';
import './zither-fretboard.js';
import './zither-faust.js';
import { ZitherLog } from './zither-log.js';
import { playIcon, pauseIcon } from './zither-icons.js';

export type ZitherStateType = 'tune' | 'play' | 'splash';

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

  static getFloatProp = (name: string, defValue: number): number =>
    ZitherApp.hasProp(name)
      ? parseFloat(ZitherApp.getProp(name, '')!)
      : defValue;

  static putFloatProp = (name: string, value: number) =>
    ZitherApp.putProp(name, `${value}`);

  static getBoolProp = (name: string, defValue: boolean): boolean =>
    ZitherApp.hasProp(name)
      ? ZitherApp.getProp(name, `${defValue}`) === 'true'
      : defValue;

  static putBoolProp = (name: string, value: boolean) =>
    ZitherApp.putProp(name, `${value}`);
  /* eslint-enable no-nested-ternary */

  @property() audioContext: AudioContext;

  @property() audioNode: FaustPolyAudioWorkletNode | null = null;

  @property() zitherState: ZitherStateType = 'splash';

  @property() zitherLog!: ZitherLog;

  // begin instrument properties

  @property() tuning: string = ZitherApp.getProp(
    'tuning',
    Constant.defaultTuning,
  );

  @property() frets: number = ZitherApp.getIntProp(
    'frets',
    Constant.defaults.frets,
  );

  @property() transpose: number = ZitherApp.getIntProp(
    'transpose',
    Constant.defaults.transpose,
  );

  @property() tonic: string = ZitherApp.getProp('tonic', Constant.defaultTonic);

  @property() scale: string = ZitherApp.getProp('scale', Constant.defaultScale);

  @property() colors: string = ZitherApp.getProp(
    'colors',
    Constant.defaultColors,
  );

  @property() offscale: string = ZitherApp.getProp(
    'offscale',
    Constant.defaultOffscale,
  );

  @property() labels: string = ZitherApp.getProp(
    'labels',
    Constant.defaultLabels,
  );

  // begin dsp properties
  @property() dspName: string = 'eks2'; // name of dsp module

  @property() velocity: number = ZitherApp.getIntProp(
    'velocity',
    Constant.defaults.velocity,
  );

  @property() poly: number = ZitherApp.getIntProp(
    'poly',
    Constant.defaults.poly,
  );

  @property()
  set pickangle(value) {
    if (this.audioNode)
      this.audioNode.setParamValue('/NLFeks2/pick_angle', value);
  }

  get pickangle() {
    return this.audioNode
      ? this.audioNode.getParamValue('/NLFeks2/pick_angle')
      : ZitherApp.getFloatProp('pickangle', Constant.defaults.pickangle);
  }

  @property()
  set pickposition(value: number) {
    if (this.audioNode)
      this.audioNode.setParamValue('/NLFeks2/pick_position', value);
  }

  get pickposition() {
    return this.audioNode
      ? this.audioNode.getParamValue('/NLFeks2/pick_position')
      : ZitherApp.getFloatProp('pickposition', Constant.defaults.pickposition);
  }

  @property()
  set decaytime(value: number) {
    if (this.audioNode)
      this.audioNode.setParamValue('/NLFeks2/decaytime_T60', value);
  }

  get decaytime() {
    return this.audioNode
      ? this.audioNode.getParamValue('/NLFeks2/decaytime_T60')
      : ZitherApp.getFloatProp('decaytime', Constant.defaults.decaytime);
  }

  @property()
  set brightness(value: number) {
    if (this.audioNode)
      this.audioNode.setParamValue('/NLFeks2/brightness', value);
  }

  get brightness() {
    return this.audioNode
      ? this.audioNode.getParamValue('/NLFeks2/brightness')
      : ZitherApp.getFloatProp('brightness', Constant.defaults.brightness);
  }

  @property()
  set typemod(value: number) {
    if (this.audioNode)
      this.audioNode.setParamValue('/NLFeks2/Nonlinear_Filter/typeMod', value);
  }

  get typemod() {
    return this.audioNode
      ? this.audioNode.getParamValue('/NLFeks2/Nonlinear_Filter/typeMod')
      : ZitherApp.getFloatProp('typemod', Constant.defaults.typemod);
  }

  @property()
  set nonlinearity(value: number) {
    if (this.audioNode)
      this.audioNode.setParamValue('/NLFeks2/Nonlinearity', value);
  }

  get nonlinearity() {
    return this.audioNode
      ? this.audioNode.getParamValue('/NLFeks2/Nonlinearity')
      : ZitherApp.getFloatProp('nonlinearity', Constant.defaults.nonlinearity);
  }

  @property()
  set freqmod(value: number) {
    if (this.audioNode) this.audioNode.setParamValue('/NLFeks2/freqMod', value);
  }

  get freqmod() {
    return this.audioNode
      ? this.audioNode.getParamValue('/NLFeks2/freqMod')
      : ZitherApp.getFloatProp('freqmod', Constant.defaults.freqmod);
  }

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
    return html`
      <style>
        :host {
          width: ${this.width}px;
          height: ${this.height}px;
        }
        zither-splash,
        zither-fretboard,
        zither-faust {
          position: absolute;
          top: 0;
          left: 0;
          width: ${this.width}px;
          height: ${this.height}px;
        }
        zither-faust {
          z-index: 0;
        }
        zither-fretboard {
          display: block;
          z-index: 1;
        }
        zither-ui {
          position: absolute;
          bottom: 0;
          right: 0;
          width: 70%;
          height: 80%;
          display: 'block';
          z-index: ${this.zitherState === 'tune' ? 2 : 0};
        }
        zither-splash {
          z-index: ${this.zitherState === 'splash' ? 3 : 0};
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
      <zither-splash 
	.app=${this}
      ></zither-splash>
      <zither-faust
        .app=${this}
        .audioContext=${this.audioContext}
        .dspName=${this.dspName}
        .poly=${this.poly}
      >
      </zither-faust>
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
      <zither-log .app=${this}></zither-log>
      <zither-ui
        .app=${this}
        .poly=${this.poly}
        .velocity=${this.velocity}
        .tuning=${this.tuning}
        .frets=${this.frets}
        .transpose=${this.transpose}
        .tonic=${this.tonic}
        .scale=${this.scale}
        .offscale=${this.offscale}
        .labels=${this.labels}
        .colors=${this.colors}
        .pickangle=${this.pickangle}
        .pickposition=${this.pickposition}
        .decaytime=${this.decaytime}
        .brightness=${this.brightness}
        .typemod=${this.typemod}
        .nonlinearity=${this.nonlinearity}
        .freqmod=${this.freqmod}
      ></zither-ui>
    `;
  }
}
