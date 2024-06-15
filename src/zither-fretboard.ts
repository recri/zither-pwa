import { LitElement, html, css } from 'lit';
import { property, customElement } from 'lit/decorators.js';

import 'https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.15.1/cdn/components/icon/icon.js';
import 'https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.15.1/cdn/components/button/button.js';

import { ZitherApp } from './zither-app.js';
import { Constant } from './constant.js';
import { expandTuning, expandFretting } from './tuning.js';
import { noteToName, noteToSolfege, mtof } from './notes.js';
import './zither-fretnote.js';

const rangeFromZeroToLast = (last: number) =>
  Array.from(Array(last + 1).keys());

const clamp = (value: number, min: number, max: number): number =>
  Math.max(min, Math.min(max, value));

@customElement('zither-fretboard')
export class Fretboard extends LitElement {
  // the zither app we're part of
  @property({ type: Object }) app!: ZitherApp;

  // the width of the screen
  @property({ type: Number }) width!: number;

  // the height of the screen
  @property({ type: Number }) height!: number;

  // the velocity to sound at
  @property({ type: Number }) velocity!: number;

  // the tuning of the strings
  @property({ type: String }) tuning!: string;

  // the number of frets, ie chromatic notes, running across the fretboard
  @property({ type: Number }) frets!: number;

  // the number of semitones to offset the fretboard
  @property({ type: Number }) transpose!: number;

  // the tonic note of the key we are playing
  @property({ type: Number }) tonic!: string;

  // the scale we are playing
  @property({ type: Number }) scale!: string;

  // the treatment of offscale notes
  @property({ type: String }) offscale!: string;

  // the labels of the notes
  @property({ type: String }) labels!: string;

  // the colors of the notes
  @property({ type: String }) colors!: string;

