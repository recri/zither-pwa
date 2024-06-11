import { LitElement, html, css, unsafeCSS } from 'lit';
import { property, customElement } from 'lit/decorators.js';

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

  // the width of the screen
  @property({ type: Number }) width!: number;

  // the height of the screen
  @property({ type: Number }) height!: number;

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
    div.fret {
      display: flex;
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

  boardDirection: string = 'row';

  positionDirection: string = 'column';

  noteWidth: number = 0;

  noteHeight: number = 0;

  // compute sizes based on the array of strings and frets
  computeSizes() {
    this.stringNumbers = rangeFromZeroToLast(this.strings - 1);
    this.positionNumbers = rangeFromZeroToLast(this.positions - 1);
    if (this.width >= this.height) {
      this.boardDirection = 'row';
      this.positionDirection = 'column';
      this.noteWidth = this.width / this.positions;
      this.noteHeight = this.height / this.strings;
    } else {
      this.boardDirection = 'column';
      this.positionDirection = 'row';
      this.noteWidth = this.width / this.strings;
      this.noteHeight = this.height / this.positions;
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

      if (!this.isInScale[c] && this.offscale !== 'show') {
        this.texts[c] = '';
        this.fillColors[c] = '';
        this.strokeColors[c] = '';
        this.textColors[c] = '';
        this.strokeWidths[c] = 0;
      }

      /* eslint-enable no-nested-ternary */
    }
  }

  makeNote(string: number, position: number) {
    // these have to be done in reverse order when loading into a column
    // from top to botton.
    /* eslint-disable no-param-reassign */
    if (this.positionDirection === 'column') string = this.strings - string - 1;
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
    return html` <zither-fretnote
      class="fretnote"
      .fretboard=${this}
      .string=${string}
      .position=${position}
      .width=${this.noteWidth}
      .height=${this.noteHeight}
      .freq=${freq}
      .note=${midiNote}
      .velocity=${this.velocity}
      .isinscale=${this.isInScale[chromaticDegreeInKey]}
      .offscale=${this.offscale}
      .text=${this.texts[chromaticDegreeInKey]}
      .fillColor=${this.fillColors[chromaticDegreeInKey]}
      .strokeColor=${this.strokeColors[chromaticDegreeInKey]}
      .strokeWidth=${this.strokeWidths[chromaticDegreeInKey]}
      .textColor=${this.textColors[chromaticDegreeInKey]}
    ></zither-fretnote>`;
  }

  // to be able to stretch fret-notes along the string, as when frets are missing
  // or when we cover the offscale notes, we need to layout each string as a column
  render() {
    this.processInputs();
    this.computeSizes();
    this.computeArrays();
    // console.log(`note w ${this.noteWidth} h ${this.noteHeight} window w ${this.width} h ${this.height}`);
    return html`
      <style>
        div.fretboard {
          flex-direction: ${unsafeCSS(this.boardDirection)};
        }
        div.fret {
          flex-direction: ${unsafeCSS(this.positionDirection)};
        }
        zither-fretnote.fretnote {
          width: ${this.noteWidth}px;
          height: ${this.noteHeight}px;
        }
      </style>
      <div class="fretboard">
        ${this.positionNumbers.map(
          position =>
            html`<div class="fret">
              ${this.stringNumbers.map(string =>
                this.makeNote(string, position),
              )}
            </div>`,
        )}
      </div>
    `;
  }
}
