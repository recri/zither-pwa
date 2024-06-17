import { nameOctaveToNote } from './notes.js';

const translate = (noteNamesAndOctaves: Array<string>): Array<number> =>
  noteNamesAndOctaves.map(noteNameAndOctave =>
    nameOctaveToNote(noteNameAndOctave),
  );

export function expandTuning(tuningName: string): Array<number> {
  switch (tuningName) {
    default:
      return translate(tuningName.split(',').slice(1));
  }
}

export function expandFretting(
  tuningName: string,
  tuningNotes: Array<number>,
): string {
  let [fretting] = tuningName.split(',');
  while (fretting.length < tuningNotes.length)
    fretting += fretting[fretting.length - 1];
  return fretting;
}
