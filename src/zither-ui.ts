/* eslint-disable no-use-before-define */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable camelcase */

import { html, css, LitElement } from 'lit';
import { property, customElement } from 'lit/decorators.js';

import type {
  FaustUIDescriptor,
  FaustUIItem,
  FaustUIMeta,
  FaustUIGroup,
  FaustUIInputItem,
  FaustUIOutputItem,
} from './faust/faustwasm';

import './zither-ui-button.js';
import './zither-ui-checkbox.js';
import './zither-ui-hbargraph.js';
import './zither-ui-hgroup.js';
import './zither-ui-hslider.js';
import './zither-ui-knob.js';
import './zither-ui-led.js';
import './zither-ui-menu.js';
import './zither-ui-nentry.js';
import './zither-ui-numerical.js';
import './zither-ui-radio.js';
import './zither-ui-soundfile.js';
import './zither-ui-tgroup.js';
import './zither-ui-vbargraph.js';
import './zither-ui-vgroup.js';
import './zither-ui-vslider.js';

import { ZitherUiValueComponent } from './ZitherUiValueComponent.js';

/*
 ** The only zither-ui component that actually needs
 ** to be instantiated.  Given a FaustUIDescriptor
 ** as its sole property, it unrolls all the parts
 ** from there.  In the unrolling, all the other
 ** components get pulled in and instantiated as
 ** required.
 */
@customElement('zither-ui')
export class ZitherUi extends LitElement {
  /*
   ** the faust ui meta element contains all the overflow from the
   ** original ui definition.  It consists of an array of Object
   ** which this flattens into an object and an enumeration.
   ** This function originally from faust-ui/src/components/group.ts
   */
  static parseMeta(metaIn: FaustUIMeta[]): {
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
        const itemsRegex =
          /(?:(?:'|_|-)(.+?)(?:'|_|-):([-+]?[0-9]*\.?[0-9]+?))/g;
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

  /* css variables that coud be set in the root html
      --zither-ui-text-color
      --zither-ui-background-color
      --zither-ui-foreground-color
      --zither-ui-font
      --zither-ui-font-size
    */

  static styles = css`
    :host {
      display: block;
      padding: 25px;
      color: var(--zither-ui-text-color, #000);
    }
  `;

  @property({ type: Object }) ui!: FaustUIDescriptor;

  @property({ type: Boolean }) listenWindowMessage: boolean = true;

  hostWindow: Window | null = null;

  /**
   * The constructor listener and the three following methods
   * are lifted from faust-ui.
   */
  constructor() {
    super();
    if (this.listenWindowMessage === true) {
      window.addEventListener('message', e => {
        const { data, source } = e;
        this.hostWindow = source as Window;
        const { type } = data;
        if (!type) return;
        if (type === 'ui') {
          this.ui = data.ui;
        } else if (type === 'param') {
          const { path, value } = data;
          this.paramChangeByDSP(path, value);
        }
      });
    }
  }

  componentMap: { [path: string]: ZitherUiValueComponent<any>[] } = {};

  /**
   * This method should be called by components to register itself to map.
   */
  register(path: string, item: ZitherUiValueComponent<any>) {
    if (this.componentMap[path]) this.componentMap[path].push(item);
    else this.componentMap[path] = [item];
  }

  /**
   * Notify the component to change its value.
   */
  paramChangeByDSP(path: string, value: number) {
    if (this.componentMap[path])
      this.componentMap[path].forEach(item => item.setValue(value));
  }

  /**
   * Can be overriden, called by components when its value is changed by user.
   */
  paramChangeByUI = (path: string, value: number) => {
    if (!this.hostWindow) return;
    this.hostWindow.postMessage({ path, value, type: 'param' }, '*');
  };

  /* eslint-disable class-methods-use-this */
  /* eslint-disable @typescript-eslint/no-unused-vars */
  setValue(address: string, value: number) {}
  /* eslint-enable @typescript-eslint/no-unused-vars */
  /* eslint-enable class-methods-use-this */

  renderType(i: FaustUIItem, context: string): any {
    function styleOf(j: FaustUIItem, metaObject: FaustUIMeta) {
      if (metaObject.style) {
        const s = metaObject.style;
        if (s.startsWith('knob')) return 'knob';
        if (s.startsWith('menu')) return 'menu';
        if (s.startsWith('radio')) return 'radio';
        if (s.startsWith('led')) return 'led';
        if (s.startsWith('numerical')) return 'numerical';
        console.log(
          `styleOf found meta.style ${s} but did not match, returning ${j.type}`
        );
      }
      return j.type;
    }

    if (i.type.endsWith('group')) {
      const i_with_items = i as FaustUIGroup;
      return html`<zither-ui-${i.type}
			    .ui=${i}
			    .top=${this}
			    .context=${context}
			    .label=${i.label}>
			      ${i_with_items.items.map(j => this.renderType(j, i.type))}
			  </zither-ui-${i.type}>`;
    }
    const i_with_meta = i as FaustUIInputItem | FaustUIOutputItem;
    const { metaObject } = ZitherUi.parseMeta(i_with_meta.meta || []);
    const style = styleOf(i_with_meta, metaObject);
    return html`<zither-ui-${style} 
		   .ui=${i}
  		   .metaObject=${metaObject}
		   .top=${this}
		   .context=${context}
		   .label=${i.label}>
		  </zither-ui-${style}>`;
  }

  render() {
    return html` <main>${this.ui.map(i => this.renderType(i, ''))}</main> `;
  }
}
