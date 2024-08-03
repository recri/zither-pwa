import { Constant } from './constant.js';
import { rangeFromZeroToLast, clamp } from './util.js';

// unicode ♭ flat symbol, microscopic
// unicode ♯ sharp symbol, also microscopic
// clamp an octave value to the working range
export const octaveClamp = (octave: number): number => clamp(octave, 0, 9);

// clamp a note value to the working range
export const noteClamp = (note: number): number => clamp(note, 0, 127);

// compute the standard frequency of a midi note number
export const noteToHz = (note: number): number =>
  440.0 * 2 ** ((noteClamp(note) - Constant.notes.A_440) / 12.0);

// cache noteToHz values
const mtofCache = rangeFromZeroToLast(127).map(note => noteToHz(note));

// convert a midi note into a frequency in Hertz
export const mtof = (note: number): number => mtofCache[note];

// compute a note name of a midi note number, and vice versa
// the second translates both flatted and sharped notes
export const noteToName = (note: number, key: string = 'C'): string =>
  (Constant.key.isflat[key] ? Constant.octave.flat : Constant.octave.sharp)[
    note % 12
  ];

export const noteToSolfege = (note: number, key: string = 'C'): string =>
  (Constant.key.isflat[key]
    ? Constant.solfege.lowered
    : Constant.solfege.raised)[note % 12];

export const nameToNote = (name: string): number =>
  Constant.nameToNote[name] - Constant.nameToNote.C;

// compute the standard octave of a midi note number
export const noteToOctave = (note: number): number =>
  octaveClamp(Math.floor(note / 12 - 1));

export const octaveToNote = (octave: number): number =>
  (octaveClamp(octave) + 1) * 12;

// put the two above together
export const noteToNameOctave = (note: number, key: string = 'C') =>
  noteToName(note, key) + noteToOctave(note);

export const noteToScaleDegreeInC = (note: number) =>
    (note + 120 - Constant.notes.middle_C) % 12;

export const noteToScaleDegreeInKey = (note: number, tonic: number) =>
    ((note % 12) - tonic + 12) % 12;

export const degreeIsTonic = (c: number) => c === 0;

export const degreeIsInScale = (c: number, scaleNotes) =>
    scaleNotes.includes(c);

export const noteIsInScale = (note: number, tonic: number, scaleNotes: number[]) => 
    degreeIsInScale(noteToScaleDegreeInKey(note, tonic), scaleNotes);

export const noteIsTonic = (note: number, tonic: number) => (note%12)===(tonic%12);

const noteRegExp = /^([A-G][♯♭#b]?)(-1|[0-9])$/;

export function nameOctaveToNote(nameOctave: string): number {
  const result = noteRegExp.exec(nameOctave);
  if (result)
    return nameToNote(result[1]) + octaveToNote(parseInt(result[2], 10));
  throw new Error(`invalid nameOctave: '${nameOctave}'`);
}
