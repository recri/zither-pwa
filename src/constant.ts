// unicode ♭ flat symbol, microscopic
// unicode ♯ sharp symbol, also microscopic

const notes: { [key: string]: number } = {
  lowest: 0,
  lowest_piano: 21,
  lowest_bass_clef: 43,
  highest_bass_clef: 57,
  middle_C: 60,
  lowest_treble_clef: 64,
  A_440: 69,
  highest_treble_clef: 77,
  highest_piano: 108,
  highest: 127,

  C: 60,
  C_sharp: 61,
  D_flat: 61,
  D: 62,
  D_sharp: 63,
  E_flat: 63,
  E: 64,
  F: 65,
  F_sharp: 66,
  G_flat: 66,
  G: 67,
  G_sharp: 68,
  A_flat: 68,
  A: 69,
  A_sharp: 70,
  B_flat: 70,
  B: 71,

  // names for all midi notes
  'C-1': 0,
  'C♯-1': 1,
  'D-1': 2,
  'D♯-1': 3,
  'E-1': 4,
  'F-1': 5,
  'F♯-1': 6,
  'G-1': 7,
  'G♯-1': 8,
  'A-1': 9,
  'A♯-1': 10,
  'B-1': 11,
  C0: 12,
  'C♯0': 13,
  D0: 14,
  'D♯0': 15,
  E0: 16,
  F0: 17,
  'F♯0': 18,
  G0: 19,
  'G♯0': 20,
  A0: 21,
  'A♯0': 22,
  B0: 23,
  C1: 24,
  'C♯1': 25,
  D1: 26,
  'D♯1': 27,
  E1: 28,
  F1: 29,
  'F♯1': 30,
  G1: 31,
  'G♯1': 32,
  A1: 33,
  'A♯1': 34,
  B1: 35,
  C2: 36,
  'C♯2': 37,
  D2: 38,
  'D♯2': 39,
  E2: 40,
  F2: 41,
  'F♯2': 42,
  G2: 43,
  'G♯2': 44,
  A2: 45,
  'A♯2': 46,
  B2: 47,
  C3: 48,
  'C♯3': 49,
  D3: 50,
  'D♯3': 51,
  E3: 52,
  F3: 53,
  'F♯3': 54,
  G3: 55,
  'G♯3': 56,
  A3: 57,
  'A♯3': 58,
  B3: 59,
  C4: 60,
  'C♯4': 61,
  D4: 62,
  'D♯4': 63,
  E4: 64,
  F4: 65,
  'F♯4': 66,
  G4: 67,
  'G♯4': 68,
  A4: 69,
  'A♯4': 70,
  B4: 71,
  C5: 72,
  'C♯5': 73,
  D5: 74,
  'D♯5': 75,
  E5: 76,
  F5: 77,
  'F♯5': 78,
  G5: 79,
  'G♯5': 80,
  A5: 81,
  'A♯5': 82,
  B5: 83,
  C6: 84,
  'C♯6': 85,
  D6: 86,
  'D♯6': 87,
  E6: 88,
  F6: 89,
  'F♯6': 90,
  G6: 91,
  'G♯6': 92,
  A6: 93,
  'A♯6': 94,
  B6: 95,
  C7: 96,
  'C♯7': 97,
  D7: 98,
  'D♯7': 99,
  E7: 100,
  F7: 101,
  'F♯7': 102,
  G7: 103,
  'G♯7': 104,
  A7: 105,
  'A♯7': 106,
  B7: 107,
  C8: 108,
  'C♯8': 109,
  D8: 110,
  'D♯8': 111,
  E8: 112,
  F8: 113,
  'F♯8': 114,
  G8: 115,
  'G♯8': 116,
  A8: 117,
  'A♯8': 118,
  B8: 119,
  C9: 120,
  'C♯9': 121,
  D9: 122,
  'D♯9': 123,
  E9: 124,
  F9: 125,
  'F♯9': 126,
  G9: 127,
};

const nameToNote: { [key: string]: number } = {
  C: 60,
  'C♯': 61,
  'D♭': 61,
  D: 62,
  'D♯': 63,
  'E♭': 63,
  E: 64,
  F: 65,
  'F♯': 66,
  'G♭': 66,
  G: 67,
  'G♯': 68,
  'A♭': 68,
  A: 69,
  'A♯': 70,
  'B♭': 70,
  B: 71,
};

