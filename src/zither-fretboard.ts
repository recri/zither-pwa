import { LitElement, html, css, svg, unsafeCSS } from 'lit';
import { property, state, customElement } from 'lit/decorators.js';

import '@shoelace-style/shoelace/dist/components/icon/icon.js';
import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/tooltip/tooltip.js';

import { ZitherApp } from './zither-app.js';
import { Constant } from './constant.js';
import { expand } from './tuning.js';
import { noteToName, noteToSolfege, mtof } from './notes.js'; // , noteClamp, noteToNameOctave

interface FretNote {
  s: number; // string counted from closest to player
  p: number; // fret position counted from nut
  note: number; // midi note
  freq: number; // frequency of note in Hertz
  c: number; // chromatic scale degree in key
  isinscale: boolean; // is chromatic scale degree in key in the displayed scale
  iscovered: boolean; // is this fretnote covered by another fretnote
  ismuted: boolean; // is this fretnote muted
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

  decode_xy(x, y): FretNote {
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
    const obj = this.fretNotes[s][p];
    // console.log(`decode_xy(${x}, ${y}) yields ${obj}`);
    return obj;
  }

  touch_decode_xy(ev: TouchEvent) {
    const { clientX, clientY } = ev.changedTouches.item(0);
    return this.decode_xy(clientX, clientY);
  }

