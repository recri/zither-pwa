/* eslint-disable @typescript-eslint/no-unused-vars */
/*
 ** zither-ui-root
 */
import { TemplateResult } from 'lit-html';
import { LitElement, html, css } from 'lit';
import { property, customElement } from 'lit/decorators.js';

import { ZitherApp } from './zither-app.js';

// The zither-app should parse the url for parameter setting
@customElement('zither-ui-root')
export class ZitherUiRoot extends LitElement {
  @property({ type: Object }) app!: ZitherApp;

  static styles = css`
    :host {
      // font: 16px sans-serif;
      background-color: white;
      color: black;
      padding: 1rem;
    }
    div {
      display: inline-block;
      border: 1px black;
      margin: 0px 5px;
    }
  `;

  inputEvent(e: InputEvent) {
    if (e.target && e.target instanceof HTMLInputElement) {
      const target = e.target as HTMLInputElement;
      if (target.checked)
        switch (target.name) {
          case 'colors':
            this.app.colors = target.value;
            break;
          case 'tuning':
            this.app.tuning = target.value;
            break;
          case 'fretting':
            this.app.fretting = target.value;
            break;
          case 'scale':
            this.app.scale = target.value;
            break;
          case 'tonic':
            this.app.tonic = target.value;
            break;
          default:
            console.log(`unknown target.name ${target.name}`);
            break;
        }
    }
  }

  // hmm, may need the fretting with the tuning
  render() {
    const paramInput = (
      name: string,
      value: string,
      text: string,
      isChecked: boolean
    ) =>
      isChecked
        ? html`<div>
            <input
              type="radio"
              name="${name}"
              id="${value}"
              .value="${value}"
              checked
              @input=${this.inputEvent}
            />
            <label for="${value}">${text}</label>
          </div>`
        : html`<div>
            <input
              type="radio"
              name="${name}"
              id="${value}"
              .value="${value}"
              @input=${this.inputEvent}
            />
            <label for="${value}">${text}</label>
          </div>`;
    const frettingInput = (value: string, text: string) =>
      paramInput('fretting', value, text, this.app.fretting === value);
    const tuningInput = (value: string, text: string) =>
      paramInput('tuning', value, text, this.app.tuning === value);
    const colorInput = (value: string) =>
      paramInput('colors', value, value, this.app.colors === value);
    const scaleInput = (value: string) =>
      paramInput('scale', value, value, this.app.scale === value);
    const tonicInput = (value: string) =>
      paramInput('tonic', value, value, this.app.tonic === value);
    return html`
      <ul>
        <li>
          tuning ${tuningInput('C3,G3,B3,D4', 'banjo 4 plectrum')}
          ${tuningInput('D3,G3,B3,E4', 'banjo 4 chicago')}
          ${tuningInput('C3,G3,D4,A4', 'banjo 4 tenor')}
          <!-- 5 string banjo is tricky because the 5th string starts at the 5th fret -->
          ${tuningInput('EADG', 'bass 4')} ${tuningInput('BEADG', 'bass 5 low')}
          ${tuningInput('EADGC', 'bass 5 high')}
          <!-- cello needs fretless -->
          <!-- dulcimer needs special fretting -->
          ${tuningInput('EADGBE', 'guitar 6')}
          ${tuningInput('EADGCF', 'guitar 6 all fourths')}
          ${tuningInput('E2,G2,B2,E3,G3,B3,E4', 'guitar 7 all thirds')}
          ${tuningInput(
            'B3,C4,D4,E4,F4,G4,A4,B4,C5,D5,E5,F5,G5,A5,B5,C6,D6,E6,F6,G6,A6,B6,C7',
            'harp 23'
          )}
          ${tuningInput(
            'G2,A2,B2,C3,D3,E3,F3,G3,A3,B3,C4,D4,E4,F4,G4,A4,B4,C5,D5,E5,F5,G5,A5,B5,C6,D6,E6,F6,G6,A6',
            'harp 30'
          )}
          ${tuningInput(
            'G2,A2,B2,C3,D3,E3,F3,G3,A3,B3,C4,D4,E4,F4,G4,A4,B4,C5,D5,E5,F5,G5,A5,B5,C6,D6,E6,F6,G6,A6,B6,C7',
            'harp 32'
          )}
          ${tuningInput(
            'C2,D2,E2,F2,G2,A2,B2,C3,D3,E3,F3,G3,A3,B3,C4,D4,E4,F4,G4,A4,B4,C5,D5,E5,F5,G5,A5,B5,C6,D6,E6,F6,G6,A6,B6,C7',
            'harp 36'
          )}
          ${tuningInput('D4,E4,G4,A4,B4,D5,E5', '7 string lyre')}
          ${tuningInput(
            'G3,A3,B3,C4,D4,E4,F4,G4,A4,B4,C5,D5,E5,F5,G5,A5',
            'lyre 16'
          )}
          ${tuningInput('GDAE', 'mandolin')}
          ${tuningInput('B3,E3,A2,D2,G1,C1', 'stick 6 bass')}
          ${tuningInput('B1,E2,A2,D3,G3,C4', 'stick 6 guitar')}
          ${tuningInput('A2,D2,G1,C1,F♯2,B2,E3,A3', 'stick 8 classic')}
          ${tuningInput('E3,A2,D2,G1,C1,F♯2,B2,E3,A3,D4', 'stick 10 classic')}
          ${tuningInput(
            'B3,E3,A2,D2,G1,C1,C♯2,F♯2,B2,E3,A3,D4',
            'stick 12 classic'
          )}
          ${tuningInput('G4,C4,E4,A4', 'ukulele')}
          <!-- viola needs fretless -->
          <!-- violin needs fretless -->
          ${tuningInput(
            'G4,A4,B4,C5,D5,E5,F♯5,G5,A5,B5,C6,D6,E6,F♯6,G6',
            'folk zither 15 in G'
          )}
          ${tuningInput(
            'B3,C4,D4,E4,F♯4,G4,A4,B4,C5,D5,E5,F♯5,G5,A5,B5,C6,D6,E6,F♯6,G6',
            'folk zither 20 in G'
          )}
          ${tuningInput(
            'B3,C♯4,D4,E4,F4,G4,A4,B4,C♯5,D5,E5,F5,G5,A5,B5,C♯6,D6,E6,F6,G6',
            'folk zither 20 in D'
          )}
          ${tuningInput(
            'B3,C4,D4,E4,F4,G4,A4,B4,C5,D5,E5,F5,G5,A5,B5,C6,D6,E6,F6,G6',
            'folk zither 20 in C'
          )}
          <!-- concert and alpine zithers are more complicated -->
        </li>
        <li>
          fretting ${frettingInput('f', 'fretted')}
          ${frettingInput('o', 'open')} ${frettingInput('u', 'unfretted')}
        </li>
        <li>
          colors ${colorInput('bamO')} ${colorInput('brocO')}
          ${colorInput('corkO')} ${colorInput('romaO')} ${colorInput('vikO')}
          ${colorInput('blue')} ${colorInput('green')} ${colorInput('magenta')}
          ${colorInput('gray1')} ${colorInput('gray')} ${colorInput('fire')}
          ${colorInput('none')}
        </li>
        <li>
          scale
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
          ].map(scale => scaleInput(scale))}
        </li>
        <li>
          tonic
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
          ].map(tonic => tonicInput(tonic))}
        </li>
      </ul>
    `;
  }
}
