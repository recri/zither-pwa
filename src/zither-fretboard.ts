import { LitElement, html, css, unsafeCSS } from 'lit';
import { property, state, customElement } from 'lit/decorators.js';

import '@shoelace-style/shoelace/dist/components/icon/icon.js';
import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/tooltip/tooltip.js';

import { ZitherApp } from './zither-app.js';
import { Constant } from './constant.js';
import { expand } from './tuning.js';
import { noteToName, noteToSolfege, mtof } from './notes.js'; // , noteClamp, noteToNameOctave
import { rangeFromZeroToLast } from './util.js';
import './zither-fretnote.js';
import './zither-fretmute.js';

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

  // whether the [Tune] button is displayed
  @state()
  private timeoutExpired: boolean = true;

  private timeoutIdentifier: number = 0;

  private timeoutDelay = parseFloat(Constant.defaultValues.markkeytime) * 1000;

  timeoutHandler() {
    // console.log(`timeoutHandler this.tagName ${this.tagName} id ${this.timeoutIdentifier} exp ${this.timeoutExpired}`);
    this.timeoutIdentifier = 0;
    this.timeoutExpired = true;
  }

  handleTimeout = () => this.timeoutHandler();

  markTimeout() {
    // console.log(`markTimeout this.tagName ${this.tagName} id ${this.timeoutIdentifier} exp ${this.timeoutExpired}`);
    window.clearTimeout(this.timeoutIdentifier);
    this.timeoutExpired = false;
    this.timeoutIdentifier = window.setTimeout(
      this.handleTimeout,
      this.timeoutDelay,
    );
  }

  markMouseTime() {
    this.markTimeout();
  }

  markKeyTime() {
    this.markTimeout();
  }

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
      right: 0;
    }
    sl-button {
      font-size: calc(10px + 2vmin);
      margin: 20px;
    }
  `;

  // fretboard management
  tNotes: number[][] = [];

  tCover: boolean[][] = [];

  tFretting: string = 'f';

  tStrings: number = 0;

  tPositions: number = 1;

  // style issues
  tonicNote: number = 0;

  scaleNotes: Array<number> = [];

  palette: Array<string> = [];

  theTextColor: string = 'white';

  stringNumbers: number[] = [];

  positionNumbers: number[] = [];

  isFrettedString(string: number) {
    return this.tFretting[string].match(/^[fb]/);
  }

  isOpenString(string: number) {
    return this.tFretting[string] === 'o';
  }

  // per fretnote data computed from midiNote

  /* eslint-disable class-methods-use-this */
  scale_degree_in_C(midiNote: number) {
    return (midiNote + 120 - Constant.notes.middle_C) % 12;
  }

  scale_degree_in_key(midiNote: number) {
    return ((midiNote % 12) - this.tonicNote + 12) % 12;
  }
  /* eslint-enable class-methods-use-this */

  // scale degree is in the scale of our mode
  isInScale(c: number) {
    return this.scaleNotes.includes(c);
  }

  // scale degree is the tonic of our key
  /* eslint-disable class-methods-use-this */
  isTonic(c: number) {
    return c === 0;
  }
  /* eslint-enable class-methods-use-this */

  // the text label for the scale degree
  text(c: number) {
    switch (this.labels) {
      case 'note':
        return noteToName(c + this.tonicNote, this.tonic);
      case 'solfege absolute':
        return noteToSolfege(c + this.tonicNote, this.tonic);
      case 'solfege relative':
        return noteToSolfege(c, this.tonic);
      case 'solfege':
        return noteToSolfege(c, this.tonic);
      default:
        return '';
    }
  }

  /* eslint-disable @typescript-eslint/no-unused-vars */
  textColor(c: number) {
    return this.theTextColor;
  }
  /* eslint-enable @typescript-eslint/no-unused-vars */

  // fill colors, might be filtered by color preferences
  fillColor(c: number) {
    return this.palette[c];
  }

  strokeColor(c: number) {
    if (this.isTonic(c)) return 'white';
    if (this.isInScale(c)) return 'lightgray';
    return 'darkgray';
  }

  strokeWidth(c: number) {
    if (this.isTonic(c)) return 3;
    if (this.isInScale(c)) return 2;
    return 1;
  }

  processInputs() {
    // expand tuning
    const [tFretting, tNotes, tStrings, tPositions] = expand(
      this.tuning,
      this.frets,
      this.transpose,
    );
    // console.log(`post expand tNotes ${tNotes.map(col => noteToNameOctave(col[0]))}`);
    // copy the results of the expanded tuning
    this.tFretting = tFretting;
    this.tNotes = tNotes;
    this.tStrings = tStrings;
    this.tPositions = tPositions;

    // decode tonic and scale and palette and color
    this.tonicNote = Constant.key.keys[this.tonic];
    this.scaleNotes = Constant.scales[this.scale];
    this.palette = Constant.palettes[this.colors];
    this.theTextColor = Constant.textForPalettes[this.colors];

    // build the index arrays
    this.stringNumbers = rangeFromZeroToLast(tStrings - 1);
    this.positionNumbers = rangeFromZeroToLast(this.tPositions - 1);

    // a boolean for each note to indicate whether it's covered,
    // ie omitted from fretboard, muted, and subsumed into the
    // button for the next uncovered note.
    this.tCover = this.stringNumbers.map(() =>
      new Array(tPositions).fill(false),
    );
    for (let s = 0; s < tStrings; s += 1)
      if (this.isFrettedString(s) && this.offscale === 'cover')
        for (let p = 0; p < tPositions; p += 1)
          this.tCover[s][p] = this.isInScale(this.tNotes[s][p]);

    // implement 5 string banjo
    if (tFretting.match(/^b+$/)) {
      for (let p = 0; p < 5; p += 1) this.tCover[0][p] = true;
    }
    // implement typical diatonic mountain dulcimer
    //     set dulcimer-frets {0 2 4 5 7 9 10 11 12}
    if (tFretting.match(/^d+$/)) {
      for (let s = 0; s < tStrings; s += 1)
        for (let p = 0; p < tPositions; p += 1)
          this.tCover[s][p] = [0, 2, 4, 5, 7, 9, 10, 11].includes(p % 12);
    }
    // implement traditional diatonic mountain dulcimer
    if (tFretting.match(/^t+$/)) {
      for (let s = 0; s < tStrings; s += 1)
        for (let p = 0; p < tPositions; p += 1)
          this.tCover[s][p] = [0, 2, 4, 5, 7, 9, 10].includes(p % 12);
    }
    // console.log(`processInputs colors=${this.colors}, palette=${this.palette}, textColor=${this.textColor}`);
  }

  isPortrait: boolean = true;

  fontSize: number = 0;

  portraitStyle = html``;

  landscapeStyle = html``;

  buttonStyle() {
    return css`
      div.buttons {
        display: ${unsafeCSS(this.timeoutExpired ? 'block' : 'none')};
      }
    `;
  }

  // compute sizes based on the array of strings and frets
  // construct the style sheets for portrait and landscape
  computeSizes() {
    const { width, height, tStrings, tPositions } = this;
    this.isPortrait = width < height;
    if (!this.isPortrait) {
      const noteWidth = width / tPositions;
      const noteHeight = height / tStrings;
      this.fontSize = Math.min(noteHeight, noteWidth) * 0.5;
      this.landscapeStyle = html`
        <style>
          ${this.buttonStyle()} div.fretboard {
            width: 100%;
            height: 100%;
            flex-direction: column;
          }
          div.string {
            width: 100%;
            height: ${noteHeight}px;
            flex-direction: row;
          }
          zither-fretnote,
          zither-fretmute {
            height: ${noteHeight}px;
          }
          zither-fretnote.x1 {
            width: ${1 * noteWidth}px;
          }
          zither-fretnote.x2 {
            width: ${2 * noteWidth}px;
          }
          zither-fretnote.x3 {
            width: ${3 * noteWidth}px;
          }
          zither-fretnote.x4 {
            width: ${4 * noteWidth}px;
          }
          zither-fretnote.x5 {
            width: ${5 * noteWidth}px;
          }
          zither-fretnote.x6 {
            width: ${6 * noteWidth}px;
          }
          zither-fretnote.x7 {
            width: ${7 * noteWidth}px;
          }
          zither-fretmute {
            width: ${width}px;
          }
        </style>
      `;
    } else {
      const noteWidth = width / tStrings;
      const noteHeight = height / tPositions;
      this.fontSize = Math.min(noteHeight, noteWidth) * 0.5;
      this.portraitStyle = html`
        <style>
          ${this.buttonStyle()} div.fretboard {
            width: ${width}px;
            height: ${height}px;
            flex-direction: row;
          }
          div.string {
            width: ${noteWidth}px;
            height: ${height}px;
            flex-direction: column;
          }
          zither-fretnote,
          zither-fretmute {
            width: ${noteWidth}px;
          }
          zither-fretnote.x1 {
            height: ${1 * noteHeight}px;
          }
          zither-fretnote.x2 {
            height: ${2 * noteHeight}px;
          }
          zither-fretnote.x3 {
            height: ${3 * noteHeight}px;
          }
          zither-fretnote.x4 {
            height: ${4 * noteHeight}px;
          }
          zither-fretnote.x5 {
            height: ${5 * noteHeight}px;
          }
          zither-fretnote.x6 {
            height: ${6 * noteHeight}px;
          }
          zither-fretnote.x7 {
            height: ${7 * noteHeight}px;
          }
          zither-fretmute {
            height: ${height}px;
          }
        </style>
      `;
    }
  }

  makeNote(tString: number, tPosition: number) {
    // these have to be done in reverse order when loading into a column
    // from top to botton.
    /* eslint-disable no-param-reassign */
    if (!this.isPortrait) tString = this.tStrings - tString - 1;
    /* eslint-enable no-param-reassign */

    // nothing if our column ended early
    if (tPosition >= this.tNotes[tString].length) return html``;

    // the midi note to be sounded offset by transpose
    const midiNote = this.tNotes[tString][tPosition];

    // the frequency to be keyed
    const freq: number = mtof(midiNote);

    // the chromatic note class for these notes in the current key, not needed? or needed?
    const c = this.scale_degree_in_key(midiNote);

    // if this fretnote is covered, omit
    if (this.tCover[tString][tPosition]) return html``; // omit offscale fretnote
    // count how many covered fretnotes precede this fretnote
    let cover = 0;
    while (tPosition > cover && this.tCover[tString][tPosition - cover - 1])
      cover += 1;
    return html` <zither-fretnote
      class="fretnote x${cover + 1}"
      .fretboard=${this}
      .freq=${freq}
      .note=${midiNote}
      .velocity=${this.velocity}
      .isinscale=${this.isInScale(c)}
      .offscale=${this.offscale}
      .text=${this.text(c)}
      .fontSize=${this.fontSize}
      .fillColor=${this.fillColor(c)}
      .strokeColor=${this.strokeColor(c)}
      .strokeWidth=${this.strokeWidth(c)}
      .textColor=${this.textColor(c)}
    ></zither-fretnote>`;
  }

  makeMute() {
    return html`
      <zither-fretmute
        class="fretmute"
        .fretboard=${this}
        .fillColor="grey"
        .strokeColor="grey"
        .strokeWidth="1"
      ></zither-fretnote>`;
  }

  tuneHandler() {
    this.app.tuneHandler();
  }

  /* eslint-disable no-nested-ternary */
  render() {
    this.processInputs();
    this.computeSizes();
    return html`
      ${!this.isPortrait ? this.landscapeStyle : this.portraitStyle}
      <div class="buttons">
        <sl-tooltip content="go back to the settings page">
          <sl-button size="small" @click=${this.tuneHandler} circle>
            <sl-icon name="gear" label="tune instrument"></sl-icon>
          </sl-button>
        </sl-tooltip>
      </div>
      <div class="fretboard">
        ${this.stringNumbers.map(
          tString =>
            html`<div class="string">
              ${this.positionNumbers.map(tPosition =>
                this.makeNote(tString, tPosition),
              )}
            </div>`,
        )}
      </div>
    `;
  }
  /* eslint-enable no-nested-ternary */
}
