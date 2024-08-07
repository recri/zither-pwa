const notemask = 127;
const covered = 128;
const playable = 255;
const muted = 256;
const fretted = 512;
const button = 1024;

export class Fretnote {
  /* eslint-disable no-bitwise */

  constructor(note, iscovered = false, ismuted = false, isbutton = false) {
    this.packed =
      (iscovered ? covered : 0) |
      (ismuted ? muted : 0) |
      (isbutton ? button : 0) |
      (note & 127);
  }

  private packed: number = 0;

  // is the fretnote playable?
  isplayable() {
    return this.packed <= playable;
  }

  // the midi note that this frenote sounds
  get note() {
    return this.packed & notemask;
  }

  set note(val) {
    this.packed = (this.packed & ~notemask) | (val & notemask);
  }

  // is a fretnote which is not played
  get ismuted() {
    return (this.packed & muted) !== 0;
  }

  set ismuted(val) {
    this.packed = (this.packed & ~muted) | (val ? muted : 0);
  }

  // is a fretnote which is covered by another fretnote
  get iscovered() {
    return (this.packed & covered) !== 0;
  }

  set iscovered(val) {
    this.packed = (this.packed & ~covered) | (val ? covered : 0);
  }

  // is a fretnote on a fretted, as opposed to open, string
  get isfretted() {
    return (this.packed & fretted) !== 0;
  }

  set isfretted(val) {
    this.packed = (this.packed & ~fretted) | (val ? fretted : 0);
  }

  // is a button sometimes displayed in place of the fret note
  get isbutton() {
    return (this.packed & button) !== 0;
  }

  set isbutton(val) {
    this.packed = (this.packed & ~button) | (val ? button : 0);
  }

  /* eslint-enable no-bitwise */
}
