/* eslint-ignore @typescript-eslint/no-unused-vars */
/* @typescript-eslint-ignore no-unused-vars */

import { LitElement, html, css } from 'lit';
import { property, customElement } from 'lit/decorators.js';

import { Task } from '@lit/task';

import { ZitherApp } from './zither-app.js';

import './zither-ui.js';

/**
 * @typedef {import("./faust/types").FaustDspDistribution} FaustDspDistribution
 * @typedef {import("./faust/faustwasm").FaustAudioWorkletNode} FaustAudioWorkletNode
 * @typedef {import("./faust/faustwasm").FaustDspMeta} FaustDspMeta
 */

// Import necessary Faust modules and data
// import { FaustMonoDspGenerator, FaustPolyDspGenerator } from "./faustwasm/index.js";
import { FaustPolyDspGenerator } from './faust/faustwasm/index.js';
// import type { FaustDspMeta, FaustPolyAudioWorkletNode } from './faust/faustwasm/index.js';

/**
 * Creates a Faust audio node for use in the Web Audio API.
 *
 * Specialized to polyphonic to simplify code.
 *
 * @param {AudioContext} audioContext - The Web Audio API AudioContext to which the Faust audio node will be connected.
 * @param {string} dspName - The name of the DSP to be loaded.
 * @param {number} voices - The number of voices to be used for polyphonic DSPs.
 * @returns {Array<Any>} - An object containing the Faust audio node and the DSP metadata.
 */
const createFaustNode = async (
  audioContext: AudioContext,
  dspName = 'template',
  voices = 16
) => {
  // Load DSP metadata from JSON
  /** @type {FaustDspMeta} */
  const { origin } = window.location;
  // console.log(`createFaustNode origin ${origin}`);
  const dspMeta = await (
    await fetch(`${origin}/assets/faust/${dspName}.json`)
  ).json();
  // console.log(`createFaustNode dspMeta ${dspMeta}`)

  // Compile the DSP module from WebAssembly binary data
  const dspModule = await WebAssembly.compileStreaming(
    await fetch(`${origin}/assets/faust/${dspName}.wasm`)
  );
  // console.log(`createFaustNode dspModule ${dspModule}`)

  // Try to load not so optional mixer and effect modules
  const mixerModule = await WebAssembly.compileStreaming(
    await fetch(`${origin}/assets/faust/mixerModule.wasm`)
  );
  // console.log(`createFaustNode mixerModule ${mixerModule}`)
  const effectMeta = await (
    await fetch(`${origin}/assets/faust/${dspName}_effect.json`)
  ).json();
  // console.log(`createFaustNode effectMeta ${effectMeta}`)
  const effectModule = await WebAssembly.compileStreaming(
    await fetch(`${origin}/assets/faust/${dspName}_effect.wasm`)
  );
  // console.log(`createFaustNode effectModule ${effectModule}`)

  // Just doing poly for now
  const generator = new FaustPolyDspGenerator();

  /** @type {FaustAudioWorkletNode} */
  const faustNode = await generator.createNode(
    audioContext,
    voices,
    'FaustPolyDSP',
    { module: dspModule, json: JSON.stringify(dspMeta) },
    mixerModule,
    effectModule
      ? { module: effectModule, json: JSON.stringify(effectMeta) }
      : undefined
  );

  if (!faustNode) throw new Error('faustNode is null');

  // Connect Faust node to audio context
  faustNode.connect(audioContext.destination);

  // Return an object with the Faust audio node and the DSP metadata
  return { faustNode, dspMeta };
};

// The zither-app should parse the url for parameter setting
@customElement('zither-faust')
export class ZitherFaust extends LitElement {
  @property({ type: Object }) app!: ZitherApp;

  @property({ type: Object }) audioContext!: AudioContext;

  @property({ type: String }) dspName!: string;

  static styles = css`
    :host {
      display: block;
      border: none;
      padding: 0px;
    }
  `;

  private _faustTask = new Task(this, {
    task: async () => {
      // Create Faust node
      // console.log(`createFaustNode(${this.audioContext}, ${this.dspName}, 16)`);
      const { faustNode, dspMeta } = await createFaustNode(
        this.audioContext,
        this.dspName,
        16
      );

      this.app.audioNode = faustNode;
      this.app.dspMeta = dspMeta;

      // return the node and meta data
      return { faustNode, dspMeta };
    },
    args: () => [],
  });

  render() {
    return this._faustTask.render({
      pending: () => html`<p>Loading node...</p>`,
      complete: ({ dspMeta }) =>
        html`<zither-ui .ui="${dspMeta.ui}"></zither-ui>`,
      error: e => html`<p>Error: ${e}</p>`,
    });
  }
}
