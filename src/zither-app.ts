import { LitElement, html, css } from 'lit';
import { property, customElement } from 'lit/decorators.js';

import type { FaustPolyAudioWorkletNode } from './faust/faustwasm/index.js';

import { Constant } from './constant.js';
import './zither-splash.js';
import './zither-ui.js';
import './zither-fretboard.js';
import './zither-faust.js';
import { ZitherLog } from './zither-log.js';

export type ZitherStateType = 'tune' | 'play' | 'splash';

// The zither-app should parse the url for parameter setting
@customElement('zither-app')
export class ZitherApp extends LitElement {
  /**
   ** Code to implement parameters from url
   ** and from local storage.
   */

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

  /**
   ** properties
   * */

  @property() audioContext: AudioContext;

  @property() audioNode: FaustPolyAudioWorkletNode | null = null;

  @property() zitherState: ZitherStateType = 'splash';

  @property() zitherLog!: ZitherLog;

  // begin instrument properties

  /* eslint-disable class-methods-use-this */
  @property()
  set tuning(value) {
    ZitherApp.putProp('tuning', value);
  }

  get tuning() {
    return ZitherApp.getProp('tuning', Constant.sdef.tuning);
  }

  @property()
  set frets(value) {
    ZitherApp.putIntProp('frets', value);
  }

  get frets() {
    return ZitherApp.getIntProp('frets', Constant.ndef.frets);
  }

  @property()
  set transpose(value) {
    ZitherApp.putIntProp('transpose', value);
  }

  get transpose() {
    return ZitherApp.getIntProp('transpose', Constant.ndef.transpose);
  }

  @property()
  set tonic(value) {
    ZitherApp.putProp('tonic', value);
  }

  get tonic() {
    return ZitherApp.getProp('tonic', Constant.sdef.tonic);
  }

  @property()
  set scale(value) {
    ZitherApp.putProp('scale', value);
  }

  get scale() {
    return ZitherApp.getProp('scale', Constant.sdef.scale);
  }

  @property()
  set colors(value) {
    ZitherApp.putProp('colors', value);
  }

  get colors() {
    return ZitherApp.getProp('colors', Constant.sdef.colors);
  }

  @property()
  set offscale(value) {
    ZitherApp.putProp('offscale', value);
  }

  get offscale() {
    return ZitherApp.getProp('offscale', Constant.sdef.offscale);
  }

  @property()
  set labels(value) {
    ZitherApp.putProp('labels', value);
  }

  get labels() {
    return ZitherApp.getProp('labels', Constant.sdef.labels);
  }

  // begin dsp properties
  @property()
  set dspName(value) {
    ZitherApp.putProp('dspName', value);
  }

  get dspName() {
    return ZitherApp.getProp('dspName', Constant.sdef.dspName);
  }

  @property()
  set poly(value) {
    ZitherApp.putIntProp('poly', value);
  }

  get poly() {
    return ZitherApp.getIntProp('poly', Constant.ndef.poly);
  }

  @property()
  set velocity(value) {
    ZitherApp.putIntProp('velocity', value);
  }

  get velocity() {
    return ZitherApp.getIntProp('velocity', Constant.ndef.velocity);
  }

  // begin dsp dsp propertiies

  @property()
  set dynamiclevel(value) {
    ZitherApp.putFloatProp('dynamiclevel', value);
    if (this.audioNode)
      this.audioNode.setParamValue('/EKS/Excitation/dynamic_level', value);
  }

  get dynamiclevel() {
    return ZitherApp.getFloatProp('dynamiclevel', Constant.ndef.dynamiclevel);
  }

  @property()
  set pickangle(value) {
    ZitherApp.putFloatProp('pickangle', value);
    if (this.audioNode)
      this.audioNode.setParamValue('/EKS/Excitation/pick_angle', value);
  }

  get pickangle() {
    return ZitherApp.getFloatProp('pickangle', Constant.ndef.pickangle);
  }

