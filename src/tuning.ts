import { rangeFromZeroToLast } from './util.js';
import { nameOctaveToNote, noteClamp } from './notes.js';
import { Fretnote } from './fretnote.js';

const translate = (noteNamesAndOctaves: Array<string>): Fretnote[] =>
  noteNamesAndOctaves.map(
    noteNameAndOctave => new Fretnote(nameOctaveToNote(noteNameAndOctave)),
  );

/* make an array of chromatically fretted midi notes */
function makeString(
  rootMidi: number,
  frets: number,
  transpose: number,
): Fretnote[] {
  return rangeFromZeroToLast(frets - 1).map(
    i => new Fretnote(noteClamp(rootMidi + transpose + i)),
  );
}

//
// result of expand is: [string, [[number]], integer, integer],
// where 'string' is a string which identifies the fretting type of each string,
// '[[number]]' is an array of columns of arrays of midi notes
// which name the note played
// the first integer is the number of columns in the [[number]] array,
// the second integer is the max number of rows in the [[number]] array.
//

export function expand(
  tuningName: string,
  frets: number,
  transpose: number,
): [string, Fretnote[][], number, number] {
  const tuningList = tuningName.split(','); // tuning array of strings
  const [fretting] = tuningList; // the fretting descriptor
  const midiNotes = translate(tuningList.slice(1)); // array of midi notes
  let result;

  // console.log(`expand tuningName ${tuningName}`);
  // console.log(`tuningList  ${tuningList}`);
  // console.log(`midiNotes ${midiNotes.map(n => noteToNameOctave(n))}`);

  // fretted instrument with optional string count
  // should transpose, makeString does transpose
  result = fretting.match(/^f(\d*)$/)!;
  if (result) {
    const [f1] = result.slice(1).map(n => (n === '' ? 0 : parseInt(n, 10)));
    if (f1 !== 0 && f1 !== midiNotes.length)
      console.log(`length mismatch ${f1} !==  ${midiNotes.length}`);
    return [
      'f'.repeat(midiNotes.length),
      midiNotes.map(note => makeString(note.note, frets, transpose)),
      midiNotes.length,
      frets,
    ];
  }

  // open string instrument with optional note count
  // open string should transpose, does transpose
  result = fretting.match(/^o(\d*)$/);
  if (result) {
    const [o1] = result.slice(1).map(n => (n === '' ? 0 : parseInt(n, 10)));
    if (o1 !== 0 && o1 !== midiNotes.length)
      console.log(`length mismatch ${o1} !==  ${midiNotes.length}`);
    return [
      'o'.repeat(midiNotes.length),
      [midiNotes.map(note => new Fretnote(noteClamp(note.note + transpose)))],
      1,
      midiNotes.length,
    ];
  }

  // hammered dulcimer
  // should transpose, does transpose
  result = fretting.match(/^o(\d+)o(\d+)o(\d+)$/);
  if (result) {
    const [o1, o2, o3] = result.slice(1).map(n => parseInt(n, 10));
    // console.log(`match hammered dulcimer ${fretting} matched ${o1} ${o2} ${o3}`);
    if (o1 + o2 + o3 !== midiNotes.length)
      console.log(`length mismatch ${o1}+${o2}+${o3} !==  ${midiNotes.length}`);
    return [
      'ooo',
      [
        midiNotes
          .slice(0, o1)
          .map(note => new Fretnote(noteClamp(note.note + transpose))),
        midiNotes
          .slice(o1, o1 + o2)
          .map(note => new Fretnote(noteClamp(note.note + transpose))),
        midiNotes
          .slice(o1 + o2, o1 + o2 + o3)
          .map(note => new Fretnote(noteClamp(note.note + transpose))),
      ],
      3,
      Math.max(o1, o2, o3),
    ];
  }

  // mixed fretted/open zither
  // fretted part transposes, drone strings should not transpose, that is what happens
  result = fretting.match(/^f(\d+)o(\d+)o(\d+)o?(\d*)o?(\d*)$/);
  if (result) {
    const [f1, o1, o2, o3, o4] = result!
      .slice(1)
      .map(n => (n === '' ? 0 : parseInt(n, 10)));
    // zither = f5o12o12 | f5o12o12o6 | f5o12o12o6o3 | f5o12o12o6o6
    // console.log(`match zithers ${fretting} matched ${f1} ${o1} ${o2} ${o3} ${o4}`);
    if (f1 + o1 + o2 + o3 + o4 !== midiNotes.length)
      console.log(
        `length mismatch ${f1}+${o1}+${o2}+${o3}+${o4} !==  ${midiNotes.length}`,
      );
    const frettedColumns = f1;
    const openColumns =
      (o1 > 0 ? 1 : 0) + (o2 > 0 ? 1 : 0) + (o3 > 0 ? 1 : 0) + (o4 > 0 ? 1 : 0);
    const columns = midiNotes
      .slice(f1)
      .map(note => makeString(note.note, frets, transpose));
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

  // 5-string banjo with optional string count
  // should transpose, makeString does transpose
  result = fretting.match(/^b(\d*)$/);
  if (result) {
    const [b1] = result.slice(1).map(n => (n === '' ? 0 : parseInt(n, 10)));
    if (b1 !== 0 && b1 !== midiNotes.length)
      console.log(`length mismatch ${b1} !==  ${midiNotes.length}`);
    return [
      `${'b'.repeat(midiNotes.length)}`,
      midiNotes.map(note => makeString(note.note, frets, transpose)),
      midiNotes.length,
      frets,
    ];
  }

  // dulcimer [fdt](\d+) (chromatic, diatonic, traditional)
  // should transpose, does transpose
  result = fretting.match(/^[cdt](\d*)$/);
  if (result) {
    const [c1] = fretting.slice(0, 1);
    const [f1] = result.slice(1).map(n => (n === '' ? 0 : parseInt(n, 10)));
    if (f1 !== 0 && f1 !== midiNotes.length)
      console.log(`length mismatch ${f1} !==  ${midiNotes.length}`);
    return [
      c1.repeat(midiNotes.length),
      midiNotes.map(note => makeString(note.note, frets, transpose)),
      midiNotes.length,
      frets,
    ];
  }

  console.log(`unmatched fretting pattern ${fretting}`);
  return expand('f,E2,A2,D3,G3,B3,E4', frets, transpose);
}
