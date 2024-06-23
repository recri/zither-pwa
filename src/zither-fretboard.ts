import { LitElement, html, css, unsafeCSS } from 'lit';
import { property, state, customElement } from 'lit/decorators.js';

import 'https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.15.1/cdn/components/icon/icon.js';
import 'https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.15.1/cdn/components/button/button.js';
import 'https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.15.1/cdn/components/tooltip/tooltip.js';

import { ZitherApp } from './zither-app.js';
import { Constant } from './constant.js';
import { expandTuning, expandFretting } from './tuning.js';
import { noteToName, noteToSolfege, mtof } from './notes.js';
import './zither-fretnote.js';
import './zither-fretmute.js';

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

  // the time since last key event
  @state()
  private lastKeyTime: number = 0;

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
      margin: 10px;
    }
  `;

  private intervalIdentifier = 0;

  markKeyTime() {
    this.lastKeyTime = Constant.ndef.markkeytime;
  }

  intervalHandler() {
    if (this.lastKeyTime > 0) {
      this.lastKeyTime -= 1;
      // console.log(`lastKeyTime = ${this.lastKeyTime}`);
    }
  }

  /* eslint-disable wc/guard-super-call */
  connectedCallback() {
    super.connectedCallback();
    this.intervalIdentifier = window.setInterval(
      () => this.intervalHandler(),
      1011,
    );
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.clearInterval(this.intervalIdentifier);
  }
  /* eslint-enable wc/guard-super-call */

  // fretboard management
  tuningNotes: Array<number> = [];

  fretting: string = 'f';

  tonicNote: number = 0;

  scaleNotes: Array<number> = [];

  strings: number = 0;

  positions: number = 1;

  palette: Array<string> = [];

  isAllFrettedString() {
    return Array.from(this.fretting).every(x => x === 'f');
  }

  isFrettedString(string: number) {
    return this.fretting[string] === 'f';
  }

  isAllOpenString() {
    return Array.from(this.fretting).every(x => x === 'o');
  }

  isOpenString(string: number) {
    return this.fretting[string] === 'o';
  }

  processInputs() {
    this.tuningNotes = expandTuning(this.tuning);
    this.fretting = expandFretting(this.tuning, this.tuningNotes);
    // console.log(`fretting ${this.fretting} tuning ${this.tuningNotes}`);
    this.tonicNote = Constant.key.keys[this.tonic];
    this.scaleNotes = Constant.scales[this.scale];
    // assuming only fretted or open for the moment
    if (this.isAllFrettedString()) {
      this.strings = this.tuningNotes.length;
      this.positions = this.frets;
    } else if (this.isAllOpenString()) {
      this.strings = 3;
      this.positions = this.tuningNotes.length;
    } else {
      console.log(`hybrid fretted open not implemented`);
    }
    this.palette = Constant.palettes[this.colors];
  }

  stringNumbers: Array<number> = [];

  positionNumbers: Array<number> = [];

  isPortrait: boolean = true;

  fontSize: number = 0;

  portraitStyle = html``;

  landscapeStyle = html``;

  buttonStyle() {
    return css`
      div.buttons {
        display: ${unsafeCSS(this.lastKeyTime > 0 ? 'none' : 'block')};
      }
    `;
  }

  // compute sizes based on the array of strings and frets
  // construct the style sheets for portrait and landscape
  computeSizes() {
    const { width, height, strings, positions } = this;
    this.isPortrait = width < height;
    this.stringNumbers = rangeFromZeroToLast(strings - 1);
    this.positionNumbers = rangeFromZeroToLast(positions - 1);
    if (!this.isPortrait) {
      const noteWidth = width / positions;
      const noteHeight = height / strings;
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
          zither-fretmute {
            width: ${width}px;
          }
        </style>
      `;
    } else {
      const noteWidth = width / strings;
      const noteHeight = height / positions;
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
          zither-fretmute {
            height: ${height}px;
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
    if (!this.isPortrait) string = this.strings - string - 1;
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
    // count how many omitted fretnotes precede this one
    let cover = 0;
    if (this.isFrettedString(string) && this.offscale === 'cover') {
      if (this.isInScale[chromaticDegreeInKey] === false) return html``; // omit offscale fretnote
      while (
        position > cover &&
        !this.isInScale[(chromaticDegreeInKey - cover - 1 + 12) % 12]
      ) {
        cover += 1;
      }
    }
    return html` <zither-fretnote
      class="fretnote x${cover + 1}"
      .fretboard=${this}
      .freq=${freq}
      .note=${midiNote}
      .velocity=${this.velocity}
      .isinscale=${this.isInScale[chromaticDegreeInKey]}
      .offscale=${this.offscale}
      .text=${this.texts[chromaticDegreeInKey]}
      .fontSize=${this.fontSize}
      .fillColor=${this.fillColors[chromaticDegreeInKey]}
      .strokeColor=${this.strokeColors[chromaticDegreeInKey]}
      .strokeWidth=${this.strokeWidths[chromaticDegreeInKey]}
      .textColor=${this.textColors[chromaticDegreeInKey]}
    ></zither-fretnote>`;
  }

  makeMute() {
    return html` <zither-fretmute
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

  allFretted() {
    return html`
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

  allOpen() {
    return html`
      <div class="fretboard">
        <div class="mute">${this.makeMute()}</div>
        <div class="string">
          ${this.positionNumbers.map(position => this.makeNote(0, position))}
        </div>
        <div class="mute">${this.makeMute()}</div>
      </div>
    `;
  }

  /* eslint-disable class-methods-use-this */
  hybridFrettedOpen() {
    return html``;
  }
  /* eslint-enable class-methods-use-this */

  /* eslint-disable no-nested-ternary */
  render() {
    this.processInputs();
    this.computeSizes();
    this.computeArrays();
    return html`
      ${!this.isPortrait ? this.landscapeStyle : this.portraitStyle}
      <div class="buttons">
        <sl-tooltip content="go back to the settings page">
          <sl-button @click=${this.tuneHandler} circle>
            <sl-icon name="gear" label="tune instrument"></sl-icon>
          </sl-button>
        </sl-tooltip>
      </div>
      ${this.isAllFrettedString()
        ? this.allFretted()
        : this.isAllOpenString()
          ? this.allOpen()
          : this.hybridFrettedOpen()}
    `;
  }
  /* eslint-enable no-nested-ternary */
}