const octave: { [key: string]: Array<string> } = {
  // 12 tone octave written with sharps
  sharp: ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'],
  // 12 tone octave written with flats
  flat: ['C', 'D♭', 'D', 'E♭', 'E', 'F', 'G♭', 'G', 'A♭', 'A', 'B♭', 'B'],
};

const solfege: { [key: string]: Array<string> } = {
  raised: [
    'do',
    'di',
    're',
    'ri',
    'mi',
    'fa',
    'fi',
    'sol',
    'si',
    'la',
    'li',
    'ti',
  ],
  lowered: [
    'do',
    'ra',
    're',
    'me',
    'mi',
    'fa',
    'se',
    'sol',
    'le',
    'la',
    'te',
    'ti',
  ],
};

// octave number and semitone offset from middle_C
const octaveOffset: { [key: number]: number } = {
  '-1': -60,
  0: -48,
  1: -36,
  2: -24,
  3: -12,
  4: 0,
  5: 12,
  6: 24,
  7: 36,
  8: 48,
  9: 60,
};

const key: { [key: string]: { [key: string]: number } } = {
  // keys in cycle of fifths order with semitone offset from C
  keys: {
    'G♭': 6,
    'D♭': 1,
    'A♭': 8,
    'E♭': 3,
    'B♭': 10,
    F: 5,
    C: 0,
    G: 7,
    D: 2,
    A: 9,
    E: 4,
    B: 11,
    'F♯': 6,
    'C♯': 1,
  },
  // keys which should be written with flats
  isflat: {
    'G♭': 1,
    'D♭': 1,
    'A♭': 1,
    'E♭': 1,
    'B♭': 1,
    F: 1,
    C: 0,
    G: 0,
    D: 0,
    A: 0,
    E: 0,
    B: 0,
    'F♯': 0,
    'C♯': 0,
  },
};

// modern modes, names and semitone offsets of scale notes from root
const scales: { [key: string]: Array<number> } = {
  ionian: [0, 2, 4, 5, 7, 9, 11, 12],
  dorian: [0, 2, 3, 5, 7, 9, 10, 12],
  phrygian: [0, 1, 3, 5, 7, 8, 10, 12],
  lydian: [0, 2, 4, 6, 7, 9, 11, 12],
  mixolydian: [0, 2, 4, 5, 7, 9, 10, 12],
  aeolian: [0, 2, 3, 5, 7, 8, 10, 12],
  locrian: [0, 1, 3, 5, 6, 8, 10, 12],
  major: [0, 2, 4, 5, 7, 9, 11, 12],
  naturalminor: [0, 2, 3, 5, 7, 8, 10, 12],
  harmonicminor: [0, 2, 3, 5, 7, 8, 11, 12],
  jazzminor: [0, 2, 3, 5, 7, 9, 11, 12],
  major5note: [0, 2, 4, 7, 9, 12],
  bluesmajor5note: [0, 2, 5, 7, 9, 12],
  suspended5note: [0, 2, 5, 7, 10, 12],
  minor5note: [0, 3, 5, 7, 10, 12],
  bluesminor5note: [0, 3, 5, 8, 10, 12],
  bluesminor6note: [0, 3, 5, 6, 7, 10, 12],
  bluesmajor6note: [0, 2, 3, 4, 7, 9, 12],
  blues7note: [0, 2, 3, 5, 6, 9, 10, 12],
  harmonicmajor: [0, 2, 4, 5, 7, 8, 11, 12],
  blues9note: [0, 2, 3, 4, 5, 7, 9, 10, 11, 12],
  chromatic: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10.11, 12],
};

