/* eslint-disable @typescript-eslint/no-unused-vars */
/*
 ** zither-ui
 */
import { LitElement, html, css } from 'lit';
import { property, customElement } from 'lit/decorators.js';

import { ZitherApp } from './zither-app.js';

// figure out how to cherry pick from node_modules
import 'https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.15.1/cdn/components/icon/icon.js';
import 'https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.15.1/cdn/components/button/button.js';
import 'https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.15.1/cdn/components/tab/tab.js';
import 'https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.15.1/cdn/components/tab-group/tab-group.js';
import 'https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.15.1/cdn/components/tab-panel/tab-panel.js';
import 'https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.15.1/cdn/components/select/select.js';
import 'https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.15.1/cdn/components/option/option.js';
import 'https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.15.1/cdn/components/range/range.js';

// The zither-app should parse the url for parameter setting
@customElement('zither-ui')
export class ZitherUi extends LitElement {
  @property() app!: ZitherApp;

  @property() velocity!: number;

  @property() tuning!: string;

  @property() frets!: number;

  @property() transpose!: number;

  @property() tonic!: string;

  @property() scale!: string;

  @property() offscale!: string;

  @property() labels!: string;

  @property() colors!: string;

  @property() pickangle!: number;

  @property() pickposition!: number;

  @property() decaytime!: number;

  @property() brightness!: number;

  @property() typemod!: number;

  @property() nonlinearity!: number;

  @property() freqmod!: number;