  static styles = css`
    :host {
      background-color: var(--zither-app-background-color);
      border: none;
      padding: 0px;
      margin: none;
    }
    div.fretboard {
      display: flex;
      touch-action: none;
    }
    div.string {
      display: flex;
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

  // fretboard management
  tuningNotes: Array<number> = [];

  fretting: string = 'f';

  tonicNote: number = 0;

  scaleNotes: Array<number> = [];

  strings: number = 0;

  positions: number = 1;

  palette: Array<string> = [];

  isFrettedString(string: number) {
    return this.fretting === 'f' || this.fretting[string] === 'f';
  }

  isOpenString(string: number) {
    return this.fretting === 'o' || this.fretting[string] === 'o';
  }

  processInputs() {
    this.tuningNotes = expandTuning(this.tuning);
    this.fretting = expandFretting(this.tuning, this.tuningNotes);
    // console.log(`fretting ${this.fretting} tuning ${this.tuningNotes}`);
    this.tonicNote = Constant.key.keys[this.tonic];
    this.scaleNotes = Constant.scales[this.scale];
    // assuming only fretted or open for the moment
    if (this.isFrettedString(0)) {
      this.strings = this.tuningNotes.length;
      this.positions = this.frets;
    } else {
      this.strings = 1;
      this.positions = this.tuningNotes.length;
    }
    this.palette = Constant.palettes[this.colors];
  }

  stringNumbers: Array<number> = [];

  positionNumbers: Array<number> = [];

  noteWidth: number = 0;

  noteHeight: number = 0;

  portraitStyle = html``;

  landscapeStyle = html``;

  // compute sizes based on the array of strings and frets
  // construct the style sheets for portrait and landscape
  computeSizes() {
    this.stringNumbers = rangeFromZeroToLast(this.strings - 1);
    this.positionNumbers = rangeFromZeroToLast(this.positions - 1);
    if (this.width >= this.height) {
      this.noteWidth = this.width / this.positions;
      this.noteHeight = this.height / this.strings;
      this.landscapeStyle = html`
        <style>
          div.fretboard {
            width: ${this.width}px;
            height: ${this.height}px;
            flex-direction: column;
          }
          div.string {
            width: ${this.width}px;
            height: ${this.noteHeight}px;
            flex-direction: row;
          }
          fretnote.x1 {
            width: ${1 * this.noteWidth}px;
            height: ${this.noteHeight}px;
          }
          fretnote.x2 {
            width: ${2 * this.noteWidth}px;
            height: ${this.noteHeight}px;
          }
          fretnote.x3 {
            width: ${3 * this.noteWidth}px;
            height: ${this.noteHeight}px;
          }
          fretnote.x4 {
            width: ${4 * this.noteWidth}px;
            height: ${this.noteHeight}px;
          }
        </style>
      `;
    } else {
      this.noteWidth = this.width / this.strings;
      this.noteHeight = this.height / this.positions;
      this.portraitStyle = html`
        <style>
          div.fretboard {
            width: ${this.width}px;
            height: ${this.height}px;
            flex-direction: row;
          }
          div.string {
            width: ${this.noteWidth}px;
            height: ${this.height}px;
            flex-direction: column;
          }
          fretnote.x1 {
            width: ${this.noteWidth}px;
            height: ${1 * this.noteHeight}px;
          }
          fretnote.x2 {
            width: ${this.noteWidth}px;
            height: ${2 * this.noteHeight}px;
          }
          fretnote.x3 {
            width: ${this.noteWidth}px;
            height: ${3 * this.noteHeight}px;
          }
          fretnote.x4 {
            width: ${this.noteWidth}px;
            height: ${4 * this.noteHeight}px;
          }
        </style>
      `;
    }
  }

  texts: Array<string> = [];

  fillColors: Array<string> = [];

  strokeColors: Array<string> = [];

  textColors: Array<string> = [];

  strokeWidths: Array<number> = [];

  isInScale: Array<boolean> = [];

  // compute arrays with values per scale degree
  computeArrays() {
    this.texts = new Array(12);
    this.fillColors = new Array(12);
    this.strokeColors = new Array(12);
    this.textColors = new Array(12);
    this.strokeWidths = new Array(12);
    // interate over chromatic degrees in our current key
    for (let c = 0; c < 12; c += 1) {
      // the text label for the note in the key of C
      /* eslint-disable no-nested-ternary */
      this.texts[c] =
        this.labels === 'note'
          ? noteToName(c + this.tonicNote, this.tonicNote)
          : this.labels === 'solfege'
            ? noteToSolfege(c + this.tonicNote, this.tonicNote)
            : '';
      /* eslint-enable no-nested-ternary */
      // is in the scale of our mode
      this.isInScale[c] = this.scaleNotes.includes(c);
      // is the tonic of our key
      const isTonic: boolean = c === 0;
      // colors, might be filtered by color preferences
      this.fillColors[c] = this.palette[c];
      /* eslint-disable no-nested-ternary */
      this.strokeColors[c] = isTonic
        ? 'white'
        : this.isInScale[c]
          ? 'lightgray'
          : 'darkgray';
      this.textColors[c] = isTonic
        ? 'white'
        : this.isInScale[c]
          ? 'lightgray'
          : 'darkgray';
      this.strokeWidths[c] = isTonic ? 3 : this.isInScale[c] ? 2 : 1;
      /* eslint-enable no-nested-ternary */
    }
  }

  makeNote(string: number, position: number) {
    // these have to be done in reverse order when loading into a column
    // from top to botton.
    /* eslint-disable no-param-reassign */
    if (this.width >= this.height) string = this.strings - string - 1;
    /* eslint-enable no-param-reassign */
    // the midi note to be sounded
    const midiNote: number = clamp(
      (this.isFrettedString(string)
        ? this.tuningNotes[string] + position
        : this.tuningNotes[position]) + this.transpose,
      0,
      127,
    );
    // the frequency to be keyed
    const freq: number = mtof(midiNote);
    // the chromatic note class for this notes in the key of C
    const chromaticDegree: number = midiNote % 12;
    // the chromatic note class for these notes in the current key, not needed? or needed?
    const chromaticDegreeInKey = (chromaticDegree - this.tonicNote + 12) % 12;
    // implement cover
    let widthScale = 1;
    let heightScale = 1;
    // count how many omitted fretnotes precede this one
    let cover = 0;
    if (this.offscale === 'cover') {
      if (this.isInScale[chromaticDegreeInKey] === false) return html``; // omit offscale fretnote
      while (
        position > cover &&
        !this.isInScale[(chromaticDegreeInKey - cover - 1 + 12) % 12]
      ) {
        cover += 1;
      }
      // console.log(`cover = ${cover}`);
      if (this.width >= this.height) {
        widthScale += cover;
      } else {
        heightScale += cover;
      }
    }
    return html` <zither-fretnote
      class="fretnote x${cover + 1}"
      .fretboard=${this}
      .width=${this.noteWidth * widthScale}
      .height=${this.noteHeight * heightScale}
      .freq=${freq}
      .note=${midiNote}
      .velocity=${this.velocity}
      .isinscale=${this.isInScale[chromaticDegreeInKey]}
      .offscale=${this.offscale}
      .text=${this.texts[chromaticDegreeInKey]}
      .fontSize=${this.noteHeight * 0.5}
      .fillColor=${this.fillColors[chromaticDegreeInKey]}
      .strokeColor=${this.strokeColors[chromaticDegreeInKey]}
      .strokeWidth=${this.strokeWidths[chromaticDegreeInKey]}
      .textColor=${this.textColors[chromaticDegreeInKey]}
      .inset="3"
    ></zither-fretnote>`;
  }

  tuneHandler() {
    this.app.tuneHandler();
  }

  render() {
    this.processInputs();
    this.computeSizes();
    this.computeArrays();
    // console.log(`note w ${this.noteWidth} h ${this.noteHeight} window w ${this.width} h ${this.height}`);
    return html`
      <div class="buttons">
        <sl-button @click=${this.tuneHandler} size="large" circle>
          <sl-icon name="gear" label="tune instrument"></sl-icon>
        </sl-button>
      </div>
      ${this.width >= this.height ? this.landscapeStyle : this.portraitStyle}
      <div class="fretboard">
        ${this.stringNumbers.map(
          string =>
            html`<div class="string">
              ${this.positionNumbers.map(position =>
                this.makeNote(string, position),
              )}
            </div>`,
        )}
      </div>
    `;
  }
}
