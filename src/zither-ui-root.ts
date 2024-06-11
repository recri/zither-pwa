/* eslint-disable @typescript-eslint/no-unused-vars */
/*
 ** zither-ui-root
 */
import { LitElement, html, css } from 'lit';
import { property, customElement } from 'lit/decorators.js';

import type { FaustPolyAudioWorkletNode } from './faust/faustwasm/index.js';

import { ZitherApp } from './zither-app.js';

// figure out how to cherry pick from node_modules
import 'https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.15.1/cdn/components/select/select.js';
import 'https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.15.1/cdn/components/option/option.js';
import 'https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.15.1/cdn/components/range/range.js';

// The zither-app should parse the url for parameter setting
@customElement('zither-ui-root')
export class ZitherUiRoot extends LitElement {
  @property({ type: Object }) app!: ZitherApp;

  @property({ type: Object }) audioNode!: FaustPolyAudioWorkletNode;

  static styles = css`
    :host {
      background-color: #dddddd;
      border: none;
      padding: 0px;
      margin: none;
    }
  `;

  get pickangle() {
    return this.audioNode
      ? this.audioNode.getParamValue('/NLFeks2/pick_angle')
      : 0;
  }

  set pickangle(value) {
    if (this.audioNode)
      this.audioNode.setParamValue('/NLFeks2/pick_angle', value);
  }

  get pickposition() {
    return this.audioNode
      ? this.audioNode.getParamValue('/NLFeks2/pick_position')
      : 0;
  }

  set pickposition(value: number) {
    if (this.audioNode)
      this.audioNode.setParamValue('/NLFeks2/pick_position', value);
  }

  get decaytime() {
    return this.audioNode
      ? this.audioNode.getParamValue('/NLFeks2/decaytime_T60')
      : 0;
  }

  set decaytime(value: number) {
    if (this.audioNode)
      this.audioNode.setParamValue('/NLFeks2/decaytime_T60', value);
  }

  get brightness() {
    return this.audioNode
      ? this.audioNode.getParamValue('/NLFeks2/brightness')
      : 0;
  }

  set brightness(value: number) {
    if (this.audioNode)
      this.audioNode.setParamValue('/NLFeks2/brightness', value);
  }

  get typemod() {
    return this.audioNode
      ? this.audioNode.getParamValue('/NLFeks2/Nonlinear_Filter/typeMod')
      : 0;
  }

  set typemod(value: number) {
    if (this.audioNode)
      this.audioNode.setParamValue('/NLFeks2/Nonlinear_Filter/typeMod', value);
  }

  get nonlinearity() {
    return this.audioNode
      ? this.audioNode.getParamValue('/NLFeks2/Nonlinearity')
      : 0;
  }

  set nonlinearity(value: number) {
    if (this.audioNode)
      this.audioNode.setParamValue('/NLFeks2/Nonlinearity', value);
  }

  get freqmod() {
    return this.audioNode
      ? this.audioNode.getParamValue('/NLFeks2/freqMod')
      : 0;
  }

  set freqmod(value: number) {
    if (this.audioNode) this.audioNode.setParamValue('/NLFeks2/freqMod', value);
  }

  slChangeEventString(e: Event) {
    if (e.target) {
      const { label, value } = e.target as unknown as {
        label: string;
        value: string;
      };
      switch (label) {
        case 'tuning':
          this.app.tuning = value;
          break;
        case 'fretting':
          this.app.fretting = value;
          break;
        case 'colors':
          this.app.colors = value;
          break;
        case 'labels':
          this.app.labels = value;
          break;
        case 'tonic':
          this.app.tonic = value;
          break;
        case 'scale':
          this.app.scale = value;
          break;
        case 'offscale':
          this.app.offscale = value;
          break;
        default:
          console.log(
            `no string change event value handler for ${label} = ${value}`,
          );
          break;
      }
    }
  }

  slChangeEventNumber(e: Event) {
    if (e.target) {
      const { label, value } = e.target as unknown as {
        label: string;
        value: number;
      };
      switch (label) {
        case 'frets':
          this.app.frets = value;
          break;
        case 'transpose':
          this.app.transpose = value;
          break;
        case 'velocity':
          this.app.velocity = value;
          break;

        case 'pickangle':
          this.pickangle = value;
          break;
        case 'pickposition':
          this.pickposition = value;
          break;
        case 'decaytime':
          this.decaytime = value;
          break;
        case 'brightness':
          this.brightness = value;
          break;
        case 'typemod':
          this.typemod = value;
          break;
        case 'nonlinearity':
          this.nonlinearity = value;
          break;
        case 'freqmod':
          this.freqmod = value;
          break;
        default:
          console.log(
            `no numeric change event value handler for ${label} = ${value}`,
          );
          break;
      }
    }
  }

