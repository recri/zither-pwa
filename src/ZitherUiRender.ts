import { html } from 'lit';
import { TemplateResult } from 'lit-html';

import type {
  FaustUIDescriptor,
  FaustUIGroup,
  FaustUIInputItem,
  FaustUIOutputItem,
  FaustUIItem,
  FaustUIMeta,
} from './faust/faustwasm';

import { ZitherUiRoot } from './zither-ui-root.js';

/*
 ** the faust ui meta element contains all the overflow from the
 ** original ui definition.  It consists of an array of Object
 ** which this flattens into an object and an enumeration.
 ** This function originally from faust-ui/src/components/group.ts
 */
function parseMeta(metaIn: FaustUIMeta[]): {
  metaObject: FaustUIMeta;
  enums?: { [key: string]: number };
} {
  const metaObject: FaustUIMeta = {};
  if (!metaIn) return { metaObject };
  metaIn.forEach(m => Object.assign(metaObject, m));
  if (metaObject.style) {
    const enumsRegex =
      /\{(?:(?:'|_|-)(.+?)(?:'|_|-):([-+]?[0-9]*\.?[0-9]+?);)+(?:(?:'|_|-)(.+?)(?:'|_|-):([-+]?[0-9]*\.?[0-9]+?))\}/;
    const matched = metaObject.style.match(enumsRegex);
    if (matched) {
      const itemsRegex = /(?:(?:'|_|-)(.+?)(?:'|_|-):([-+]?[0-9]*\.?[0-9]+?))/g;
      const enums: { [key: string]: number } = {};
      let item;
      // eslint-disable-next-line no-cond-assign
      while ((item = itemsRegex.exec(matched[0]))) {
        enums[item[1]] = +item[2];
      }
      return { metaObject, enums };
    }
  }
  return { metaObject };
}

function styleOf(j: FaustUIItem, metaObject: FaustUIMeta) {
  if (metaObject.style) {
    console.log(`styleOf ${j.type} has style ${metaObject.style}`);
    if (metaObject.style.startsWith('knob')) return 'knob';
    if (metaObject.style.startsWith('menu')) return 'menu';
    if (metaObject.style.startsWith('radio')) return 'radio';
    if (metaObject.style.startsWith('led')) return 'led';
    if (metaObject.style.startsWith('numerical')) return 'numerical';
    console.log(
      `styleOf found meta.style ${metaObject.style} but did not match, returning ${j.type}`
    );
  }
  return j.type;
}

export function renderType(
  i: FaustUIItem,
  context: string,
  top: ZitherUiRoot
): TemplateResult {
  if (i.type.endsWith('group')) {
    console.log(`renderType ${i.type} label ${i.label}`);
    return html`
<zither-ui-${i.type}
  .top=${top}
  .context=${context}
  .label=${i.label}
  .ui=${i}>
    ${(i as FaustUIGroup).items.map(j => renderType(j, i.type, top))}
</zither-ui-${i.type}>`;
  }
  const { metaObject } = parseMeta(
    (i as FaustUIInputItem | FaustUIOutputItem).meta || []
  );
  const style = styleOf(i as FaustUIInputItem | FaustUIOutputItem, metaObject);
  console.log(`renderType ${i.type} label ${i.label} in style ${style}`);
  return html`
<zither-ui-${style} 
  .top=${top}
  .context=${context}
  .label=${i.label}
  .ui=${i}
  .metaObject=${metaObject}>
</zither-ui-${style}>`;
}

export function renderUi(
  ui: FaustUIDescriptor,
  top: ZitherUiRoot
): TemplateResult {
  console.log(`renderUi with ${ui.length} top level parts`);
  return html`<zither-ui>${ui.map(i => renderType(i, '', top))}</zither-ui>`;
}
