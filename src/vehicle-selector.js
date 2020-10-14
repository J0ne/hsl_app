import { LitElement, html, css } from "lit-element";
import "@material/mwc-select";
import "@material/mwc-list/mwc-list-item";
import "@material/mwc-button";

class VehicleSelector extends LitElement {
  static get properties() {
    return {
      vehicles: { type: Array },
      handleCallback: { type: Object },
    };
  }

  constructor() {
    super();
    this.vehicles = [];
  }

  async connectedCallback() {
    super.connectedCallback();
    this.vehicles = await this.loadVehicles();
  }

  render() {
    return html`
      <mwc-select
        @change=${(e) => this.handleSelect(e)}
        outlined
        label="Select vehicle type"
        id="outlined"
      >
        <mwc-list-item></mwc-list-item>
        ${this.vehicles.map(
          (v) => html`<mwc-list-item .value=${v.type}>${v.type}</mwc-list-item>`
        )}
      </mwc-select>
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