const palettes: { [key: string]: Array<string> } = {
  bamO: [
    '#4f2f43',
    '#793f6b',
    '#a05e91',
    '#c285b2',
    '#d8b0ca',
    '#d9c8ca',
    '#cfcdbb',
    '#abb88f',
    '#839165',
    '#676e4d',
    '#53503f',
    '#493c3a',
  ],
  brocO: [
    '#362f37',
    '#363957',
    '#415780',
    '#617fa5',
    '#8aa4bf',
    '#b5c4d0',
    '#cfd4c5',
    '#c2c39b',
    '#9f9e6c',
    '#757445',
    '#53512d',
    '#3f3829',
  ],
  corkO: [
    '#3f3e3a',
    '#3d3f51',
    '#445578',
    '#5f7a9f',
    '#849eba',
    '#a6bdc8',
    '#afcbbc',
    '#96be99',
    '#73a36e',
    '#547d43',
    '#465d2e',
    '#41492e',
  ],
  romaO: [
    '#733957',
    '#823b3d',
    '#944f2d',
    '#aa752f',
    '#c3a34b',
    '#d5cf81',
    '#cbe2b3',
    '#a4d8cc',
    '#74bbce',
    '#5393bf',
    '#516ba5',
    '#62497d',
  ],
  vikO: [
    '#4f193d',
    '#3f2b5b',
    '#334b7f',
    '#4575a1',
    '#759ebc',
    '#aebdc8',
    '#d5bfb3',
    '#d7a387',
    '#c57b56',
    '#a14b2b',
    '#7a251e',
    '#611527',
  ],
  blue: [
    '#012146',
    '#012c52',
    '#01385d',
    '#014369',
    '#014e75',
    '#015980',
    '#01648c',
    '#007097',
    '#007ba3',
    '#0086ae',
    '#0091ba',
    '#009cc6',
  ],
  green: [
    '#014621',
    '#01522c',
    '#015d38',
    '#016943',
    '#01754e',
    '#018059',
    '#018c64',
    '#009770',
    '#00a37b',
    '#00ae86',
    '#00ba91',
    '#00c69c',
  ],
  fire: [
    '#ff5a00',
    '#ff6400',
    '#ff6f00',
    '#ff7900',
    '#ff8300',
    '#ff8e00',
    '#ff9800',
    '#ffa200',
    '#ffad00',
    '#ffb700',
    '#ffc100',
    '#ffcc00',
  ],
  magenta: [
    '#460121',
    '#52012c',
    '#5d0138',
    '#690143',
    '#75014e',
    '#800159',
    '#8c0164',
    '#970070',
    '#a3007b',
    '#ae0086',
    '#ba0091',
    '#c6009c',
  ],
  gray: [
    '#000000',
    '#060606',
    '#0B0B0B',
    '#111111',
    '#171717',
    '#1D1D1D',
    '#232323',
    '#292929',
    '#2E2E2E',
    '#343434',
    '#3A3A3A',
    '#404040',
  ],
  none: [
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
    '#000000',
  ],
};

const textForPalettes: { [key: string]: string } = {
  bamO: 'gray',
  brocO: 'gray',
  corkO: 'gray',
  romaO: 'gray',
  vikO: 'gray',
  blue: 'white',
  green: 'white',
  fire: 'gray',
  magenta: 'white',
  gray: 'white',
  none: 'white',
};

// default values

const defaultValues: { [key: string]: string } = {
  fullscreen: 'true', // draw fretboard in fullscreen
  frets: '13', // one octave to start
  transpose: '0', // in standard offset
  velocity: '114', // midi note on velocity
  poly: '10', // midi polyphony number of voices
  panangle: '0.5', //
  spatialwidth: '0.5', //
  dynamiclevel: '-10', // level for levelfilter
  brightness: '0.5', // brightness
  decaytime: '4', // decay time of notes
  pickangle: '0', // pick angle
  pickposition: '0.13', // pick position
  markkeytime: '5', // seconds of inactivity before tune button reappears
  //  defaultTuning: 'f,E2,A2,D3,G3,C4,F4', // all fourths tuning
  tuning: 'f,B0,E1,A1,D2,G2,C3,F3,A♯3', // 'bass 8 low'
  tonic: 'C', // key of C
  scale: 'ionian', // C Major scale
  colors: 'gray',
  offscale: 'show',
  labels: 'note',
  dspName: 'eks', // extended karplus strong from freeaxe
  top: '1',
  right: '1',
  bottom: '1',
  left: '1',
  logTouch: 'false',
};

export const Constant = {
  defaultValues,
  dspNames: ['eks'],
  notes,
  nameToNote,
  octave,
  solfege,
  octaveOffset,
  key,
  scales,
  palettes,
  textForPalettes,
};
