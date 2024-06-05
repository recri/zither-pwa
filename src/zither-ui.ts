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

import { ZitherUiValueComponent } from './ZitherUiValueComponent.js';

@customElement('zither-ui')
export class ZitherUi extends LitElement {
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
   * but the windowMessager is probably wrong, both sides are
   * going to use the same window, and that's not what window
   * messages are for, they're supposed to go between windows
   * of different origins.
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

  render() {
    return html`<div><slot></slot></div>`;
  }
}
