import { LitElement, html, css, unsafeCSS } from 'lit';
import { property, customElement } from 'lit/decorators.js';

import { ZitherApp } from './zither-app.js';
import { Constant } from './constant.js';
import { expandTuning } from './tuning.js';
import { noteToName, mtof } from './notes.js';
import './zither-fretnote.js';

@customElement('zither-fretboard')
export class Fretboard extends LitElement {
  // the zither app we're part of
  @property({ type: Object }) app!: ZitherApp;

  // the audio context we are running in
  @property({ type: Object }) audioContext!: AudioContext;

  // the number of frets running across the fretboard
  @property({ type: Number }) frets!: number;

  // the tuning of the strings in the courses
  @property({ type: Array }) tuning!: string;

  // the tonic note of the key we are playing
  @property({ type: Number }) tonic!: string;

  // the scale we are playing
  @property({ type: Number }) scale!: string;

  // the colors of the notes
  @property({ type: Array }) colors!: string;

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

  tonicNote: number = 0;

  scaleNotes: Array<number> = [];

  courses: number = 0;

  strings: number = 1;

  palette: Array<string> = [];

  processInputs() {
    this.tuningNotes = expandTuning(this.tuning);
    this.tonicNote = Constant.key.keys[this.tonic];
    this.scaleNotes = Constant.scales[this.scale];
    this.courses = this.tuningNotes.length;
    this.strings = 1;
    this.palette = Constant.palettes[this.colors];
  }

  courseNumbers: Array<number> = [];

  fretNumbers: Array<number> = [];

  boardDirection: string = 'row';

  fretDirection: string = 'column';

  noteWidth: number = 0;

  noteHeight: number = 0;

  computeSizes() {
    this.courseNumbers = Array.from(Array(this.courses).keys());
    this.fretNumbers = Array.from(Array(this.frets).keys());
    this.boardDirection = this.width >= this.height ? 'row' : 'column';
    this.fretDirection = this.width >= this.height ? 'column' : 'row';
    this.noteWidth =
      this.width >= this.height
        ? this.width / this.frets
        : this.width / this.courses;
    this.noteHeight =
      this.width >= this.height
        ? this.height / this.courses
        : this.height / this.frets;
  }

  texts: Array<string> = [];

  fillColors: Array<string> = [];

  strokeColors: Array<string> = [];

  textColors: Array<string> = [];

  strokeWidths: Array<number> = [];

  computeArrays() {
    this.texts = new Array(12);
    this.fillColors = new Array(12);
    this.strokeColors = new Array(12);
    this.textColors = new Array(12);
    this.strokeWidths = new Array(12);
    // interate over chromatic degrees in our current key
    for (let c = 0; c < 12; c += 1) {
      // the text label for the note in the key of C
      this.texts[c] = noteToName(c + this.tonicNote, this.tonicNote);
      // is in the scale of our mode
      const isInScale: boolean = this.scaleNotes.includes(c);
      // is the tonic of our key
      const isTonic: boolean = c === 0;
      // colors, might be filtered by color preferences
      this.fillColors[c] = this.palette[c];
      /* eslint-disable no-nested-ternary */
      this.strokeColors[c] = isTonic
        ? 'white'
        : isInScale
          ? 'lightgray'
          : 'darkgray';
      this.textColors[c] = isTonic
        ? 'white'
        : isInScale
          ? 'lightgray'
          : 'darkgray';
      this.strokeWidths[c] = isTonic ? 3 : isInScale ? 2 : 1;
      /* eslint-enable no-nested-ternary */
    }
  }

  makeNote(course: number, fret: number) {
    // these have to be done in reverse order when loading into a column
    // from top to botton.
    /* eslint-disable no-param-reassign */
    if (this.fretDirection === 'column') course = this.courses - course - 1;
    /* eslint-enable no-param-reassign */
    // the notes to be sounded
    // assumes that the strings in the course are in unison or octave
    const midiNotes: Array<number> = this.tuningNotes
      .slice(course * this.strings, (course + 1) * this.strings)
      .map(n => n + fret);
    // the frequencies to be keyed
    const freqs: Array<number> = midiNotes.map(n => mtof(n));
    // the chromatic note class for these notes in the key of C
    const chromaticDegree: number = midiNotes[0] % 12;
    // the chromatic note class for these notes in the current key
    const chromaticDegreeInKey = (chromaticDegree - this.tonicNote + 12) % 12;

    return html` <zither-fretnote
      class="fretnote"
      .fretboard=${this}
      .course=${course}
      .fret=${fret}
      .width=${this.noteWidth}
      .height=${this.noteHeight}
      .freqs=${freqs}
      .notes=${midiNotes}
      .text=${this.texts[chromaticDegreeInKey]}
      .fillColor=${this.fillColors[chromaticDegreeInKey]}
      .strokeColor=${this.strokeColors[chromaticDegreeInKey]}
      .strokeWidth=${this.strokeWidths[chromaticDegreeInKey]}
      .textColor=${this.textColors[chromaticDegreeInKey]}
    ></zither-fretnote>`;
  }

  render() {
    this.processInputs();
    this.computeSizes();
    this.computeArrays();
    return html`
      <style>
        div.fretboard {
          flex-direction: ${unsafeCSS(this.boardDirection)};
        }
        div.fret {
          flex-direction: ${unsafeCSS(this.fretDirection)};
        }
        zither-fretnote.fretnote {
          width: ${this.noteWidth}px;
          height: ${this.noteHeight}px;
        }
      </style>
      <div class="fretboard">
        ${this.fretNumbers.map(
          fret =>
            html`<div class="fret">
              ${this.courseNumbers.map(course => this.makeNote(course, fret))}
            </div>`,
        )}
      </div>
    `;
  }
}
