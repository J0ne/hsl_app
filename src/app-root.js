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
      </div>
      <div id="hsl-map"><</div>
    `;
  }

  firstUpdated() {
    const map = L.map('map').setView([60.192059, 24.945831], 15);

    var normalTiles = L.tileLayer(
      'https://cdn.digitransit.fi/map/v1/{id}/{z}/{x}/{y}.png',
      {
        attribution:
          'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
          '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
        maxZoom: 19,
        tileSize: 512,
        zoomOffset: -1,
        id: 'hsl-map',
      },
    ).addTo(map);
                
  }
}
