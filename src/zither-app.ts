import { LitElement, html, css } from 'lit';
import { property, customElement } from 'lit/decorators.js';

const logo = new URL('../../assets/open-wc-logo.svg', import.meta.url).href;

@customElement('zither-app')
export class ZitherApp extends LitElement {
  @property({ type: String }) header = 'My app';

  static styles = css`
    :host {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      font-size: calc(10px + 2vmin);
      color: #ededed;
      max-width: 960px;
      margin: 0 auto;
      text-align: center;
      background-color: var(--zither-app-background-color);
    }

    main {
      flex-grow: 1;
    }

    canvas {
      flex-grow: 1;
    }
  `;

  // Log events flag
  logEvents = false;

  start_handler(ev: TouchEvent) {
    // If the user makes simultaneous touches, the browser will fire a
    // separate touchstart event for each touch point. Thus if there are
    // three simultaneous touches, the first touchstart event will have
    // targetTouches length of one, the second event will have a length
    // of two, and so on.
    ev.preventDefault();
  }

  move_handler(ev: TouchEvent) {
    // Note: if the user makes more than one "simultaneous" touches, most browsers
    // fire at least one touchmove event and some will fire several touchmoves.
    // Consequently, an application might want to "ignore" some touchmoves.
    //
    // This function sets the target element's border to "dashed" to visually
    // indicate the target received a move event.
    //
    ev.preventDefault();
    if (this.logEvents) console.log(`touchMove ${ev}`);
  }

  end_handler(ev: TouchEvent) {
    ev.preventDefault();
    if (this.logEvents) console.log(`${ev.type} ${ev}`);
  }

  render() {
    return html`
      <main>
	<canvas id="canvas" 
          @touchstart=${this.start_handler}
          @touchmove=${this.move_handler}
          @touchend=${this.end_handler}
          @touchcancel=${this.end_handler}
	></canvas>
      </main>
    `;
  }
}
