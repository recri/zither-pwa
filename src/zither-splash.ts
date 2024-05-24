/* eslint-disable @typescript-eslint/no-unused-vars */
import { LitElement, html, css } from 'lit';
import { property, customElement } from 'lit/decorators.js';

import type { FaustUIDescriptor } from './faustwasm';

import { ZitherApp } from './zither-app.js';

const topUi = [
  {
    type: 'tgroup',
    label: 'zither',
    items: [
      {
        type: 'vgroup',
        label: 'Nonlinear Filter',
        items: [
          {
            type: 'nentry',
            label: 'typeMod',
            shortname: 'typeMod',
            address: '/NLFeks2/Nonlinear_Filter/typeMod',
            index: 262156,
            init: 0,
            min: 0,
            max: 4,
            step: 1,
          },
        ],
      },
      {
        type: 'hslider',
        label: 'Nonlinearity',
        shortname: 'Nonlinearity',
        address: '/NLFeks2/Nonlinearity',
        index: 262164,
        init: 0,
        min: 0,
        max: 1,
        step: 0.01,
      },
      {
        type: 'hslider',
        label: 'brightness',
        shortname: 'brightness',
        address: '/NLFeks2/brightness',
        index: 262192,
        meta: [
          {
            midi: 'ctrl 0x74',
          },
        ],
        init: 0.5,
        min: 0,
        max: 1,
        step: 0.01,
      },
      {
        type: 'hslider',
        label: 'decaytime_T60',
        shortname: 'decaytime_T60',
        address: '/NLFeks2/decaytime_T60',
        index: 262188,
        init: 4,
        min: 0,
        max: 10,
        step: 0.01,
      },
      {
        type: 'nentry',
        label: 'freq',
        shortname: 'freq',
        address: '/NLFeks2/freq',
        index: 262152,
        init: 440,
        min: 20,
        max: 7040,
        step: 1,
      },
      {
        type: 'hslider',
        label: 'freqMod',
        shortname: 'freqMod',
        address: '/NLFeks2/freqMod',
        index: 295064,
        init: 220,
        min: 20,
        max: 1000,
        step: 0.1,
      },
      {
        type: 'nentry',
        label: 'gain',
        shortname: 'gain',
        address: '/NLFeks2/gain',
        index: 262252,
        init: 1,
        min: 0,
        max: 10,
        step: 0.01,
      },
      {
        type: 'button',
        label: 'gate',
        shortname: 'gate',
        address: '/NLFeks2/gate',
        index: 262268,
      },
      {
        type: 'hslider',
        label: 'pick_angle',
        shortname: 'pick_angle',
        address: '/NLFeks2/pick_angle',
        index: 262256,
        init: 0,
        min: 0,
        max: 0.9,
        step: 0.1,
      },
      {
        type: 'hslider',
        label: 'pick_position',
        shortname: 'pick_position',
        address: '/NLFeks2/pick_position',
        index: 295132,
        meta: [
          {
            midi: 'ctrl 0x81',
          },
        ],
        init: 0.13,
        min: 0.02,
        max: 0.98,
        step: 0.01,
      },
    ],
  },
];

@customElement('zither-splash')
export class ZitherSplash extends LitElement {
  static styles = css`
    :host {
      display: block;
      border: none;
      padding: 0px;
      width: 100%;
      height: 100%;
    }
    main {
      background: green no-repeat center / contain url('/assets/icon.svg');
      height: 100%;
      border: 1px solid black;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    button {
      font-size: calc(16px + 2vmin);
    }
  `;

  @property({ type: Object }) app!: ZitherApp;

  @property({ type: Object }) audioContext!: AudioContext;

  handler() {
    this.audioContext.resume();
    this.app.audioState = 'running';
  }

  render() {
    return html`<main>
      <button @click="${this.handler}">Activate</button>
    </main>`;
  }
}
