import { customElement, property, LitElement, html, css } from "lit-element";
import "@material/mwc-drawer";
import "@material/mwc-icon-button";
import "@material/mwc-top-app-bar";
@customElement("app-root")
export class AppRoot extends LitElement {

  static get properties() {
    return {
      Map: { type: Object }
    };
  }
  static get styles() {
    return css`
      body {
        height: 100vh;
      }
      .drawer-content {
        padding: 0px 16px 0 16px;
      }
      .main-content {
        min-height: 300px;
        padding: 48px 18px 0 18px;
      }
      h1 {
        font-size: 4rem;
      }
      .link {
        color: white;
      }
    `;
  }
  constructor(){
    super();
  }
  render() {
    return html`
      <mwc-drawer hasHeader type="modal">
        <span slot="title">Drawer Title</span>
        <span slot="subtitle">subtitle</span>
        <div class="drawer-content">
          <p>Drawer content</p>
          <mwc-icon-button icon="gesture"></mwc-icon-button>
          <mwc-icon-button icon="gavel" id="gavel"></mwc-icon-button>
        </div>
        <div slot="appContent">
          <mwc-top-app-bar>
            <mwc-icon-button
              slot="navigationIcon"
              icon="menu"
            ></mwc-icon-button>
            <div slot="title">HSL App</div>
            <mwc-icon-button slot="actionItems" icon="cast"></mwc-icon-button>
            <mwc-icon-button
              slot="actionItems"
              icon="fingerprint"
            ></mwc-icon-button>
          </mwc-top-app-bar>
          <div class="main-content">
            <slot name="map-container"></slot>
          </div>
        </div>
      </mwc-drawer>
    `;
  }

  firstUpdated() {
    const drawer = this.renderRoot.querySelectorAll("mwc-drawer")[0];
    if (drawer) {
      const container = drawer.parentNode;
      container.addEventListener("MDCTopAppBar:nav", () => {
        drawer.open = !drawer.open;
      });
    }

    const m = this.L.Marker.movingMarker([
      [60.192859, 24.925831], 
      [60.192089, 24.940831], 
      [60.192089, 24.943838]
    ], [1000, 5000, 3000], {
      autostart: true,
      keepInView: true,
    }).addTo(this.Map);
    m.start();
  }
}
