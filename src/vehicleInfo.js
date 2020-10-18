import { LitElement, html, css } from "lit-element";
import { ModuleManager } from "igniteui-webcomponents-core";
// // Bullet Graph Module
// import { IgcRadialGaugeCoreModule } from "igniteui-webcomponents-gauges";
// import { IgcRadialGaugeModule } from "igniteui-webcomponents-gauges";

// // register the modules
// ModuleManager.register(IgcRadialGaugeCoreModule, IgcRadialGaugeModule);

class VehicleInfo extends LitElement {
  static get properties() {
    return {
      speed: { type: Number },
      route: { type: String },
      dlIndicator: { type: Number },
      route: { type: String },
      operator: { type: Number },
      gauge: { type: Object}
    };
  }

  constructor() {
    super();
    this.speed = 0;
  }
 firstUpdated() {
     const gauge = new RadialGauge({
       renderTo: this.shadowRoot.querySelector("canvas"),
       width: 150,
       height: 150,
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
     this.gauge = gauge;
 }
  updated(changedProps){
    if(changedProps.get('speed')){
        console.log('changed props')
        this.gauge.value = this.speed;
    }
  }
  render() {
    
    return html`
      <!-- <igc-radial-gauge
        height="150px"
        width="150px"
        scale-start-angle="135"
        scale-end-angle="45"
        scale-brush="DodgerBlue"
        scale-sweep-direction="Clockwise"
        scale-oversweep="1"
        scale-oversweep-shape="Fitted"
        scale-start-extent="0.45"
        scale-end-extent="0.575"
        minimum-value="0"
        value=${this.speed}
        maximum-value="120"
        interval="10"
      >
      </igc-radial-gauge> -->
      <canvas id="gauge1"></canvas>
    `;
  }
}

customElements.define("vehicle-info", VehicleInfo);

const operators = [
  { id: 6, name: "Oy Pohjolan Liikenne Ab" },
  { id: 12, name: "Helsingin Bussiliikenne Oy" },
  { id: 17, name: "Tammelundin Liikenne Oy" },
  { id: 18, name: "Pohjolan Kaupunkiliikenne Oy" },
  { id: 20, name: "Bus Travel Åbergin Linja Oy" },
  { id: 21, name: "Bus Travel Oy Reissu Ruoti" },
  { id: 22, name: "Nobina Finland Oy" },
  { id: 30, name: "Savonlinja Oy" },
  { id: 36, name: "Nurmijärven Linja Oy" },
  { id: 40, name: "HKL-Raitioliikenne" },
  { id: 45, name: "Transdev Vantaa Oy" },
  { id: 47, name: "Taksikuljetus Oy" },
  { id: 50, name: "HKL-Metroliikenne" },
  { id: 51, name: "Korsisaari Oy" },
  { id: 54, name: "V-S Bussipalvelut Oy" },
  { id: 55, name: "Transdev Helsinki Oy" },
  { id: 58, name: "Koillisen Liikennepalvelut Oy" },
  { id: 60, name: "Suomenlinnan Liikenne Oy" },
  { id: 59, name: "Tilausliikenne Nikkanen Oy" },
  { id: 89, name: "Metropolia" },
  { id: 90, name: "VR Oy" },
];
