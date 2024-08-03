import { LitElement, html, css, svg, unsafeCSS } from 'lit';
import { property, state, customElement } from 'lit/decorators.js';

import { ZitherApp } from './zither-app.js';
import { Constant } from './constant.js';
import { FretNote } from './fretnote.js';
import { expand } from './tuning.js';
import { noteToName, noteToSolfege, mtof } from './notes.js'; // , noteClamp, noteToNameOctave
import { degreeIsTonic, degreeIsInScale, noteToScaleDegreeInKey } from './notes.js';

//
// given an x and y coordinate in the window
//   -> the s and p coordinate on the fretboard
// given an s and p coordinate on the fretboard
//   -> the midi note to play
//   -> the s and p coordinate of the fretnote that covers this fretnote
//   -> the x, y, width, and height in the window
//   -> the residual x and y in the fretnote rectangle
// given a midi note
//   -> the frequency
//   -> the chromatic scale degree
//
// the midi note only requires 7 bits, so there are lots of bits to signal
//  muted, covered, tunebutton, etc.
//

interface FretRect {
  x: number; // x position of fret box
  y: number; // y position of fret box
  width: number; // width of fret box
  height: number; // height of fret box
}

@customElement('zither-fretboard')
export class Fretboard extends LitElement {
  // the zither app we're part of
  @property() app!: ZitherApp;

  // the width of the screen
  @property() width!: number;

  // the height of the screen
  @property() height!: number;

  // the top margin of the screen
  @property() top!: number;

  // the bottom margin of the screen
  @property() bottom!: number;

  // the left margin of the screen
  @property() left!: number;

  // the right margin of the screen
  @property() right!: number;

  // the velocity to sound at
  @property() velocity!: number;

  // the tuning of the strings
  @property() tuning!: string;

  // the number of frets, ie chromatic notes, running across the fretboard
  @property() frets!: number;

  // the number of semitones to offset the fretboard
  @property() transpose!: number;

  // the tonic note of the key we are playing
  @property() tonic!: string;

  // the scale we are playing
  @property() scale!: string;

  // the treatment of offscale notes
  @property() offscale!: string;

  // the labels of the notes
  @property() labels!: string;

  // the colors of the notes
  @property() colors!: string;

  // the location of the [Tune] button
  @property() tuneLoc: string = 'ne';

  // whether the [Tune] button is displayed
  @state() private timeoutExpired: boolean = true;

  private fretNotes: FretNote[][] = [];

  private timeoutCount: number = 0;

  private timeoutLength: number = 5; // 5 second timeout shows tune button

  private timeoutIdentifier!: ReturnType<typeof setInterval>;

  private touchCount: number = 0;

  timeoutHandler() {
    this.timeoutCount -= 1;
    this.timeoutExpired = this.timeoutCount <= 0;
  }

  handleTimeout = () => this.timeoutHandler();

  markKeyTime() {
    this.touchCount += 1;
    this.timeoutCount = this.timeoutLength;
    this.timeoutExpired = this.timeoutCount <= 0;
  }

  /* eslint-disable wc/guard-super-call */
  connectedCallback() {
    super.connectedCallback();
    this.timeoutIdentifier = setInterval(this.handleTimeout, 1000);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.clearInterval(this.timeoutIdentifier);
  }
  /* eslint-enable wc/guard-super-call */

  touchLog(code: string, ev: Event) {
    if (this.app.logTouch && ev instanceof TouchEvent) {
      const tl = ev.changedTouches;
      const n = tl.length;
      const t = tl.item(0);
      if (t) {
        const i = t.identifier;
        const x = t.clientX.toFixed(1);
        const y = t.clientY.toFixed(1);
        const rx = t.radiusX.toFixed(1);
        const ry = t.radiusY.toFixed(1);
        const ra = t.rotationAngle;
        const f = t.force;
        this.app.log(`${code} ${n} ${i} ${x} ${y} ${rx} ${ry} ${ra} ${f}`);
      }
    }
  }

