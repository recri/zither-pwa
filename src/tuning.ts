import { nameOctaveToNote } from './notes.js';

const translate = (noteNamesAndOctaves: Array<string>): Array<number> =>
  noteNamesAndOctaves.map(noteNameAndOctave =>
    nameOctaveToNote(noteNameAndOctave),
  );

export function expandTuning(tuningName: string): Array<number> {
  switch (tuningName) {
    case 'EADG':
      return translate(['E1', 'A1', 'D2', 'G2']);
    case 'BEADG':
      return translate(['B0', 'E1', 'A1', 'D2', 'G2']);
    case 'EADGC':
      return translate(['E1', 'A1', 'D2', 'G2', 'C3']);
    case 'EADGBE':
      return translate(['E2', 'A2', 'D3', 'G3', 'B3', 'E4']);
    case 'EADGCF':
      return translate(['E2', 'A2', 'D3', 'G3', 'C4', 'F4']);
    default:
      return translate(tuningName.split(','));
  }
}