  static styles = css`
    :host {
      background-color: #dddddd;
      border: none;
      padding: 0px;
      margin: none;
    }
    .label {
      font-size: calc(10px + 2vmin);
    }
    sl-tab-panel {
      padding: 5px;
    }
    div.buttons {
      position: absolute;
      bottom: 0;
      right: 0;
    }
    sl-button {
      font-size: calc(16px + 2vmin);
      margin: 20px;
    }
  `;

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
          this.app.pickangle = value;
          break;
        case 'pickposition':
          this.app.pickposition = value;
          break;
        case 'decaytime':
          this.app.decaytime = value;
          break;
        case 'brightness':
          this.app.brightness = value;
          break;
        case 'typemod':
          this.app.typemod = value;
          break;
        case 'nonlinearity':
          this.app.nonlinearity = value;
          break;
        case 'freqmod':
          this.app.freqmod = value;
          break;
        default:
          console.log(
            `no numeric change event value handler for ${label} = ${value}`,
          );
          break;
      }
    }
  }

  closeHandler() {
    this.app.closeHandler();
  }

  playHandler() {
    this.app.playHandler();
  }

  tuneHandler() {
    this.app.tuneHandler();
  }

  // ${slTuning('f', 'E2,G2,B2,E3,G3,B3,E4', 'guitar 7 all thirds')} is wrong
  // E F F# G G# is a third
  // G# A A# B C is a third
  // C C# D D# E is a third
  //  ${slTuning('f', 'E2,G#2,C3,E3,G#3,C4,E4', 'guitar 7 all thirds')} should be right
  render() {
    const slTuning = (fretting: string, tuning: string, text: string) =>
      html`<sl-option value="${fretting},${tuning}">${text}</sl-option>`;
    // console.log(`this.tuning.startsWith('o,') -> ${this.tuning.startsWith('o,')}`);
    return html`
      <sl-tab-group>
        <sl-tab slot="nav" panel="mechanical">Mechanical</sl-tab>
        <sl-tab slot="nav" panel="audio">Audio</sl-tab>
        <sl-tab-panel name="mechanical">
          <sl-select
            size="small"
            label="tuning"
            value="${this.tuning}"
            @sl-change=${this.slChangeEventString}
          >
            <span class="label" slot="label">tuning</span>
            ${slTuning('f', 'C3,G3,B3,D4', 'banjo 4 plectrum')}
            ${slTuning('f', 'D3,G3,B3,E4', 'banjo 4 chicago')}
            ${slTuning('f', 'C3,G3,D4,A4', 'banjo 4 tenor')}
            <!-- 5 string banjo is tricky because the 5th string starts at the 5th fret -->
            <!-- Also introduces the library of old-timey tunings named after songs -->
            ${slTuning('f', 'EADG', 'bass 4')}
            ${slTuning('f', 'BEADG', 'bass 5 low')}
            ${slTuning('f', 'EADGC', 'bass 5 high')}
            <!-- cello needs fretless -->
            <!-- dulcimer needs diatonic fretting -->
            <!-- also clarity on order of strings in tuning names -->
            ${slTuning('f', 'EADGBE', 'guitar 6')}
            ${slTuning('f', 'EADGCF', 'guitar 6 all fourths')}
            ${slTuning('f', 'E2,G♯2,C3,E3,G♯3,C4,E4', 'guitar 7 all thirds')}
            ${slTuning(
              'o',
              'C7,B6,A6,G6,F6,E6,D6,C6,B5,A5,G5,F5,E5,D5,C5,B4,A4,G4,F4,E4,D4,C4',
              'lute harp',
            )}
            ${slTuning(
              'o',
              'E5,D♯5,C5,B4,A4,G4,F♯4,E4,D♯4,C4,B3,A3,G3,F♯3,E3',
              'nevel harp',
            )}
            ${slTuning(
              'o',
              'G5,F♯5,E5,D♯5,C5,B4,A4,G4,F♯4,E4',
              'mini kinnor harp',
            )}
            ${slTuning('o', 'G4,F♯4,E4,D♯4,C4,B3,A3,G3,F♯3,E3', 'kinnor harp')}
            ${slTuning('o', 'E4,F4,G♯4,A4,B4,C5,D5,E5', 'lyre harp')}
            ${slTuning(
              'o',
              'D3,E3,F♯3,G3,A3,B3,C♯4,D4,E4,F♯4,G4,A4,B4,C♯5,D5,E5',
              'lyre harp',
            )}
            ${slTuning('o', 'F5,E5,D5,C5,B4,A4,G♯4,F4,E4,D4', 'lyre harp')}
            ${slTuning(
              'o',
              'B3,C4,D4,E4,F4,G4,A4,B4,C5,D5,E5,F5,G5,A5,B5,C6,D6,E6,F6,G6,A6,B6,C7',
              'harp 23',
            )}
            ${slTuning(
              'o',
              'G2,A2,B2,C3,D3,E3,F3,G3,A3,B3,C4,D4,E4,F4,G4,A4,B4,C5,D5,E5,F5,G5,A5,B5,C6,D6,E6,F6,G6,A6',
              'harp 30',
            )}
            ${slTuning(
              'o',
              'G2,A2,B2,C3,D3,E3,F3,G3,A3,B3,C4,D4,E4,F4,G4,A4,B4,C5,D5,E5,F5,G5,A5,B5,C6,D6,E6,F6,G6,A6,B6,C7',
              'harp 32',
            )}
            ${slTuning(
              'o',
              'C2,D2,E2,F2,G2,A2,B2,C3,D3,E3,F3,G3,A3,B3,C4,D4,E4,F4,G4,A4,B4,C5,D5,E5,F5,G5,A5,B5,C6,D6,E6,F6,G6,A6,B6,C7',
              'harp 36',
            )}
            ${slTuning('o', 'D4,E4,G4,A4,B4,D5,E5', 'lyre 7')}
            ${slTuning(
              'o',
              'G3,A3,B3,C4,D4,E4,F4,G4,A4,B4,C5,D5,E5,F5,G5,A5',
              'lyre 16',
            )}
            ${slTuning('f', 'GDAE', 'mandolin 4')}
            ${slTuning('f', 'B3,E3,A2,D2,G1,C1', 'stick 6 bass')}
            ${slTuning('f', 'B1,E2,A2,D3,G3,C4', 'stick 6 guitar')}
            ${slTuning('f', 'A2,D2,G1,C1,F♯2,B2,E3,A3', 'stick 8 classic')}
            ${slTuning(
              'f',
              'E3,A2,D2,G1,C1,F♯2,B2,E3,A3,D4',
              'stick 10 classic',
            )}
            ${slTuning(
              'f',
              'B3,E3,A2,D2,G1,C1,C♯2,F♯2,B2,E3,A3,D4',
              'stick 12 classic',
            )}
            ${slTuning('f', 'G4,C4,E4,A4', 'ukulele 4')}
            <!-- viola needs fretless -->
            <!-- violin needs fretless -->
            ${slTuning(
              'o',
              'G4,A4,B4,C5,D5,E5,F♯5,G5,A5,B5,C6,D6,E6,F♯6,G6',
              'zither 15 in G',
            )}
            ${slTuning(
              'o',
              'B3,C4,D4,E4,F♯4,G4,A4,B4,C5,D5,E5,F♯5,G5,A5,B5,C6,D6,E6,F♯6,G6',
              'zither 20 in G',
            )}
            ${slTuning(
              'o',
              'B3,C♯4,D4,E4,F4,G4,A4,B4,C♯5,D5,E5,F5,G5,A5,B5,C♯6,D6,E6,F6,G6',
              'zither 20 in D',
            )}
            ${slTuning(
              'o',
              'B3,C4,D4,E4,F4,G4,A4,B4,C5,D5,E5,F5,G5,A5,B5,C6,D6,E6,F6,G6',
              'zither 20 in C',
            )}
            <!-- concert and alpine zithers are more complicated -->
          </sl-select>
          ${this.tuning && this.tuning.startsWith('o,')
            ? html`<sl-range
                label="frets"
                value="${this.frets}"
                min="0"
                max="37"
                disabled
                @sl-change=${this.slChangeEventNumber}
              >
                <span class="label" slot="label">frets</span>
              </sl-range>`
            : html` <sl-range
                label="frets"
                value="${this.frets}"
                min="0"
                max="37"
                @sl-change=${this.slChangeEventNumber}
              >
                <span class="label" slot="label">frets</span>
              </sl-range>`}
          <sl-range
            label="transpose"
            value="${this.transpose}"
            min="-24"
            max="24"
            @sl-change=${this.slChangeEventNumber}
          >
            <span class="label" slot="label">transpose</span>
          </sl-range>
          <sl-select
            size="small"
            label="tonic"
            value="${this.tonic}"
            @sl-change=${this.slChangeEventString}
          >
            <span class="label" slot="label">tonic</span>
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
            value="${this.scale}"
            @sl-change=${this.slChangeEventString}
          >
            <span class="label" slot="label">scale</span>
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
            value="${this.offscale}"
            @sl-change=${this.slChangeEventString}
          >
            <span class="label" slot="label">offscale</span>
            <sl-option value="show">show</sl-option>
            <sl-option value="hide">hide</sl-option>
            <sl-option value="mute">mute</sl-option>
            <sl-option value="cover">cover</sl-option>
          </sl-select>
          <sl-select
            size="small"
            label="labels"
            value="${this.labels}"
            @sl-change=${this.slChangeEventString}
          >
            <span class="label" slot="label">labels</span>
            <sl-option value="none">none</sl-option>
            <sl-option value="note">note</sl-option>
            <sl-option value="solfege">solfege</sl-option>
          </sl-select>
          <sl-select
            size="small"
            label="colors"
            value="${this.colors}"
            @sl-change=${this.slChangeEventString}
          >
            <span class="label" slot="label">colors</span>
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
        </sl-tab-panel>
        <sl-tab-panel name="audio">
          <sl-range
            label="velocity"
            value="${this.velocity}"
            min="0"
            max="127"
            step="1"
            @sl-change=${this.slChangeEventNumber}
          >
            <span class="label" slot="label">velocity</span>
          </sl-range>
          <sl-range
            label="pickangle"
            value="${this.pickangle}"
            min="0.0"
            max="0.9"
            step="0.1"
            @sl-change=${this.slChangeEventNumber}
          >
            <span class="label" slot="label">pickangle</span>
          </sl-range>
          <sl-range
            label="pickposition"
            value="${this.pickposition}"
            min="0.02"
            max="0.98"
            step="0.01"
            @sl-change=${this.slChangeEventNumber}
          >
            <span class="label" slot="label">pickposition</span>
          </sl-range>
          <sl-range
            label="decaytime"
            value="${this.decaytime}"
            min="0.0"
            max="10.0"
            step="0.01"
            @sl-change=${this.slChangeEventNumber}
          >
            <span class="label" slot="label">decaytime</span>
          </sl-range>
          <sl-range
            label="brightness"
            value="${this.brightness}"
            min="0.0"
            max="1.0"
            step="0.01"
            @sl-change=${this.slChangeEventNumber}
          >
            <span class="label" slot="label">brightness</span>
          </sl-range>

          <sl-range
            label="typemod"
            value="${this.typemod}"
            min="0"
            max="4"
            step="1"
            @sl-change=${this.slChangeEventNumber}
          >
            <span class="label" slot="label">typemod</span>
          </sl-range>
          <sl-range
            label="nonlinearity"
            value="${this.nonlinearity}"
            min="0"
            max="1.0"
            step="0.01"
            @sl-change=${this.slChangeEventNumber}
          >
            <span class="label" slot="label">nonlinearity</span>
          </sl-range>
          <sl-range
            label="freqmod"
            value="${this.freqmod}"
            min="20"
            max="1000"
            step="0.1"
            @sl-change=${this.slChangeEventNumber}
          >
            <span class="label" slot="label">freqmod</span>
          </sl-range>
        </sl-tab-panel>
      </sl-tab-group>
      <div class="buttons">
        <sl-button @click=${this.closeHandler} size="large" circle>
          <sl-icon name="x-lg" label="close instrument"></sl-icon>
        </sl-button>
        <sl-button @click=${this.playHandler} size="large" circle>
          <sl-icon name="music-note-beamed" label="play instrument"></sl-icon>
        </sl-button>
      </div>
    `;
  }
}
