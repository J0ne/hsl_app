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
      selectedVehicles: { type: Array },
    };
  }
  static get styles() {
    return css`
      body {
        height: 100vh;
      }
      .map-area {
        width: auto;
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
        max-height: 400px;
        padding: 5px;
        border: 1px solid grey;
      }
      .vehicle-area-item {
        max-height: 350px;
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
    this.selectedVehicle = null;
    this.selectedVehicles = [];
    this.addEventListener("vehicleinfo-clicked", (e) => {
      const vehicleMarker = this.vehicles.find(
        (v) => v.vehicleId === e.detail.id
      );
      if (vehicleMarker){
        vehicleMarker._popup._source.openPopup();
      }
    });
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
              ${this.selectedVehicles.length > 0
                ? this.selectedVehicles.map(
                    (vehicle) => html`<vehicle-info
                      class="vehicle-area-item"
                      .id=${vehicle.id}
                      .speed=${vehicle.speed}
                      .route=${vehicle.route}
                      .status=${vehicle.dl}
                      .operatorName=${vehicle.operatorName}
                    ></vehicle-info>`
                  )
                : ""}
            </div>
            <div class="map-area">
              <slot name="map-container"></slot>
            </div>
            <div></div>
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
  isSelected(id) {
    return !!this.selectedVehicles.find((sv) => sv.id === id);
  }
  initMessageHandler() {
    this.markerGroup = L.layerGroup().addTo(this.map);
    this.map.on("popupopen", (e) => {
      this.map.panTo(e.popup._latlng, { animate: true, duration: 1 });

      //this.selectedVehicle = this.vehicles.find( v => v.vehicleId === e.popup._source.id);
      if (!this.isSelected(e.popup._source.id)) {
        const selectedVehicle = this.vehicles.find(
          (v) => v.id === e.popup._source.id
        );
        this.selectedVehicles.push(selectedVehicle);
      }

      this.requestUpdate();
    });
    this.map.on("popupclose", (e) => (this.selectedVehicle = null));
    this.markerGroupId = this.markerGroup._leaflet_id;

    this.socket.on(VEHICLE_EVENT, (vehicleDTO) => {
      //console.log(vehicleDTO);
      if (!this.vehicles.find((v) => v.id === vehicleDTO.id)) {
        // eka merkki: from = to
        const vehicle = this.setMarker(
          vehicleDTO.location, // from
          vehicleDTO.location, // to
          vehicleDTO
        );
        vehicle.id = vehicleDTO.id;
      } else {
        const vehicleToUpdate = this.vehicles.find(
          (v) => v.id === vehicleDTO.id
        );

        // is selected
        const selectedIndex = this.selectedVehicles.findIndex(
          (v) => v._leaflet_id === vehicleToUpdate._leaflet_id
        );
        if (selectedIndex > -1) {
          this.selectedVehicles[selectedIndex].speed = vehicleDTO.speed;
          this.selectedVehicles[selectedIndex].dl = vehicleDTO.dl;
          this.selectedVehicles[selectedIndex].operatorName =
            vehicleDTO.operatorName;
          this.selectedVehicles[selectedIndex].route = vehicleDTO.route;

          this.requestUpdate();
        }
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
  }

  setMarker(from, to, msgObj) {
    const m = this.L.Marker.movingMarker([from, to], 1000, {
      autostart: true,
      keepInView: true,
    })
      .bindPopup(
        `<div class="tram-popup ${msgObj.dl < 0 ? "red" : "green"}">
        <mwc-icon-button slot="actionItems" icon="tram"></mwc-icon-button>
          <strong>${msgObj.route}</strong>
        </div>`
      )
      .openPopup();
    m.vehicleId = msgObj.id;
    this.vehicles.push(m);
    m.addTo(this.markerGroup);
    m.start();
    return m;
  }
}