  decode_xy(x, y): number[] {
    const { isPortrait, left, top, noteWidth, noteHeight, height } = this;
    let s;
    let p;
    if (isPortrait) {
      s = Math.floor((x - left) / noteWidth);
      p = Math.floor((y - top) / noteHeight);
    } else {
      s = Math.floor((height - y - 1 - top) / noteHeight);
      p = Math.floor((x - left) / noteWidth);
    }
    s = Math.min(this.fretNotes.length - 1, Math.max(0, s));
    p = Math.min(this.fretNotes[0].length - 1, Math.max(0, p));
    return [s, p];
  }

  touch_decode_xy(ev: TouchEvent): number[] {
    const { clientX, clientY } = ev.changedTouches.item(0);
    return this.decode_xy(clientX, clientY);
  }

  tuneLoc_decode_xy(tuneLoc: string): number[] {
    const { width, height } = this;
    switch (tuneLoc) {
      case 'n':
        return this.decode_xy(width / 2, 0);
      case 'ne':
        return this.decode_xy(width, 0);
      case 'e':
        return this.decode_xy(width, height / 2);
      case 'se':
        return this.decode_xy(width, height);
      case 's':
        return this.decode_xy(width / 2, height);
      case 'sw':
        return this.decode_xy(0, height);
      case 'w':
        return this.decode_xy(0, height / 2);
      case 'nw':
        return this.decode_xy(0, 0);
      default:
        return this.decode_xy(0, 0);
    }
  }

  // compute the base coordinates for string s at position p
  // optionally extend to cover adjacent frets
  // this depends on the iscovered flag persisting
  /* eslint-disable no-param-reassign */
  encode_xy(s, p, docover): FretRect {
    const { isPortrait, left, noteWidth, top, noteHeight, tStrings, fretNotes } = this;
    if (docover) {
      // advance p until it's an uncovered fretnote
      while (p < fretNotes[s].length && fretNotes[s][p].iscovered)
        p += 1;
    }
    let x = left + (isPortrait ? noteWidth * s : noteWidth * p);
    let y =
      top + (isPortrait ? noteHeight * p : noteHeight * (tStrings - s - 1));
    let width = noteWidth;
    let height = noteHeight;
    if (docover) {
      // expand fretnote to cover preceding fretnotes
      let cover = 0;
      while (p - cover - 1 >= 0 && fretNotes[s][p - cover - 1].iscovered) {
        cover += 1;
        if (isPortrait) {
          y -= noteHeight;
          height += noteHeight;
        } else {
          x -= noteWidth;
          width += noteWidth;
        }
      }
    }
    return { x, y, width, height };
  }
  /* eslint-enable no-param-reassign */

  // the touch handler only needs the midi note,
  // use negative midi notes to mark 'ismuted' or 'iscovered' or 'istunebutton'
  touch_handler(ev: TouchEvent, t: string) {
    ev.preventDefault();
    this.markKeyTime();
    this.touchLog(t, ev);
    const [s, p] = this.touch_decode_xy(ev);
    switch (t) {
      case 's':
        if (this.fretNotes[s][p].ismuted) return;
        // console.log(`keyOn ${this.note(s,p)}`);
        this.app.audioNode!.keyOn(1, this.fretNotes[s][p].note, this.velocity);
        break;
      case 'm':
        break;
      case 'e':
        if (this.fretNotes[s][p].ismuted) return;
        // console.log(`keyOff ${this.note(s,p)}`);
        this.app.audioNode!.keyOff(1, this.fretNotes[s][p].note, 0);
        break;
      default:
        console.log(`uknown t '${t}' in touch_handler`);
        break;
    }
  }

  start_handler(ev: TouchEvent) {
    this.touch_handler(ev, 's');
  }

  move_handler(ev: TouchEvent) {
    this.touch_handler(ev, 'm');
  }

  end_handler(ev: TouchEvent) {
    this.touch_handler(ev, 'e');
  }

  static styles = css`
    :host {
      background-color: var(--zither-app-background-color);
      border: none;
      padding: 0px;
      margin: none;
    }
  `;