  render() {
    const slOption = (value: string, text: string) =>
      html`<sl-option value="${value}">${text}</sl-option>`;
    return html`
      <div>
        <sl-select
          size="small"
          label="tuning"
          value="${this.app.tuning}"
          @sl-change=${this.slChangeEventString}
        >
          ${slOption('C3,G3,B3,D4', 'banjo 4 plectrum')}
          ${slOption('D3,G3,B3,E4', 'banjo 4 chicago')}
          ${slOption('C3,G3,D4,A4', 'banjo 4 tenor')}
          <!-- 5 string banjo is tricky because the 5th string starts at the 5th fret -->
          ${slOption('EADG', 'bass 4')} ${slOption('BEADG', 'bass 5 low')}
          ${slOption('EADGC', 'bass 5 high')}
          <!-- cello needs fretless -->
          <!-- dulcimer needs special fretting -->
          ${slOption('EADGBE', 'guitar 6')}
          ${slOption('EADGCF', 'guitar 6 all fourths')}
          ${slOption('E2,G2,B2,E3,G3,B3,E4', 'guitar 7 all thirds')}
          ${slOption(
            'B3,C4,D4,E4,F4,G4,A4,B4,C5,D5,E5,F5,G5,A5,B5,C6,D6,E6,F6,G6,A6,B6,C7',
            'harp 23',
          )}
          ${slOption(
            'G2,A2,B2,C3,D3,E3,F3,G3,A3,B3,C4,D4,E4,F4,G4,A4,B4,C5,D5,E5,F5,G5,A5,B5,C6,D6,E6,F6,G6,A6',
            'harp 30',
          )}
          ${slOption(
            'G2,A2,B2,C3,D3,E3,F3,G3,A3,B3,C4,D4,E4,F4,G4,A4,B4,C5,D5,E5,F5,G5,A5,B5,C6,D6,E6,F6,G6,A6,B6,C7',
            'harp 32',
          )}
          ${slOption(
            'C2,D2,E2,F2,G2,A2,B2,C3,D3,E3,F3,G3,A3,B3,C4,D4,E4,F4,G4,A4,B4,C5,D5,E5,F5,G5,A5,B5,C6,D6,E6,F6,G6,A6,B6,C7',
            'harp 36',
          )}
          ${slOption('D4,E4,G4,A4,B4,D5,E5', '7 string lyre')}
          ${slOption(
            'G3,A3,B3,C4,D4,E4,F4,G4,A4,B4,C5,D5,E5,F5,G5,A5',
            'lyre 16',
          )}
          ${slOption('GDAE', 'mandolin')}
          ${slOption('B3,E3,A2,D2,G1,C1', 'stick 6 bass')}
          ${slOption('B1,E2,A2,D3,G3,C4', 'stick 6 guitar')}
          ${slOption('A2,D2,G1,C1,F♯2,B2,E3,A3', 'stick 8 classic')}
          ${slOption('E3,A2,D2,G1,C1,F♯2,B2,E3,A3,D4', 'stick 10 classic')}
          ${slOption(
            'B3,E3,A2,D2,G1,C1,C♯2,F♯2,B2,E3,A3,D4',
            'stick 12 classic',
          )}
          ${slOption('G4,C4,E4,A4', 'ukulele')}
          <!-- viola needs fretless -->
          <!-- violin needs fretless -->
          ${slOption(
            'G4,A4,B4,C5,D5,E5,F♯5,G5,A5,B5,C6,D6,E6,F♯6,G6',
            'folk zither 15 in G',
          )}
          ${slOption(
            'B3,C4,D4,E4,F♯4,G4,A4,B4,C5,D5,E5,F♯5,G5,A5,B5,C6,D6,E6,F♯6,G6',
            'folk zither 20 in G',
          )}
          ${slOption(
            'B3,C♯4,D4,E4,F4,G4,A4,B4,C♯5,D5,E5,F5,G5,A5,B5,C♯6,D6,E6,F6,G6',
            'folk zither 20 in D',
          )}
          ${slOption(
            'B3,C4,D4,E4,F4,G4,A4,B4,C5,D5,E5,F5,G5,A5,B5,C6,D6,E6,F6,G6',
            'folk zither 20 in C',
          )}
          <!-- concert and alpine zithers are more complicated -->
        </sl-select>
        <sl-select
          size="small"
          label="fretting"
          value="${this.app.fretting}"
          @sl-change=${this.slChangeEventString}
        >
          <sl-option value="f">fretted string</sl-option>
          <sl-option value="o">open string</sl-option>
          <sl-option value="u">unfretted string</sl-option>
        </sl-select>
        <sl-select
          size="small"
          label="colors"
          value="${this.app.colors}"
          @sl-change=${this.slChangeEventString}
        >
          ${[
            'bamO',
            'brocO',
            'corkO',
            'romaO',
            'vikO',
            'blue',
            'green',
            'magenta',
            'gray1',
            'gray',
            'fire',
            'none',
          ].map(
            color => html`<sl-option value="${color}">${color}</sl-option>`,
          )}
        </sl-select>
        <sl-select
          size="small"
          label="tonic"
          value="${this.app.tonic}"
          @sl-change=${this.slChangeEventString}
        >
          ${[
            'G♭',
            'D♭',
            'A♭',
            'E♭',
            'B♭',
            'F',
            'C',
            'G',
            'D',
            'A',
            'E',
            'B',
            'F♯',
            'C♯',
          ].map(
            tonic => html`<sl-option value="${tonic}">${tonic}</sl-option>`,
          )}
        </sl-select>
        <sl-select
          size="small"
          label="scale"
          value="${this.app.scale}"
          @sl-change=${this.slChangeEventString}
        >
          ${[
            'ionian',
            'dorian',
            'phrygian',
            'lydian',
            'mixolydian',
            'aeolian',
            'locrian',
            'major',
            'naturalminor',
            'harmonicminor',
            'jazzminor',
            'major5note',
            'bluesmajor5note',
            'suspended5note',
            'minor5note',
            'bluesminor5note',
            'bluesminor6note',
            'bluesmajor6note',
            'blues7note',
            'harmonicmajor',
            'blues9note',
            'chromatic',
          ].map(
            scale => html`<sl-option value="${scale}">${scale}</sl-option>`,
          )}
        </sl-select>
        <sl-select
          size="small"
          label="offscale"
          value="${this.app.offscale}"
          @sl-change=${this.slChangeEventString}
        >
          <sl-option value="show">show</sl-option>
          <sl-option value="hide">hide</sl-option>
          <sl-option value="mute">mute</sl-option>
          <sl-option value="cover">cover</sl-option>
        </sl-select>
        <sl-select
          size="small"
          label="labels"
          value="${this.app.labels}"
          @sl-change=${this.slChangeEventString}
        >
          <sl-option value="none">none</sl-option>
          <sl-option value="note">note</sl-option>
          <sl-option value="solfege">solfege</sl-option>
        </sl-select>
        <sl-range
          label="frets"
          value="${this.app.frets}"
          min="0"
          max="37"
          @sl-change=${this.slChangeEventNumber}
        ></sl-range>
        <sl-range
          label="transpose"
          value="${this.app.transpose}"
          min="-24"
          max="24"
          @sl-change=${this.slChangeEventNumber}
        ></sl-range>

        <sl-range
          label="velocity"
          value="${this.app.velocity}"
          min="0"
          max="127"
          step="1"
          @sl-change=${this.slChangeEventNumber}
        ></sl-range>

        <sl-range
          label="pickangle"
          value="${this.pickangle}"
          min="0.0"
          max="0.9"
          step="0.1"
          @sl-change=${this.slChangeEventNumber}
        ></sl-range>
        <sl-range
          label="pickposition"
          value="${this.pickposition}"
          min="0.02"
          max="0.98"
          step="0.01"
          @sl-change=${this.slChangeEventNumber}
        ></sl-range>
        <sl-range
          label="decaytime"
          value="${this.decaytime}"
          min="0.0"
          max="10.0"
          step="0.01"
          @sl-change=${this.slChangeEventNumber}
        ></sl-range>
        <sl-range
          label="brightness"
          value="${this.brightness}"
          min="0.0"
          max="1.0"
          step="0.01"
          @sl-change=${this.slChangeEventNumber}
        ></sl-range>

        <sl-range
          label="typemod"
          value="${this.typemod}"
          min="0"
          max="4"
          step="1"
          @sl-change=${this.slChangeEventNumber}
        ></sl-range>
        <sl-range
          label="nonlinearity"
          value="${this.nonlinearity}"
          min="0"
          max="1.0"
          step="0.01"
          @sl-change=${this.slChangeEventNumber}
        ></sl-range>
        <sl-range
          label="freqmod"
          value="${this.freqmod}"
          min="20"
          max="1000"
          step="0.1"
          @sl-change=${this.slChangeEventNumber}
        ></sl-range>
      </div>
    `;
  }
}
