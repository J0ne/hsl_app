import io from "socket.io-client";

export const VEHICLE_EVENT = "vehicle-event";
export const socket = io("http://localhost:3000", {
  reconnectionDelayMax: 10000,
});
