/* eslint-disable @typescript-eslint/no-unused-vars */
/*
 ** zither-ui
 */
import { LitElement, html, css } from 'lit';
import { property, customElement } from 'lit/decorators.js';

import { ZitherApp } from './zither-app.js';
// import './zither-tuning.js';
// import './zither-audio.js';
// import './zither-style.js';
import './zither-log.js';

import '@shoelace-style/shoelace/dist/components/switch/switch.js';
import '@shoelace-style/shoelace/dist/components/icon/icon.js';
import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/tab/tab.js';
import '@shoelace-style/shoelace/dist/components/tab-group/tab-group.js';
import '@shoelace-style/shoelace/dist/components/tab-panel/tab-panel.js';
import '@shoelace-style/shoelace/dist/components/select/select.js';
import '@shoelace-style/shoelace/dist/components/divider/divider.js';
import '@shoelace-style/shoelace/dist/components/option/option.js';
import '@shoelace-style/shoelace/dist/components/range/range.js';
import '@shoelace-style/shoelace/dist/components/tooltip/tooltip.js';

// The zither-app should parse the url for parameter setting
@customElement('zither-ui')
export class ZitherUi extends LitElement {
  @property() app!: ZitherApp;

  @property() fullscreen: boolean = true;

  // mechanics of instrument

  @property() tuning!: string;

  @property() frets!: number;

  @property() transpose!: number;

  // decorations

  @property() tonic!: string;

  @property() scale!: string;

  @property() offscale!: string;

  @property() labels!: string;

  @property() colors!: string;

  @property() top: number = 0;

  @property() right: number = 0;

  @property() bottom: number = 0;

  @property() left: number = 0;

  // audio dsp and effect properties

  @property() dspNames!: Array<string>;

  @property() dspName!: string;

  @property() poly!: number;

  @property() velocity!: number;

  @property() pickangle!: number;

  @property() pickposition!: number;

  @property() decaytime!: number;

  @property() brightness!: number;

  @property() dynamiclevel!: number;

  //

  static styles = css`
    :host {
      background-color: #dddddd;
      border: none;
      padding: 0px;
      margin: none;
      position: absolute;
      width: 100%;
      height: 100%;
      overflow: auto;
    }
    .label {
      font-size: calc(10px + 2vmin);
    }
    sl-tab-group {
      position: absolute;
      height: 100%;
      width: 100%;
    }
    sl-tab-panel {
      height: 100%;
      width: 100%;
    }
    div.buttons {
      position: absolute;
      right: 0;
    }
    sl-button {
      font-size: calc(10px + 2vmin);
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
        case 'dspName':
          this.app.dspName = value;
          break;
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

        case 'poly':
          this.app.poly = value;
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
        case 'dynamiclevel':
          this.app.dynamiclevel = value;
          break;

        case 'top':
          this.app.top = value;
          break;
        case 'right':
          this.app.right = value;
          break;
        case 'bottom':
          this.app.bottom = value;
          break;
        case 'left':
          this.app.left = value;
          break;

        default:
          console.log(
            `no numeric change event value handler for ${label} = ${value}`,
          );
          break;
      }
    }
  }

  slChangeEventFullscreen() {
    this.app.fullscreen = !this.fullscreen;
  }

  playHandler() {
    this.app.playHandler();
  }

  // ${slTuning('f', 'E2,G2,B2,E3,G3,B3,E4', 'guitar 7 all thirds')} is wrong
  // E F F♯ G G♯ is a third
  // G♯ A A♯ B C is a third
  // C C♯ D D♯ E is a third
  //  ${slTuning('f', 'E2,G♯2,C3,E3,G♯3,C4,E4', 'guitar 7 all thirds')} should be right
  render() {
    const slTuning = (fretting: string, tuning: string, text: string) =>
      html`<sl-option value="${fretting},${tuning}">${text}</sl-option>`;
    // console.log(`this.tuning.startsWith('o,') -> ${this.tuning.startsWith('o,')}`);
    return html`
      <sl-tab-group>
        <sl-tab slot="nav" panel="tuning">Tuning</sl-tab>
        <sl-tab slot="nav" panel="audio">Audio</sl-tab>
        <sl-tab slot="nav" panel="style">Style</sl-tab>
        <sl-tab slot="nav" panel="preset">Preset</sl-tab>
        <sl-tab slot="nav" panel="log">Log</sl-tab>

