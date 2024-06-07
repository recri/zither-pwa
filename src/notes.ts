import { Constant } from './constant.js';

// unicode ♭ flat symbol, microscopic
// unicode ♯ sharp symbol, also microscopic
// clamp an octave value to the working range
export const octaveClamp = (octave: number): number =>
  Math.min(9, Math.max(0, octave));

// clamp a note value to the working range
export const noteClamp = (note: number): number =>
  Math.min(127, Math.max(0, note));

// compute the standard frequency of a midi note number
export const noteToHz = (note: number): number =>
  440.0 * 2 ** ((noteClamp(note) - Constant.notes.A_440) / 12.0);

// cache noteToHz values
const mtofCache = Array(128).fill(0);

function updateMtofCache(note: number): number {
  mtofCache[note] = noteToHz(note);
  return mtofCache[note];
}

// convert a midi note into a frequency in Hertz
export const mtof = (note: number): number =>
  mtofCache[note] === 0 ? updateMtofCache(note) : mtofCache[note];

// compute a note name of a midi note number, and vice versa
// the second translates both flatted and sharped notes
export const noteToName = (
  note: number,
  key: number = Constant.notes.C0
): string =>
  (Constant.key.isflat[key % 12]
    ? Constant.octave.flat
    : Constant.octave.sharp)[note % 12];

export const nameToNote = (name: string): number =>
  Constant.nameToNote[name] - Constant.nameToNote.C;

// compute the standard octave of a midi note number
export const noteToOctave = (note: number): number =>
  octaveClamp(Math.floor(note / 12 - 1));

export const octaveToNote = (octave: number): number =>
  (octaveClamp(octave) + 1) * 12;

// put the two above together
export const noteToNameOctave = (
  note: number,
  key: number = Constant.notes.C0
) => noteToName(note, key) + noteToOctave(note);

const noteRegExp = /^([A-G][#b]?)(-1|[0-9])$/;

export function nameOctaveToNote(nameOctave: string): number {
  const result = noteRegExp.exec(nameOctave);
  if (result)
    return nameToNote(result[1]) + octaveToNote(parseInt(result[2], 10));
  throw new Error(`invalid nameOctave: '${nameOctave}'`);
}
