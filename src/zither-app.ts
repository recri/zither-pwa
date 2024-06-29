import { LitElement, html, css } from 'lit';
import { property, customElement } from 'lit/decorators.js';

import type { FaustPolyAudioWorkletNode } from './faust/faustwasm/index.js';

import {
    putProp, getProp, putIntProp, getIntProp,
    putBoolProp, getBoolProp, putFloatProp, getFloatProp,
    observeUrl, resetProps, exportProps
} from './props.js';

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
   ** properties
   * */

  @property() audioContext: AudioContext;

  @property() audioNode: FaustPolyAudioWorkletNode | null = null;

  @property() zitherState: ZitherStateType = 'splash';

  @property() zitherLog!: ZitherLog;

  // begin instrument properties

  /* eslint-disable class-methods-use-this */
  @property()
  set tuning(value) { putProp('tuning', value); }

  get tuning() { return getProp('tuning'); }

  @property()
  set frets(value) { putIntProp('frets', value); }

  get frets() { return getIntProp('frets'); }

  @property()
  set transpose(value) { putIntProp('transpose', value); }

  get transpose() { return getIntProp('transpose'); }

  @property()
  set tonic(value) { putProp('tonic', value); }

  get tonic() { return getProp('tonic'); }

  @property()
  set scale(value) { putProp('scale', value); }

  get scale() { return getProp('scale'); }

  @property()
  set colors(value) { putProp('colors', value); }

  get colors() { return getProp('colors'); }

  @property()
  set offscale(value) { putProp('offscale', value); }

  get offscale() { return getProp('offscale'); }

  @property()
  set labels(value) { putProp('labels', value); }

  get labels() { return getProp('labels'); }

  // begin dsp properties
  @property()
  set dspName(value) { putProp('dspName', value); }

  get dspName() { return getProp('dspName'); }

  @property()
  set poly(value) { putIntProp('poly', value); }

  get poly() { return getIntProp('poly'); }

  @property()
  set velocity(value) { putIntProp('velocity', value); }

  get velocity() { return getIntProp('velocity'); }

  // begin dsp dsp propertiies

  @property()
  set dynamiclevel(value) {
    putFloatProp('dynamiclevel', value);
    this.audioNode?.setParamValue('/EKS/Excitation/dynamic_level', value);
  }

  get dynamiclevel() { return getFloatProp('dynamiclevel'); }

  @property()
  set pickangle(value) {
    putFloatProp('pickangle', value);
    this.audioNode?.setParamValue('/EKS/Excitation/pick_angle', value);
  }

  get pickangle() { return getFloatProp('pickangle'); }

  @property()
  set pickposition(value: number) {
    putFloatProp('pickposition', value);
    this.audioNode?.setParamValue('/EKS/Excitation/pick_position', value);
  }

  get pickposition() { return getFloatProp('pickposition'); }

  @property()
  set decaytime(value: number) {
    putFloatProp('decaytime', value);
    this.audioNode?.setParamValue('/EKS/String/t60', value);
  }

  get decaytime() { return getFloatProp('decaytime'); }

  @property()
  set brightness(value: number) {
    putFloatProp('brightness', value);
    this.audioNode?.setParamValue('/EKS/String/brightness', value);
  }

  get brightness() { return getFloatProp('brightness'); }
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
    observeUrl(Constant.defaultValues)
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
    navigator.clipboard.writeText(exportProps(true));
  }

  resetHandler() {
    resetProps();
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
      <zither-ui
        .app=${this}
        .dspNames=${Constant.dspNames}
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
      <zither-log .app=${this}></zither-log>
    `;
  }
}