  // fretboard management
  tFretting: string = 'f';

  tStrings: number = 0;

  tPositions: number = 1;

  // key and scale issues
  tonicNote: number = 0;

  scaleNotes: Array<number> = [];

  // presentation issues
  palette: Array<string> = [];

  theTextColor: string = 'white';

  // predicates and properties of string number
  isFrettedString = (string: number) => this.tFretting[string].match(/^[fb]/);

  isOpenString = (string: number) => this.tFretting[string] === 'o';

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
    if (degreeIsTonic(c)) return 'white';
    if (degreeIsInScale(c, this.scaleNotes)) return 'lightgray';
    return 'darkgray';
  }

  strokeWidth(c: number) {
    if (degreeIsTonic(c)) return 3;
    if (degreeIsInScale(c, this.scaleNotes)) return 2;
    return 1;
  }

  private isPortrait: boolean = true;

  private fontSize: number = 0;

  private noteWidth: number = 0;

  private noteHeight: number = 0;

  makeNotes() {
    // local values
    const {
      tuning,
      frets,
      transpose,
      width,
      height,
      top,
      bottom,
      left,
      right,
    } = this;

    // expand tuning
      [this.tFretting, this.fretNotes, this.tStrings, this.tPositions] = expand(
      tuning,
      frets,
      transpose,
    );

    // decode tonic and scale and palette and color
    this.tonicNote = Constant.key.keys[this.tonic];
    this.scaleNotes = Constant.scales[this.scale];
    this.palette = Constant.palettes[this.colors];
    this.theTextColor = Constant.textForPalettes[this.colors];

    // compute sizes based on the array of strings and frets
    // construct the style sheets for portrait and landscape

    this.isPortrait = width < height;
    const adjWidth = width - left - right;
    const adjHeight = height - top - bottom;
    if (!this.isPortrait) {
      this.noteWidth = adjWidth / this.tPositions;
      this.noteHeight = adjHeight / this.tStrings;
    } else {
      this.noteWidth = adjWidth / this.tStrings;
      this.noteHeight = adjHeight / this.tPositions;
    }
    this.fontSize = Math.min(this.noteHeight, this.noteWidth) * 0.5;

    // expand tNotes into fretNotes
    for (let s = 0; s < this.fretNotes.length; s += 1) {
      for (let p = 0; p < this.fretNotes[s].length; p += 1) {
	  const note = this.fretNotes[s][p].note;
	  // const freq = mtof(note);
	  const c = noteToScaleDegreeInKey(note, this.tonicNote);
	  const isinscale = degreeIsInScale(c, this.scaleNotes);
	  this.fretNotes[s][p].iscovered = this.isFrettedString(s) && !isinscale && this.offscale === 'cover';
	  this.fretNotes[s][p].ismuted = this.isFrettedString(s) && !isinscale && this.offscale === 'mute';
	  this.fretNotes[s][p].note = note;
      }
   }

    // hack the iscovered field to implement unusual frettings

    // implement 5 string banjo
    // add cover from nut to fith fret
    if (this.tFretting.match(/^b+$/)) {
      for (let p = 0; p < 5; p += 1) this.fretNotes[0][p].iscovered = true;
    }

    // implement typical diatonic mountain dulcimer
    //  set dulcimer-frets {0 2 4 5 7 9 10 11 12}
    if (this.tFretting.match(/^d+$/)) {
      for (let s = 0; s < this.tStrings; s += 1)
        for (let p = 0; p < this.tPositions; p += 1)
          this.fretNotes[s][p].iscovered = ![
            0, 2, 4, 5, 7, 9, 10, 11, 12,
          ].includes(p % 12);
      // console.log(`matched ^d+$ dulcimer`);
    }

    // implement traditional diatonic mountain dulcimer
    if (this.tFretting.match(/^t+$/)) {
      for (let s = 0; s < this.tStrings; s += 1)
        for (let p = 0; p < this.tPositions; p += 1)
          this.fretNotes[s][p].iscovered = ![0, 2, 4, 5, 7, 9, 10, 12].includes(
            p % 12,
          );
      // console.log(`matched ^t+$ dulcimer`);
    }

    // grow the displayed notes to cover the covered notes
    // this happens for custom fretting as set up just above
    // and when we're simplifying the fretboard to a specified
    // scale
    for (let s = 0; s < this.tStrings; s += 1) {
      if (this.isFrettedString(s)) {
        for (let p = 0; p < this.tPositions; p += 1) {
          // if it is a covered note, just skip it
          if ( ! this.fretNotes[s][p].iscovered) {
            // count how many covered fretnotes precede this fretnote
            // and cover them with this fretnote
            let cover = 0;
            while (p > cover && this.fretNotes[s][p - cover - 1].iscovered) {
              // point the covered note to the covering note
              this.fretNotes[s][p - cover - 1].note = this.fretNotes[s][p].note;
              // make the cover larger
              cover += 1;
            }
          }
        }
      }
    }
  }

  drawNote(s, p) {

    const note = this.fretNotes[s][p].note;

    const c = noteToScaleDegreeInKey(note, this.tonicNote);

    const { offscale } = this;

    if ( ! degreeIsInScale(c, this.scaleNotes)) {
      switch (offscale) {
        case 'hide':
          return svg``;
        case 'mute':
          return svg``;
        case 'cover':
          return svg``;
        default:
          break;
      }
    }

    let { x, y, width, height } = this.encode_xy(s, p, true);

    x += 3;
    y += 3;
    width -= 6;
    height -= 6;

    return svg`
      <g transform="translate(${x}, ${y})" class="note d${c}">
        <rect width="${width}" height="${height}" />
        <text x="${width / 2}" y="${height / 2}">${this.text(c)}</text>
      </g>
    `;
  }

  tune_handler(ev: TouchEvent) {
    ev.preventDefault();
    this.app.tuneHandler();
  }

  drawButton(tuneLoc, text) {
    const [s, p] = this.tuneLoc_decode_xy(tuneLoc);
    let { x, y, width, height } = this.encode_xy(s, p, true);

    x += 3;
    y += 3;
    width -= 6;
    height -= 6;

    return svg`
      <g transform="translate(${x}, ${y})"
         class="note button"
         @touchstart=${this.tune_handler}
      >
        <rect width="${width}" height="${height}" />
        <text x="${width / 2}" y="${height / 2}">${text}</text>
      </g>`;
  }

  makeStyle() {
    return html`
      <style>
        g.button text {
          fill: yellow;
        }
        g.button rect {
          stroke: yellow;
        }
        g.note rect {
          rx: 15;
          ry: 15;
        }
        g.note text {
          text-anchor: middle;
          alignment-baseline: middle;
          stroke: none;
          font: bold ${this.fontSize}px sans-serif;
        }
        ${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(
          c => css`
            g.note.d${c} rect {
              fill: ${unsafeCSS(this.fillColor(c))};
              stroke: ${unsafeCSS(this.strokeColor(c))};
              stroke-width: ${this.strokeWidth(c)};
            }
            g.note.d${c} text {
              fill: ${unsafeCSS(this.textColor(c))};
            }
          `,
        )}
      </style>
    `;
  }

  // \u266b -> musical notes
  // \u2699 -> gear

  render() {
    this.makeNotes();
    const { width, height } = this;
      console.log(`render ${this.tStrings} by ${this.tPositions}`);
    return html`
      ${this.makeStyle()}
      <svg
        viewbox="0 0 ${width} ${height}"
        width="${width}"
        height="${height}"
        @touchstart=${this.start_handler}
        @touchmove=${this.move_handler}
        @touchend=${this.end_handler}
      >
        ${this.fretNotes.map((str, s) =>
          str.map((_, p) => this.drawNote(s, p)),
        )}
        ${this.timeoutExpired ? this.drawButton(this.tuneLoc, '\u2699') : svg``}
      </svg>
    `;
  }
}