  tuneLoc_decode(tuneLoc: string) {
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

  touch_handler(ev: TouchEvent, t: string, obj: FretNote) {
    ev.preventDefault();
    this.markKeyTime();
    this.touchLog(t, ev);
    switch (t) {
      case 's':
        if (obj.ismuted) return;
        // console.log(`keyOn ${obj.note}`);
        this.app.audioNode!.keyOn(1, obj.note, this.velocity);
        break;
      case 'm':
        break;
      case 'e':
        if (obj.ismuted) return;
        // console.log(`keyOff ${obj.note}`);
        this.app.audioNode!.keyOff(1, obj.note, 0);
        break;
      default:
        console.log(`uknown t '${t}' in touch_handler`);
        break;
    }
  }

  start_handler(ev: TouchEvent) {
    this.touch_handler(ev, 's', this.touch_decode_xy(ev));
  }

  move_handler(ev: TouchEvent) {
    this.touch_handler(ev, 'm', this.touch_decode_xy(ev));
  }

  end_handler(ev: TouchEvent) {
    this.touch_handler(ev, 'e', this.touch_decode_xy(ev));
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
  // tNotes: number[][] = [];

  // tCover: boolean[][] = [];

  tFretting: string = 'f';

  tStrings: number = 0;

  tPositions: number = 1;

  // style issues
  tonicNote: number = 0;

  scaleNotes: Array<number> = [];

  palette: Array<string> = [];

  theTextColor: string = 'white';

  isFrettedString(string: number) {
    return this.tFretting[string].match(/^[fb]/);
  }

  isOpenString(string: number) {
    return this.tFretting[string] === 'o';
  }

  // per FretNote data computed from midiNote

  /* eslint-disable class-methods-use-this */
  scale_degree_in_C(midiNote: number) {
    return (midiNote + 120 - Constant.notes.middle_C) % 12;
  }
  /* eslint-enable class-methods-use-this */

  scale_degree_in_key(midiNote: number) {
    return ((midiNote % 12) - this.tonicNote + 12) % 12;
  }

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

  private isPortrait: boolean = true;

  private fontSize: number = 0;

  private adjWidth: number = 0;

  private adjHeight: number = 0;

  private noteWidth: number = 0;

  private noteHeight: number = 0;

  makeNote(s: number, p: number, note: number) {
    const { isPortrait, tStrings, offscale, left, top, noteWidth, noteHeight } =
      this;

    const freq = mtof(note);
    const c = this.scale_degree_in_key(note);
    const isinscale = this.isInScale(c);
    const iscovered =
      offscale === 'cover' && this.isFrettedString(s) && !isinscale;
    const ismuted =
      offscale === 'mute' && this.isFrettedString(s) && !isinscale;
    const x = isPortrait ? left + noteWidth * s : top + noteHeight * p;
    const y = isPortrait
      ? top + noteHeight * p
      : left + noteWidth * (tStrings - s - 1);
    const width = isPortrait ? noteWidth : noteHeight;
    const height = isPortrait ? noteHeight : noteWidth;

    const f: FretNote = {
      s, // string number
      p, // fret position
      note, // midi note
      freq, // the frequency to be keyed
      c, // the chromatic note class for this note in the current key
      isinscale, // is the chromatic note class in scale in the current
      iscovered, // is note covered by another note because not in scale
      ismuted, // is note muted because not in scale
      x, // the x position of note
      y, // the y position of note
      width, // the width of note
      height, // the height of note
    };

    return f;
  }

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
    const [tFretting, tNotes, tStrings, tPositions] = expand(
      tuning,
      frets,
      transpose,
    );
    // console.log(`post expand tNotes ${tNotes.map(col => noteToNameOctave(col[0]))}`);

    // copy the results of the expanded tuning
    this.tFretting = tFretting;
    // this.tNotes = tNotes; deferred
    this.tStrings = tStrings;
    this.tPositions = tPositions;

    // decode tonic and scale and palette and color
    this.tonicNote = Constant.key.keys[this.tonic];
    this.scaleNotes = Constant.scales[this.scale];
    this.palette = Constant.palettes[this.colors];
    this.theTextColor = Constant.textForPalettes[this.colors];

    // compute sizes based on the array of strings and frets
    // construct the style sheets for portrait and landscape

    this.isPortrait = width < height;
    this.adjWidth = width - left - right;
    this.adjHeight = height - top - bottom;
    if (!this.isPortrait) {
      this.noteWidth = this.adjWidth / tPositions;
      this.noteHeight = this.adjHeight / tStrings;
    } else {
      this.noteWidth = this.adjWidth / tStrings;
      this.noteHeight = this.adjHeight / tPositions;
    }
    this.fontSize = Math.min(this.noteHeight, this.noteWidth) * 0.5;

    // expand tNotes into fretNotes
    this.fretNotes = new Array(tNotes.length);
    for (let s = 0; s < tNotes.length; s += 1) {
      this.fretNotes[s] = new Array(tNotes[s].length);
      for (let p = 0; p < tNotes[s].length; p += 1)
        this.fretNotes[s][p] = this.makeNote(s, p, tNotes[s][p]);
    }

    // hack the iscovered field to implement unusual frettings

    // implement 5 string banjo
    // add cover from nut to fith fret
    if (tFretting.match(/^b+$/)) {
      for (let p = 0; p < 5; p += 1) this.fretNotes[0][p].iscovered = true;
    }

    // implement typical diatonic mountain dulcimer
    //  set dulcimer-frets {0 2 4 5 7 9 10 11 12}
    if (tFretting.match(/^d+$/)) {
      for (let s = 0; s < tStrings; s += 1)
        for (let p = 0; p < tPositions; p += 1)
          this.fretNotes[s][p].iscovered = ![
            0, 2, 4, 5, 7, 9, 10, 11, 12,
          ].includes(p % 12);
      // console.log(`matched ^d+$ dulcimer`);
    }

    // implement traditional diatonic mountain dulcimer
    if (tFretting.match(/^t+$/)) {
      for (let s = 0; s < tStrings; s += 1)
        for (let p = 0; p < tPositions; p += 1)
          this.fretNotes[s][p].iscovered = ![0, 2, 4, 5, 7, 9, 10, 12].includes(
            p % 12,
          );
      // console.log(`matched ^t+$ dulcimer`);
    }

    const { isPortrait, noteWidth, noteHeight } = this;

    // grow the displayed notes to cover the covered notes
    // this happens for custom fretting as set up just above
    // and when we're simplifying the fretboard to a specified
    // scale
    for (let s = 0; s < tStrings; s += 1) {
      if (this.isFrettedString(s)) {
        for (let p = 0; p < tPositions; p += 1) {
          // if it is a covered note, just skip it
          /* eslint-disable no-continue */
          if (this.fretNotes[s][p].iscovered) continue;
          /* eslint-enable no-continue */
          // count how many covered fretnotes precede this fretnote
          // and cover them with this fretnote
          let cover = 0;
          while (p > cover && this.fretNotes[s][p - cover - 1].iscovered) {
            // point the covered note to the covering note
            this.fretNotes[s][p - cover - 1] = this.fretNotes[s][p];
            // adjust the location and size of the covering note
            if (isPortrait) {
              this.fretNotes[s][p].y -= noteHeight;
              this.fretNotes[s][p].height += noteHeight;
            } else {
              this.fretNotes[s][p].x -= noteWidth;
              this.fretNotes[s][p].width += noteWidth;
            }
            cover += 1;
          }
        }
      }
    }
  }

  drawNote(obj) {
    // if the obj is blank, make a blank
    if (!obj) return svg``;

    const { offscale } = this;

    const { s, p, cover, isinscale, x, y, c, width, height } = obj;

    // nothing if our column ended early,
    // not sure if this can ever happen
    if (p >= this.fretNotes[s].length) return svg``;

    // if this fretnote is covered, omit
    // don't think this can happen either
    if (cover) return svg``; // omit offscale fretnote

    if (!isinscale) {
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

  makeButton(obj, text) {
    const { x, y, width, height } = obj;
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
        g.note rect {
          rx: 15;
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
    const { top, left, width, height } = this;
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
        <g transform="translate(${left},${top})">
          ${this.fretNotes.map(str =>
            str.map(fretnote => this.drawNote(fretnote)),
          )}
          ${this.timeoutExpired
            ? this.makeButton(this.tuneLoc_decode(this.tuneLoc), '\u2699')
            : svg``}
        </g>
      </svg>
    `;
  }
}
