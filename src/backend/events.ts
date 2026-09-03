import { EventEmitter } from "events";

// Create a global event emitter to share events across the server
// Ensure it survives hot reloads in development
declare global {
  var globalAdminEmitter: EventEmitter | undefined;
}

export const adminEmitter = global.globalAdminEmitter || new EventEmitter();

if (process.env["NODE_ENV"] !== "production") {
  global.globalAdminEmitter = adminEmitter;
}

export const EVENTS = {
  CONTENT_UPDATED: "content_updated",
};
