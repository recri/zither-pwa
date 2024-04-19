import { nameOctaveToNote } from './notes.js';

const translate = (noteNamesAndOctaves: Array<string>): Array<number> =>
  noteNamesAndOctaves.map(noteNameAndOctave =>
    nameOctaveToNote(noteNameAndOctave)
  );

export function expandTuning(
  courses: number,
  strings: number,
  tuningName: string
): Array<number> {
  switch (courses) {
    case 4:
      switch (strings) {
        case 1: // four courses of one string each
          switch (tuningName) {
            case 'EADG':
              return translate(['E1', 'A1', 'D2', 'G2']);
            default:
              break;
          }
          break;
        case 2: // four courses of two strings each
          switch (tuningName) {
            case 'EADG':
              return translate([
                'E2',
                'E1',
                'A2',
                'A1',
                'D3',
                'D2',
                'G3',
                'G2',
              ]);
            default:
              break;
          }
          break;
        case 3: // four courses of three strings each
          switch (tuningName) {
            case 'EADG':
              return translate([
                'E2',
                'E2',
                'E1',
                'A2',
                'A2',
                'A1',
                'D3',
                'D3',
                'D2',
                'G3',
                'G3',
                'G2',
              ]);
            default:
              break;
          }
          break;
        default:
          break;
      }
      break;

    case 6:
      switch (strings) {
        case 1: // six courses of one string each
          switch (tuningName) {
            case 'EADGBE':
              return translate(['E2', 'A2', 'D3', 'G3', 'B3', 'E4']);
            default:
              break;
          }
          break;
        case 2: // six courses of two strings each
          switch (tuningName) {
            case 'EADGBE':
              return translate([
                'E2',
                'E1',
                'A2',
                'A1',
                'D3',
                'D2',
                'G3',
                'G2',
                'B3',
                'B3',
                'E4',
                'E4',
              ]);
            default:
              break;
          }
          break;
        default:
          break;
      }
      break;
    default:
      break;
  }
  return [];
}