        <sl-tab-panel name="tuning">
          <sl-select
            size="small"
            label="tuning"
            value="${this.tuning}"
            @sl-change=${this.slChangeEventString}
          >
            <span class="label" slot="label">tuning</span>
            <sl-option value="f,C3,G3,B3,D4">banjo 4 plectrum</sl-option>
            <sl-option value="f,D3,G3,B3,E4">banjo 4 chicago</sl-option>
            <sl-option value="f,C3,G3,D4,A4">banjo 4 tenor</sl-option>
            <!-- see https://zeppmusic.com/banjo/aktuning.htm for many more tunings -->
            <!-- 5 string banjo is tricky because the 5th string starts at the 5th fret -->
            <!-- if it started where the rest of the strings start, it would be D4 -->
            <sl-option value="b,D4,D3,G3,B3,D4">banjo 5 standard</sl-option>
            <sl-option value="b,D4,D3,G3,B3,D4">banjo 5 open-G</sl-option>
            <sl-option value="b,D4,C3,G3,B3,D4">banjo 5 open-G-alt</sl-option>
            <sl-option value="b,D4,C3,G3,C4,D4">banjo 5 double-C</sl-option>
            <sl-option value="b,D4,D3,G3,C4,D4">banjo 5 sawmill</sl-option>
            <sl-option value="b,C♯4,D3,F♯3,A3,D4">banjo 5 open-D</sl-option>
            <sl-option value="b,E4,D3,A3,D4,E4">banjo 5 double-D</sl-option>
            <sl-option value="b,E4,E3,A3,C♯4,E4">banjo 5 open-A</sl-option>
            <sl-divider></sl-divider>
            <sl-option value="f,E1,A1,D2,G2">bass 4</sl-option>
            <sl-option value="f,B0,E1,A1,D2,G2">bass 5 low</sl-option>
            <sl-option value="f,E1,A1,D2,G2,C3">bass 5 high</sl-option>
            <sl-option value="f,B0,E1,A1,D2,G2,C3,F3,A♯3">bass 8 low</sl-option>
            <sl-option value="f,E1,A1,D2,G2,C3,F3,A♯3,D♯4"
              >bass 8 high</sl-option
            >
            <!-- cello needs fretless -->
            <!-- dulcimer needs diatonic fretting -->
            <!-- also clarity on order of strings in tuning names -->
            <!-- told that they list the bass strings first -->
            <!-- should do a 3/4/5 string selector and a c/d/t fret selector -->
            <!-- and generate 4, 5 string tunings from the 3 string -->
            <sl-divider></sl-divider>
            ${slTuning('d', 'G3,G3,C3', 'dulcimer CGG')}
            ${slTuning('d', 'C4,G3,C3', 'dulcimer CGC')}
            ${slTuning('d', 'G4,F3,C3', 'dulcimer CFG')}
            ${slTuning('d', 'A3,A3,D3', 'dulcimer DAA')}
            ${slTuning('d', 'D4,A3,D3', 'dulcimer DAD')}
            ${slTuning('d', 'D4,G3,D3', 'dulcimer DGD')}
            <sl-divider></sl-divider>
            ${slTuning('t', 'G3,G3,C3', 'dulcimer CGG (traditional)')}
            ${slTuning('t', 'C4,G3,C3', 'dulcimer CGC (traditional)')}
            ${slTuning('t', 'G4,F3,C3', 'dulcimer CFG (traditional)')}
            ${slTuning('t', 'A3,A3,D3', 'dulcimer DAA (traditional)')}
            ${slTuning('t', 'D4,A3,D3', 'dulcimer DAD (traditional)')}
            ${slTuning('t', 'D4,G3,D3', 'dulcimer DGD (traditional)')}
            <sl-divider></sl-divider>
            ${slTuning('f', 'G3,G3,C3', 'dulcimer CGG (chromatic)')}
            ${slTuning('f', 'C4,G3,C3', 'dulcimer CGC (chromatic)')}
            ${slTuning('f', 'G4,F3,C3', 'dulcimer CFG (chromatic)')}
            ${slTuning('f', 'A3,A3,D3', 'dulcimer DAA (chromatic)')}
            ${slTuning('f', 'D4,A3,D3', 'dulcimer DAD (chromatic)')}
            ${slTuning('f', 'D4,G3,D3', 'dulcimer DGD (chromatic)')}
            <sl-divider></sl-divider>
            ${slTuning('d', 'G3,G3,G3,C3', 'dulcimer CGGG')}
            ${slTuning('d', 'C4,C4,G3,C3', 'dulcimer CGCC')}
            ${slTuning('d', 'G4,G4,F3,C3', 'dulcimer CFGG')}
            ${slTuning('d', 'A3,A3,A3,D3', 'dulcimer DAAA')}
            ${slTuning('d', 'D4,D4,A3,D3', 'dulcimer DADD')}
            ${slTuning('d', 'D4,D4,G3,D3', 'dulcimer DGDD')}
            <sl-divider></sl-divider>
            ${slTuning('t', 'G3,G3,G3,C3', 'dulcimer CGGG (traditional)')}
            ${slTuning('t', 'C4,C4,G3,C3', 'dulcimer CGCC (traditional)')}
            ${slTuning('t', 'G4,G4,F3,C3', 'dulcimer CFGG (traditional)')}
            ${slTuning('t', 'A3,A3,A3,D3', 'dulcimer DAAA (traditional)')}
            ${slTuning('t', 'D4,D4,A3,D3', 'dulcimer DADD (traditional)')}
            ${slTuning('t', 'D4,D4,G3,D3', 'dulcimer DGDD (traditional)')}
            <sl-divider></sl-divider>
            ${slTuning('f', 'G3,G3,G3,C3', 'dulcimer CGGG (chromatic)')}
            ${slTuning('f', 'C4,C4,G3,C3', 'dulcimer CGCC (chromatic)')}
            ${slTuning('f', 'G4,G4,F3,C3', 'dulcimer CFGG (chromatic)')}
            ${slTuning('f', 'A3,A3,A3,D3', 'dulcimer DAAA (chromatic)')}
            ${slTuning('f', 'D4,D4,A3,D3', 'dulcimer DADD (chromatic)')}
            ${slTuning('f', 'D4,D4,G3,D3', 'dulcimer DGDD (chromatic)')}
            <sl-divider></sl-divider>
            <!-- Jacob Collier tuning -->
            ${slTuning('f', 'D2,A2,E3,A3,D4', 'guitar 5')}
            ${slTuning('f', 'E2,A2,D3,G3,B3,E4', 'guitar 6')}
            ${slTuning('f', 'E2,A2,D3,G3,C4,F4', 'guitar 6 all fourths')}
            ${slTuning('f', 'E2,G♯2,C3,E3,G♯3,C4,E4', 'guitar 7 all thirds')}
            <sl-divider></sl-divider>
            ${slTuning(
              'o12o12o11',
              'D6,C6,B5,A5,G5,F♯5,E5,D5,C♯5,B4,A4,G♯4,G5,F5,E5,D5,C5,B4,A4,G4,F♯4,E4,D4,C♯4,C5,A♯4,A4,G4,F4,E4,D4,C4,B3,A3,G3',
              'hammered dulcimer 12/11',
            )}
            ${slTuning(
              'o13o13o12',
              'E6,D6,C6,B5,A5,G5,F♯5,E5,D5,C♯5,B4,A4,G♯4,A5,G5,F5,E5,D5,C5,B4,A4,G4,F♯4,E4,D4,C♯4,D5,C5,A♯4,A4,G4,F4,E4,D4,C4,B3,A3,G3',
              'hammered dulcimer 13/12',
            )}
            ${slTuning(
              'o15o15o14',
              'D6,C6,B5,A5,G5,F♯5,E5,D5,C♯5,B4,A4,G♯4,F♯4,E4,D♯4,G5,F5,E5,D5,C5,B4,A4,G4,F♯4,E4,D4,C♯4,B3,A3,G♯3,C5,A♯4,A4,G4,F4,E4,D4,C4,B3,A3,G3,F♯3,E3,D3',
              'hammered dulcimer 15/14',
            )}
            ${slTuning(
              'o16o16o15',
              'E6,D6,C6,B5,A5,G5,F♯5,E5,D5,C♯5,B4,A4,G♯4,F♯4,E4,D♯4,A♯5,G♯5,F5,E5,D5,C5,B4,A4,G4,F♯4,E4,D4,C♯4,B3,A3,G♯3,D♯5,C♯5,A♯4,A4,G4,F4,E4,D4,C4,B3,A3,G3,F♯3,E3,D3',
              'hammered dulcimer 16/15',
            )}
            <sl-divider></sl-divider>
            ${slTuning(
              'o',
              'C7,B6,A6,G6,F6,E6,D6,C6,B5,A5,G5,F5,E5,D5,C5,B4,A4,G4,F4,E4,D4,C4',
              'lute harp 22',
            )}
            ${slTuning(
              'o',
              'E5,D♯5,C5,B4,A4,G4,F♯4,E4,D♯4,C4,B3,A3,G3,F♯3,E3',
              'nevel harp 15',
            )}
            ${slTuning(
              'o',
              'G5,F♯5,E5,D♯5,C5,B4,A4,G4,F♯4,E4',
              'mini kinnor harp 10',
            )}
            ${slTuning(
              'o',
              'G4,F♯4,E4,D♯4,C4,B3,A3,G3,F♯3,E3',
              'kinnor harp 10',
            )}
            ${slTuning('o', 'E4,F4,G♯4,A4,B4,C5,D5,E5', 'lyre harp 8')}
            ${slTuning(
              'o',
              'D3,E3,F♯3,G3,A3,B3,C♯4,D4,E4,F♯4,G4,A4,B4,C♯5,D5,E5',
              'lyre harp 16',
            )}
            ${slTuning('o', 'F5,E5,D5,C5,B4,A4,G♯4,F4,E4,D4', 'lyre harp 10')}
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
            <sl-divider></sl-divider>
            ${slTuning('o', 'D4,E4,G4,A4,B4,D5,E5', 'lyre 7')}
            ${slTuning(
              'o',
              'G3,A3,B3,C4,D4,E4,F4,G4,A4,B4,C5,D5,E5,F5,G5,A5',
              'lyre 16',
            )}
            <sl-divider></sl-divider>
            <!-- mandolin as doubled strings needs change of fingering technique -->
            ${slTuning('f', 'G3,D4,A4,E5', 'mandolin 4 standard')}
            ${slTuning('f', 'F3,C4,G4,D5', 'mandolin 4 cajun')}
            ${slTuning('f', 'G3,D4,G4,B4', 'mandolin 4 open-G')}
            ${slTuning('f', 'G3,D4,G4,D5', 'mandolin 4 sawmill')}
            ${slTuning('f', 'G3,D4,A4,D5', 'mandolin 4 geedad')}
            ${slTuning('f', 'D3,D4,A4,D5', 'mandolin 4 open-D')}
            ${slTuning('f', 'A3,D4,A4,E5', 'mandolin 4 high bass')}
            ${slTuning('f', 'A3,E4,A4,E5', 'mandolin 4 cross-tuning')}
            ${slTuning('f', 'A3,E4,A4,C♯5', 'mandolin 4 open-A')}
            ${slTuning('f', 'A3,E4,A4,D5', 'mandolin 4 silver-lake')}
            ${slTuning(
              'f',
              'E3,D4,A4,E5',
              'mandolin 4 glory-in-the-meeting-house',
            )}
            ${slTuning('f', 'E3,E4,A4,E5', 'mandolin 4 get-up-in-the-cool')}
            <sl-divider></sl-divider>
            ${slTuning('f', 'B3,E3,A2,D2,G1,C1', 'stick 6 bass')}
            ${slTuning('f', 'B1,E2,A2,D3,G3,C4', 'stick 6 guitar')}
            <sl-divider></sl-divider>
            ${slTuning('f', 'A2,D2,G1,C1,F♯2,B2,E3,A3', 'stick 8 classic')}
            ${slTuning(
              'f',
              'B0,E1,A1,D2,G2,C3,F3,B♭3',
              'stick 8 standard bass 4ths',
            )}
            ${slTuning(
              'f',
              'B0,E1,A1,D2,G2,C3,E3,A3',
              'stick 8 guitar intervals',
            )}
            ${slTuning(
              'f',
              'B0,E1,A1,D2,G2,B2,E3,A3',
              'stick 8 guitar lower octave',
            )}
            ${slTuning(
              'f',
              'A2,D2,G1,C1,E2,A2,D3,G3',
              'stick 8 interior matched reciprocal',
            )}
            ${slTuning(
              'f',
              'G♯2,C♯2,F♯1,B0,E1,A1,D2,G2',
              'stick 8 interior dual bass reciprocal',
            )}
            <sl-divider></sl-divider>
            ${slTuning(
              'f',
              'E3,A2,D2,G1,C1,F♯2,B2,E3,A3,D4',
              'stick 10 classic',
            )}
            ${slTuning(
              'f',
              'E3,A2,D2,G1,C1,E2,A2,D3,G3,C4',
              'stick 10 matched reciprocal',
            )}
            ${slTuning(
              'f',
              'E3,A2,D2,G1,C1,C♯2,F♯2,B2,E3,A3',
              'stick 10 baritone melody',
            )}
            ${slTuning(
              'f',
              'E3,A2,D2,G1,C1,B1,E2,A2,D3,G3',
              'stick 10 deep baritone melody',
            )}
            ${slTuning(
              'f',
              'D3,G2,C2,F1,B♭0,D2,G2,C3,F3,B♭3',
              'stick 10 deep matched reciprocal',
            )}
            ${slTuning(
              'f',
              'F♯3,B2,E2,A1,D1,F♯2,B2,E3,A3,D4',
              'stick 10 raised matched reciprocal',
            )}
            ${slTuning(
              'f',
              'F♯3,B2,E2,A1,D1,C♯2,F♯2,B2,E3,A3',
              'stick 10 full baritone',
            )}
            ${slTuning(
              'f',
              'D♯3,G♯2,C♯2,F♯1,B0,E2,A2,D3,G3,C4',
              'stick 10 dual bass reciprocal',
            )}
            <sl-divider></sl-divider>
            ${slTuning(
              'f',
              'B3,E3,A2,D2,G1,C1,C♯2,F♯2,B2,E3,A3,D4',
              'stick 12 classic',
            )}
            ${slTuning(
              'f',
              'B3,E3,A2,D2,G1,C1,B1,E2,A2,D3,G3,C4',
              'stick 12 matched reciprocal',
            )}
            ${slTuning(
              'f',
              'A3,E3,A2,D2,G1,C1,B1,E2,A2,D3,G3,C4',
              'stick 12 matched reciprocal with high bass 4th',
            )}
            ${slTuning(
              'f',
              'A3,E3,A2,D2,G1,C1,C♯2,F♯2,B2,E3,A3,D4',
              'stick 12 classic with high bass 4th',
            )}
            ${slTuning(
              'f',
              'A3,D3,G2,C2,F1,B♭0,A1,D2,G2,C3,F3,B♭3',
              'stick 12 deep matched reciprocal',
            )}
            ${slTuning(
              'f',
              'C♯4,F♯3,B2,E2,A1,D1,C♯2,F♯2,B2,E3,A3,D4',
              'stick 12 raised matched reciprocal',
            )}
            ${slTuning(
              'f',
              'A♯3,D♯3,G♯2,C♯2,F♯1,B0,E1,A1,D2,G2,C3,F3',
              'stick 12 dual bass reciprocal',
            )}
            ${slTuning(
              'f',
              'F3,C3,G2,D2,A1,E1,B0,E1,A1,D2,G2,C3',
              'stick 12 mirrored 4ths',
            )}
            <sl-divider></sl-divider>
            ${slTuning('f', 'G4,C4,E4,A4', 'ukulele 4')}
            ${slTuning('f', 'D5,G4,B4,E5', 'ukelele 4 pocket')}
            ${slTuning('f', 'G4,C4,E4,A4', 'ukelele 4 soprano')}
            ${slTuning('f', 'G4,C4,E4,A4', 'ukelele 4 concert')}
            ${slTuning('f', 'G4,C4,E4,A4', 'ukelele 4 tenor')}
            ${slTuning('f', 'D3,G3,B3,E4', 'ukelele 4 baritone')}
            ${slTuning('f', 'E1,A1,D2,G2', 'ukelele 4 bass')}
            <sl-divider></sl-divider>
            ${slTuning('f', 'C5,F4,A4,D5', 'ukelele 4 pocket-alt')}
            ${slTuning('f', 'A4,D4,F♯4,B4', 'ukelele 4 soprano-alt-1')}
            ${slTuning('f', 'G3,C4,E4,A4', 'ukelele 4 soprano-alt-2')}
            ${slTuning('f', 'G3,C4,E4,A4', 'ukelele 4 concert-alt')}
            ${slTuning('f', 'D4,G3,B3,E4', 'ukelele 4 tenor-alt-1')}
            ${slTuning('f', 'A3,D4,F♯4,B4', 'ukelele 4 tenor-alt-2')}
            ${slTuning('f', 'D3,G3,B3,E4', 'ukelele 4 tenor-alt-3')}
            ${slTuning('f', 'C3,G3,B3,E4', 'ukelele 4 baritone-alt')}
            ${slTuning('f', 'D1,A1,D2,G2', 'ukelele 4 bass-alt')}
            <!-- viola needs fretless -->
            <!-- violin needs fretless -->
            <sl-divider></sl-divider>
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
            ${slTuning(
              'f5o12o12',
              'A4,A4,D4,G3,C3,E♭4,B♭3,F4,C4,G3,D4,A3,E4,B3,F♯3,C♯4,G♯3,E♭3,B♭2,F3,C3,G2,D3,A2,E3,B2,F♯2,C♯3,G♯2',
              'munich zither',
            )}
            ${slTuning(
              'f5o12o12',
              'A4,D4,G4,G3,C3,A♭4,E♭4,B♭3,F4,C4,G4,D4,A3,E4,B3,F♯4,C♯4,G♯3,E♭2,B♭2,F2,C3,G2,D2,A2,E2,B2,F♯2,C♯2',
              'viennese zither',
            )}
            ${slTuning(
              'f5o12o12o6',
              'A4,A4,D4,G3,C3,E♭4,B♭3,F4,C4,G3,D4,A3,E4,B3,F♯3,C♯4,G♯3,E♭3,B♭2,F3,C3,G2,D3,A2,E3,B2,F♯2,C♯3,G♯2,F2,E2,E♭2,D2,C♯2,C2',
              'munich concert zither',
            )}
            ${slTuning(
              'f5o12o12o6',
              'A4,D4,G4,G3,C3,A♭4,E♭4,B♭3,F4,C4,G4,D4,A3,E4,B3,F♯4,C♯4,G♯3,E♭2,B♭2,F2,C3,G2,D2,A2,E2,B2,F♯2,C♯2,G♯2,C2,B1,B♭1,A1,G♯1',
              'viennese concert zither',
            )}
            ${slTuning(
              'f5o12o12o6o3',
              'A4,D4,G4,G3,C3,A♭4,E♭4,B♭3,F4,C4,G4,D4,A3,E4,B3,F♯4,C♯4,G♯3,E♭2,B♭2,F2,C3,G2,D2,A2,E2,B2,F♯2,C♯2,G♯2,C2,B1,B♭1,A1,G♯1,G1,F♯1,F1',
              'viennese alpine zither',
            )}
            ${slTuning(
              'f5o12o12o6o6',
              'A4,A4,D4,G3,C3,E♭4,B♭3,F4,C4,G3,D4,A3,E4,B3,F♯3,C♯4,G♯3,E♭3,B♭2,F3,C3,G2,D3,A2,E3,B2,F♯2,C♯3,G♯2,F2,E2,E♭2,D2,C♯2,C2,B1,B♭1,A1,G♯1,G1,F♯1,F1',
              'munich alpine zither',
            )}
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
              'none',
              'gray',
              'blue',
              'green',
              'magenta',
              'fire',
              'bamO',
              'brocO',
              'corkO',
              'romaO',
              'vikO',
            ].map(
              color => html`<sl-option value="${color}">${color}</sl-option>`,
            )}
          </sl-select>
        </sl-tab-panel>
        <sl-tab-panel name="audio">
          ${this.dspNames.length <= 1
            ? html``
            : html` <sl-select
                size="small"
                label="dspName"
                value="${this.dspName}"
                @sl-change=${this.slChangeEventString}
              >
                <span class="label" slot="label">dspName</span>
                ${this.dspNames.map(
                  dspName =>
                    html`<sl-option value="${dspName}">${dspName}</sl-option>`,
                )}
              </sl-select>`}

          <sl-range
            label="poly"
            value="${this.poly}"
            min="0"
            max="64"
            step="1"
            @sl-change=${this.slChangeEventNumber}
          >
            <span class="label" slot="label">poly</span>
          </sl-range>

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
            label="dynamiclevel"
            value="${this.dynamiclevel}"
            min="-60"
            max="0"
            step="1"
            @sl-change=${this.slChangeEventNumber}
          >
            <span class="label" slot="label">dynamic_level</span>
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
        </sl-tab-panel>

        <sl-tab-panel name="style">
          <sl-switch
            label="fullscreen"
            ${this.fullscreen === true ? 'checked' : ''}
            @sl-change=${this.slChangeEventFullscreen}
          >
            Fullscreen fretboard
          </sl-switch>

          <sl-range
            label="top"
            value="${this.top}"
            min="0"
            max="64"
            @sl-change=${this.slChangeEventNumber}
          >
            <span class="label" slot="label">top</span>
          </sl-range>

          <sl-range
            label="right"
            value="${this.right}"
            min="0"
            max="64"
            @sl-change=${this.slChangeEventNumber}
          >
            <span class="label" slot="label">right</span>
          </sl-range>

          <sl-range
            label="bottom"
            value="${this.bottom}"
            min="0"
            max="64"
            @sl-change=${this.slChangeEventNumber}
          >
            <span class="label" slot="label">bottom</span>
          </sl-range>

          <sl-range
            label="left"
            value="${this.left}"
            min="0"
            max="64"
            @sl-change=${this.slChangeEventNumber}
          >
            <span class="label" slot="label">left</span>
          </sl-range>
        </sl-tab-panel>

        <sl-tab-panel name="log">
          <zither-log .app=${this.app}></zither-log>
        </sl-tab-panel>
      </sl-tab-group>

      <div class="buttons">
        <sl-tooltip content="go to the fretboard page and play">
          <sl-button size="small" @click=${this.playHandler} circle>
            <sl-icon name="music-note-beamed" label="play instrument"></sl-icon>
          </sl-button>
        </sl-tooltip>
      </div>
    `;
  }
}
