import { rangeFromZeroToLast } from './util.js';
import { nameOctaveToNote, noteClamp } from './notes.js';

const translate = (noteNamesAndOctaves: Array<string>): Array<number> =>
  noteNamesAndOctaves.map(noteNameAndOctave =>
    nameOctaveToNote(noteNameAndOctave),
  );

//
// result of expand is: [string, [[number]], integer, integer],
// where 'string' is a string which identifies the fretting type of each string,
// '[[number]]' is an array of columns of arrays of midi notes
// which name the note played
// the first integer is the number of columns in the [[number]] array,
// the second integer is the max number of rows in the [[number]] array.
//

function makeString(rootMidi: number, frets: number): number[] {
  return rangeFromZeroToLast(frets - 1).map(i => noteClamp(rootMidi + i));
}

export function expand(
  tuningName: string,
  frets: number,
): [string, number[][], number, number] {
  const tuningList = tuningName.split(','); // tuning array of strings
  const [fretting] = tuningList; // the fretting descriptor
  const midiNotes = translate(tuningList.slice(1)); // array of midi notes
  let result;

  // fretted instrument with optional string count
  result = fretting.match(/^f(\d*)$/)!;
  if (result) {
    const [f1] = result.slice(1).map(n => (n === '' ? 0 : parseInt(n, 10)));
    if (f1 !== 0 && f1 !== midiNotes.length)
      console.log(`length mismatch ${f1} !==  ${midiNotes.length}`);
    return [
      'f'.repeat(midiNotes.length),
      midiNotes.map(note => makeString(note, frets)),
      midiNotes.length,
      frets,
    ];
  }

  // open string instrument with optional note count
  result = fretting.match(/^o(\d*)$/);
  if (result) {
    const [o1] = result.slice(1).map(n => (n === '' ? 0 : parseInt(n, 10)));
    if (o1 !== 0 && o1 !== midiNotes.length)
      console.log(`length mismatch ${o1} !==  ${midiNotes.length}`);
    return ['o'.repeat(midiNotes.length), [midiNotes], 1, midiNotes.length];
  }

  // hammered dulcimer
  result = fretting.match(/^o(\d+)o(\d+)o(\d+)$/);
  if (result) {
    const [o1, o2, o3] = result.slice(1).map(n => parseInt(n, 10));
    console.log(
      `match hammered dulcimer ${fretting} matched ${o1} ${o2} ${o3}`,
    );
    if (o1 + o2 + o3 !== midiNotes.length)
      console.log(`length mismatch ${o1}+${o2}+${o3} !==  ${midiNotes.length}`);
    return [
      'ooo',
      [
        midiNotes.slice(0, o1),
        midiNotes.slice(o1, o1 + o2),
        midiNotes.slice(o1 + o2, o1 + o2 + o3),
      ],
      3,
      Math.max(o1, o2, o3),
    ];
  }

  // mixed fretted/open zither
  result = fretting.match(/^f(\d+)o(\d+)o(\d+)o?(\d*)o?(\d*)$/);
  if (result) {
    const [f1, o1, o2, o3, o4] = result!
      .slice(1)
      .map(n => (n === '' ? 0 : parseInt(n, 10)));
    // zither = f5o12o12 | f5o12o12o6 | f5o12o12o6o3 | f5o12o12o6o6
    console.log(
      `match zithers ${fretting} matched ${f1} ${o1} ${o2} ${o3} ${o4}`,
    );
    if (f1 + o1 + o2 + o3 + o4 !== midiNotes.length)
      console.log(
        `length mismatch ${f1}+${o1}+${o2}+${o3}+${o4} !==  ${midiNotes.length}`,
      );
    const frettedColumns = f1;
    const openColumns =
      (o1 > 0 ? 1 : 0) + (o2 > 0 ? 1 : 0) + (o3 > 0 ? 1 : 0) + (o4 > 0 ? 1 : 0);
    const columns = midiNotes.slice(f1).map(note => makeString(note, frets));
    if (o1 > 0) columns.push(midiNotes.slice(f1, f1 + o1));
    if (o2 > 0) columns.push(midiNotes.slice(f1 + o1, f1 + o1 + o2));
    if (o3 > 0) columns.push(midiNotes.slice(f1 + o1 + o2, f1 + o1 + o2 + o3));
    if (o4 > 0)
      columns.push(midiNotes.slice(f1 + o1 + o2 + o3, f1 + o1 + o2 + o3 + o4));
    return [
      `${'f'.repeat(frettedColumns)}${'o'.repeat(openColumns)}`,
      columns,
      frettedColumns + openColumns,
      Math.max(frets, o1, o2, o3, o4),
    ];
  }

  // 5-string banjo bf4
  result = fretting.match(/^bf(\d*)$/);
  if (result) {
    const [f1] = result.slice(1).map(n => (n === '' ? 0 : parseInt(n, 10)));
    if (f1 !== 0 && f1 + 1 !== midiNotes.length)
      console.log(`length mismatch ${f1}+1 !==  ${midiNotes.length}`);
    return [
      `b${'f'.repeat(midiNotes.length - 1)}`,
      midiNotes.map(note => makeString(note, frets)),
      midiNotes.length,
      frets,
    ];
  }

  // dulcimer [cdt](\d+) (chromatic, diatonic, traditional)
  result = fretting.match(/^[cdt](\d*)$/);
  if (result) {
    const [c1] = fretting.slice(0, 1);
    const [f1] = result.slice(1).map(n => (n === '' ? 0 : parseInt(n, 10)));
    if (f1 !== 0 && f1 !== midiNotes.length)
      console.log(`length mismatch ${f1} !==  ${midiNotes.length}`);
    return [
      c1.repeat(midiNotes.length),
      midiNotes.map(note => makeString(note, frets)),
      midiNotes.length,
      frets,
    ];
  }

  console.log(`unmatched fretting pattern ${fretting}`);
  return expand('f,E2,A2,D3,G3,B3,E4', frets);
}
