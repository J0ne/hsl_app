import { customElement, property, LitElement, html, css } from 'lit-element';

@customElement('hsl-app')
export class HslApp extends LitElement {
  @property() message = 'TODO'; 

  static get styles() {
    return css`
      h1 {
        font-size: 4rem;
      }
      .wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        height: 100vh;
        background-color: #2196f3;
        background: linear-gradient(315deg, #b4d2ea 0%, #2196f3 100%);
        font-size: 24px;
      }
      .link {
        color: white;
      }
    `;
  }

  render() {
    return html`
      <div class="wrapper">
        <h1>HSL app</h1>
          ${this.message}
        </a>
      </div>
    `;
  }
}
