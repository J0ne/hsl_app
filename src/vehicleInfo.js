import { LitElement, html, css } from "lit-element";
import { MDCRipple } from "@material/ripple";

class VehicleInfo extends LitElement {
  static get properties() {
    return {
      id: { type: Number },
      speed: { type: Number },
      route: { type: String },
      status: { type: Number },
      operatorName: { type: String },
    };
  }

  constructor() {
    super();
    this.speed = 0;
    this.status = 0;
    this.operatorName = "";
  }


  static styles = css`
    .card {
      box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
      transition: 0.3s;
    }
    .card:hover {
      box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
    }
    .container {
      padding: 2px 16px;
    }
    .gauge {
      display: inline-flex;
    }
    .operator {
      float: right;
      color: grey;
    }
  `;

  firstUpdated() {
    const radialgauge = new RadialGauge({
      renderTo: this.shadowRoot.querySelector("#gauge1"),
      width: 100,
      height: 100,
      title: "Speed",
      units: "Km/h",
      minValue: 0,
      maxValue: 120,
      majorTicks: ["0", "20", "40", "60", "80", "100", "120"],
      minorTicks: 2,
      strokeTicks: true,
      highlights: [
        {
          from: 100,
          to: 120,
          color: "rgba(200, 50, 50, .75)",
        },
      ],
      colorPlate: "#fff",
      borderShadowWidth: 0,
      borders: false,
      needleType: "arrow",
      needleWidth: 2,
      needleCircleSize: 7,
      needleCircleOuter: true,
      needleCircleInner: false,
      animationDuration: 1000,
      animationRule: "linear",
    }).draw();
    this.speedGauge = radialgauge;

    const linearGauge = new LinearGauge({
      renderTo: this.shadowRoot.querySelector("#gauge2"),
      title: "Aikataulupoikkeama",
      units: "min",
      width: 300,
      height: 100,
      minValue: -10,
      maxValue: 10,
      majorTicks: ["-10", "-5", "0", "5", "10"],
      highlights: [
        {
          from: 0,
          to: 10,
          color: "rgba(0, 255, 0, .75)",
        },
        {
          from: -10,
          to: 0,
          color: "rgba(255, 0, 50, .75)",
        },
      ],
      minorTicks: 5,
      strokeTicks: true,
      colorPlate: "#fff",
      borderShadowWidth: 1,
      borders: false,
      barBeginCircle: false,
      tickSide: "left",
      numberSide: "left",
      needleSide: "left",
      needleType: "line",
      needleWidth: 3,
      colorNeedle: "#000",
      colorNeedleEnd: "#fff",
      animationDuration: 1000,
      animationRule: "linear",
      animationTarget: "plate",
      barWidth: 5,
      ticksWidth: 10,
      ticksWidthMinor: 5,
    }).draw();
    linearGauge.value = this.status;
    this.dlGauge = linearGauge;
  }
  updated(changedProps) {
    if (changedProps.has("speed")) {
      this.speedGauge.value = this.speed;
    }
    if (changedProps.has("status")) {
      this.dlGauge.value = this.status;
    }
  }
  getStatusAsString() {
    if (this.status < 0) return `Myöhässä ${this.status} min 👎`;
    if (this.status === 0) return `Aikataulussa 👍`;
    if (this.status > 0) return `Etuajassa ${this.status} min 👍`;
  }
  routeClicked() {
    this.dispatchEvent(
      new CustomEvent("vehicleinfo-clicked", {
        bubbles: true,
        composed: true,
        detail: {
          id: this.id,
        },
      })
    );
  }

  render() {
    return html`${this.style}
      <div class="card">
        <div class="header">
          <mwc-icon-button @click=${this.routeClicked}
            >${this.route}
          </mwc-icon-button>
          <h3><span class="operator">${this.operatorName}</span></h3>
        </div>

        <div class="body" tabindex="0">
          <canvas class="gauge" id="gauge1"></canvas>
          <canvas class="gauge" id="gauge2"></canvas>
        </div>
      </div> `;
  }
}

customElements.define("vehicle-info", VehicleInfo);
