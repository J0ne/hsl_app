import { customElement, property, LitElement, html, css } from "lit-element";
import "@material/mwc-drawer";
import "@material/mwc-icon-button";
import "@material/mwc-top-app-bar";
import { socket, VEHICLE_EVENT } from "./services/socketClient";
import "Leaflet-MovingMaker/MovingMarker.js";
import "./vehicle-selector";
import "./vehicleInfo";
@customElement("app-root")
export class AppRoot extends LitElement {
  static get properties() {
    return {
      map: { type: Object },
      vehicles: { type: Array },
      selectedVehicle: { type: Object },
      selectedVehicles: { type: Array}
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
        padding: 0px 18px 0 18px;
      }
      h1 {
        font-size: 4rem;
      }
      .link {
        color: white;
      }
      .tram-popup {
        font: bolder;
        text-align: center;
      }
      .vehicle-area {
        display: flex;
        max-height: 150px;
        padding: 5px;
        border: 1px solid grey;
      }
      .vehicle-area-item {
        max-height: 150px;
      }
    `;
  }
  constructor() {
    super();
    this.socket = socket;
    this.vehicles = [];
    this.vehicleLayer = [];
    this.markerGroup = null;
    this.markerGroupId = null;
    this.addEventListener("vehicle-selected", (e) => {
      alert(e.detail);
    });
    this.selectedVehicle = null;
    this.selectedVehicles = [];
  }

  render() {
    console.log("render");
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
            <mwc-icon-button
              slot="actionItems"
              @click=${() => this.setPlace()}
              icon="place"
            ></mwc-icon-button>
          </mwc-top-app-bar>
          <div class="main-content">
            <div class="vehicle-area">
              <vehicle-selector
                class="vehicle-area-item"
                .handleCallback=${this.handleSelect.bind(this)}
              ></vehicle-selector>
              ${this.selectedVehicle
                ? html`<vehicle-info
                    class="vehicle-area-item"
                    .speed=${this.selectedVehicle.speed}
                  ></vehicle-info>`
                : ""}
              ${this.selectedVehicles.length > 0
                ? this.selectedVehicles.map(
                    (vehicle) => html`<vehicle-info
                      class="vehicle-area-item"
                      .speed=${vehicle.speed}
                    ></vehicle-info>`
                  )
                : html`<p>No vehicles selected</p>`}
            </div>

            <slot name="map-container"></slot>
          </div>
        </div>
      </mwc-drawer>
    `;
  }

  firstUpdated() {
    this.initDrawer();
    this.initMessageHandler();
  }
  async handleSelect(type) {
    this.postVehicleType(type);
    this.vehicles = [];
    this.selectedVehicles = [];
    const keys = Object.keys(this.markerGroup._layers);
    keys.forEach((key) => {
      this.markerGroup.removeLayer(key);
    });
  }

  initMessageHandler() {
    this.markerGroup = L.layerGroup().addTo(this.map);
    this.map.on("popupopen", (e) =>{
       this.map.panTo(e.popup._latlng, { animate: true, duration: 1 });
       
       //this.selectedVehicle = this.vehicles.find( v => v.vehicleId === e.popup._source.id);
       this.selectedVehicles.push(this.vehicles.find( v => v.vehicleId === e.popup._source.id))
       console.log(this.selectedVehicle);
       this.requestUpdate();
    });
    this.map.on('popupclose', e => this.selectedVehicle = null);
    this.markerGroupId = this.markerGroup._leaflet_id;
    console.log(this.markerGroup);
    this.socket.on(VEHICLE_EVENT, (vehicleDTO) => {

      console.log(vehicleDTO);
      if (!this.vehicles.find((v) => v.id === vehicleDTO.veh)) {
        // eka merkki: from = to
        const vehicle = this.setMarker(
          vehicleDTO.location, // from
          vehicleDTO.location, // to
          vehicleDTO
        );
        vehicle.id = vehicleDTO.veh;
      } else {
        const vehicleToUpdate = this.vehicles.find(
          (v) => v.id === vehicleDTO.veh
        );

        // is selected
        const selected = this.selectedVehicles.find(
          (v) => v._leaflet_id === vehicleToUpdate._leaflet_id
        );
        if (selected) {
          selected.speed = vehicleDTO.speed;
          this.requestUpdate();
        }
        // if (
        //   this.selectedVehicle &&
        //   this.selectedVehicle._leaflet_id === vehicleToUpdate._leaflet_id
        // ) {
        //   this.selectedVehicle.spd = Math.round(
        //     (msgObj.spd * 60 * 60) / 1000
        //   );
        //   this.requestUpdate();
        // }
        vehicleToUpdate.moveTo(vehicleDTO.location, 2000);
      }
    });
  }

  initDrawer() {
    const drawer = this.renderRoot.querySelectorAll("mwc-drawer")[0];
    if (drawer) {
      const container = drawer.parentNode;
      container.addEventListener("MDCTopAppBar:nav", () => {
        drawer.open = !drawer.open;
      });
    }
  }
  setPlace() {
    console.log("TODO");
  }
  async postVehicleType(type) {
    const data = {
      type,
    };
    let response = await fetch("http://localhost:3000/api/vehicles/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify(data),
    });
    let result = await response.json();
    console.log(result);
  }

  setMarker(from, to, msgObj) {
    const m = this.L.Marker.movingMarker([from, to], 1000, {
      autostart: true,
      keepInView: true,
    })
      .bindPopup(
        `<div class="tram-popup ${msgObj.dl < 0 ? "red" : "green"}">
        <mwc-icon-button slot="actionItems" icon="tram"></mwc-icon-button>
          <strong>${msgObj.routeNumber}</strong>
        </div>`
      )
      .openPopup();
    m.vehicleId = msgObj.veh;
    this.vehicles.push(m);
    m.addTo(this.markerGroup);
    m.start();
    return m;
  }
}
