/* eslint-disable @typescript-eslint/no-unused-vars */

import { html, css, LitElement } from 'lit';
import { property } from 'lit/decorators.js';

import type {
  FaustUIDescriptor,
  FaustUIItem,
  FaustUIMeta,
  FaustUIGroup,
  FaustUIInputItem,
  FaustUIOutputItem,
} from '@grame/faustwasm';

import type { ZitherUi } from './zither-ui.js';
import { ZitherUiComponent } from './zither-ui-component.js';

/*
 ** Common behavior for all zither/faust ui input and
 ** output components
 ** They all have a value, an address, and an index.
 **
 ** Probably put the TypedEventEmitter code here for
 ** sending and receiving value changes.
 */

export class ZitherUiValueComponent<T> extends ZitherUiComponent<T> {
  @property({ type: Number }) value: number = 0;

  @property({ type: Object }) metaObject!: FaustUIMeta;

  setValue(value: number) {
    this.value = value;
  }

  /* eslint-disable class-methods-use-this */
  myStyle() {
    return css``;
  }
  /* eslint-enable class-methods-use-this */
}
