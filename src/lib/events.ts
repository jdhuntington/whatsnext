import { EventEmitter } from "eventemitter3";

const eventEmitter = new EventEmitter();

export const emit = (eventName: EventName) => {
  eventEmitter.emit(eventName);
};

export const on = (eventName: EventName, callback: () => void) => {
  eventEmitter.on(eventName, callback);
};

export const off = (eventName: EventName, callback: () => void) => {
  eventEmitter.off(eventName, callback);
};

export type EventName =
  | "moveCursorDown"
  | "moveCursorUp"
  | "toggleSelection"
  | "insertAbove";
