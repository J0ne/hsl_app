import { LitElement, html, css } from "lit-element";
import "@material/mwc-select";
import "@material/mwc-list/mwc-list-item";
import "@material/mwc-button";
import "@material/mwc-icon-button-toggle";

class VehicleSelector extends LitElement {
  static get properties() {
    return {
      vehicles: { type: Array },
      selected: { type: String },
      handleCallback: { type: Object },
    };
  }

  constructor() {
    super();
    this.vehicles = [];
    this.selected = { icon: "check", type: "Select vehicle type" };
  }
  static get styles() {
    return css`
      .selected-text {
        font-weight: 600;
        text-transform: uppercase;
      }
      .selected {
        font-size: 16px;
      }
      .color-size {
        color: green;
        --mdc-icon-size: 4em;
      }
    `;
  }
  async connectedCallback() {
    super.connectedCallback();
    this.vehicles = await this.loadVehicles();
    // alustus
    this.vehicles.forEach((v) => (v.on = false));
  }
  handleIconBtnToggle(e) {
    const vehicle = e.currentTarget;
    this.selected = { type: vehicle.name, icon: vehicle.offIcon };
    this.vehicles.forEach((v) => {
      if (v.type !== vehicle.name) {
        v.on = false;
      } else {
        v.on = true;
      }
    });
    this.requestUpdate();
    this.handleCallback(vehicle.type);
  }
  render() {
    return html`
      <div class="btn-container">
        <div class="selected">
          <mwc-icon class="color-size">${this.selected.icon}</mwc-icon>

          <span class="selected-text">${this.selected.type}</span>
        </div>
        <div>
          ${this.vehicles.map(
            (v) =>
              html`<mwc-icon-button-toggle
                @click=${(e) => this.handleIconBtnToggle(e)}
                .on=${v.on}
                .name=${v.type}
                .type=${v.type}
                onIcon="check"
                offIcon=${v.icon}
                title="${v.type}"
              >
              </mwc-icon-button-toggle> `
          )}
        </div>
      </div>
      <!-- <mwc-select
        @change=${(e) => this.handleSelect(e)}
        outlined
        label="Select vehicle type"
        id="outlined"
      >
        <mwc-list-item></mwc-list-item>
        ${this.vehicles.map(
        (v) => html`<mwc-list-item .value=${v.type}>${v.type}</mwc-list-item>`
      )}
      </mwc-select> -->
    `;
  }

  handleSelect(e) {
    console.log(e);
    this.handleCallback(e.currentTarget.value);
  }
  async loadVehicles() {
    const response = await fetch("http://localhost:3000/api/vehicles");
    return await response.json();
  }
}

customElements.define("vehicle-selector", VehicleSelector);