  @property()
  set pickposition(value: number) {
    ZitherApp.putFloatProp('pickposition', value);
    if (this.audioNode)
      this.audioNode.setParamValue('/EKS/Excitation/pick_position', value);
  }

  get pickposition() {
    return ZitherApp.getFloatProp('pickposition', Constant.ndef.pickposition);
  }

  @property()
  set decaytime(value: number) {
    ZitherApp.putFloatProp('decaytime', value);
    if (this.audioNode) this.audioNode.setParamValue('/EKS/String/t60', value);
  }

  get decaytime() {
    return ZitherApp.getFloatProp('decaytime', Constant.ndef.decaytime);
  }

  @property()
  set brightness(value: number) {
    ZitherApp.putFloatProp('brightness', value);
    if (this.audioNode)
      this.audioNode.setParamValue('/EKS/String/brightness', value);
  }

  get brightness() {
    return ZitherApp.getFloatProp('brightness', Constant.ndef.brightness);
  }
  /* eslint-enable class-methods-use-this */

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
    /** @type {typeof AudioContext} */
    const AudioCtx = window.AudioContext; // || window.webkitAudioContext;
    const audioContext = new AudioCtx({ latencyHint: 0.00001 }); // , echoCancellation: false, autoGainControl: false, noiseSuppression: false
    audioContext.suspend();
    audioContext.destination.channelInterpretation = 'discrete';
    this.audioContext = audioContext;
  }

  handleResize() {
    // console.log(`handleResize ${this.width} x ${this.height} becomes ${window.innerWidth} x ${window.innerHeight}`);
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

  playHandler() {
    this.audioContext.resume();
    this.zitherState = 'play';
    if (!document.fullscreenElement) {
      // console.log(`requesting fullscreen`);
      this.requestFullscreen();
    }
  }

  tuneHandler() {
    this.audioContext.resume();
    this.zitherState = 'tune';
    if (document.fullscreenElement) {
      // console.log(`relinquishing fullscreen`);
      document.exitFullscreen();
    }
  }

  /* eslint-disable class-methods-use-this */
  exportHandler() {
    const items = [
      `tuning=${this.tuning}`,
      `frets=${this.frets}`,
      `transpose=${this.transpose}`,
      `tonic=${this.tonic}`,
      `scale=${this.scale}`,
      `colors=${this.colors}`,
      `offscale=${this.offscale}`,
      `labels=${this.labels}`,
      `dspName=${this.dspName}`,
      `poly=${this.poly}`,
      `velocity=${this.velocity}`,
      `dynamiclevel=${this.dynamiclevel}`,
      `pickangle=${this.pickangle}`,
      `pickposition=${this.pickposition}`,
      `decaytime=${this.decaytime}`,
      `brightness=${this.brightness}`,
    ].join('&');
    const location = `${window.location.protocol}//${window.location.host}/?${items}`;
    // console.log(`exportHandler ${location}`);
    navigator.clipboard.writeText(location);
  }

  resetHandler() {
    window.localStorage.clear();
    window.location.assign(
      `${window.location.protocol}//${window.location.host}/`,
    );
  }
  /* eslint-enable class-methods-use-this */

  closeHandler() {
    if (this.zitherState === 'splash') window.close();
    else this.zitherState = 'splash';
  }

  render() {
    return html`
      <style>
        :host {
          width: 100%;
          height: 100%;
        }
        zither-splash,
        zither-fretboard,
        zither-faust {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
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
      </style>
      <zither-splash .app=${this}></zither-splash>
      <zither-faust
        .app=${this}
        .audioContext=${this.audioContext}
        .dspName=${this.dspName}
        .poly=${this.poly}
      >
      </zither-faust>
      <zither-fretboard
        id="myfretboard"
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
	.dspNames=${Constant.adef.dspNames}
        .dspName=${this.dspName}
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
        .dynamiclevel=${this.dynamiclevel}
      ></zither-ui>
    `;
  }
}
