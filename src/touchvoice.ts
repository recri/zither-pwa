/* eslint-disable no-use-before-define */
/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { Fretboard } from './zither-fretboard.js';
import { Fretnote } from './fretnote.js';

//
// a touch voice is allocated at the beginning of touch event,
// updated during touch move events,
// and destroyed at the end of touch of event
//
export class TouchVoice {
  touch: Touch; // Touch from TouchEvent.changedTouches

  fretboard: Fretboard; // fretboard we're voicing

  fretnote: Fretnote; // the note assigned to our position

  s: number; // string (decoded from x,y)

  p: number; // fret position (decoded from x,y)

  dx: number; // residual x in fret box (decoded from x,y)

  dy: number; // residual y in fret box (decoded from x,y)

  static map: Map<number, TouchVoice> = new Map();

  constructor(
    touch: Touch,
    fretboard: Fretboard,
    fretnote: Fretnote,
    s: number,
    p: number,
    dx: number,
    dy: number,
  ) {
    this.touch = touch;
    this.fretboard = fretboard;
    this.fretnote = fretnote;
    this.s = s;
    this.p = p;
    this.dx = dx;
    this.dy = dy;
    this.touch = touch;
  }

  get identifier() {
    return this.touch.identifier;
  }

  get clientX() {
    return this.touch.clientX;
  }

  get clientY() {
    return this.touch.clientY;
  }

  tv_start() {
    TouchVoice.map.set(this.identifier, this);
    this.fretboard.app.audioNode!.keyOn(
      1,
      this.fretnote.note,
      this.fretboard.velocity,
    );
  }

  tv_move(
    touch: Touch,
    fretnote: Fretnote,
    s: number,
    p: number,
    dx: number,
    dy: number,
  ) {}

  tv_end(
    touch: Touch,
    fretnote: Fretnote,
    s: number,
    p: number,
    dx: number,
    dy: number,
  ) {
    this.fretboard.app.audioNode!.keyOff(1, this.fretnote.note, 0);
    TouchVoice.map.delete(this.identifier);
  }

  static notouch(ev) {
    console.log(`no touch found ${ev}`);
  }

  static notouchvoice(ev) {
    console.log(`no touch voice found ${ev}`);
  }

  static touch_start(ev: TouchEvent, fretboard: Fretboard) {
    const touch = ev.changedTouches.item(0);
    if (!touch) {
      TouchVoice.notouch(ev);
      return;
    }
    const [s, p, dx, dy] = fretboard.touch_decode_xy(ev);
    const fretnote = fretboard.fretnote(s, p);
    if (fretnote.ismuted) return;
    const touchvoice = new TouchVoice(touch, fretboard, fretnote, s, p, dx, dy);
    if (!touchvoice) {
      TouchVoice.notouchvoice(ev);
      return;
    }
    touchvoice.tv_start();
  }

  static touch_move(ev) {
    const touch = ev.changedTouches.item(0);
    if (!touch) {
      TouchVoice.notouch(ev);
      return;
    }
    const touchvoice = TouchVoice.map.get(touch.identifier);
    if (!touchvoice) {
      TouchVoice.notouchvoice(ev);
      return;
    }
    const [s, p, dx, dy] = touchvoice.fretboard.touch_decode_xy(ev);
    const fretnote = touchvoice.fretboard.fretnote(s, p);
    touchvoice.tv_move(touch, fretnote, s, p, dx, dy);
  }

  static touch_end(ev) {
    const touch = ev.changedTouches.item(0);
    if (!touch) {
      TouchVoice.notouch(ev);
      return;
    }
    const touchvoice = TouchVoice.map.get(touch.identifier);
    if (!touchvoice) {
      TouchVoice.notouchvoice(ev);
      return;
    }
    const [s, p, dx, dy] = touchvoice.fretboard.touch_decode_xy(ev);
    const fretnote = touchvoice.fretboard.fretnote(s, p);
    if (fretnote.ismuted) return;
    touchvoice.tv_end(touch, fretnote, s, p, dx, dy);
    // console.log(`keyOff ${this.note(s,p)}`);
  }
}
/* eslint-enable no-use-before-define */
/* eslint-enable class-methods-use-this */
/* eslint-enable @typescript-eslint/no-unused-vars */
