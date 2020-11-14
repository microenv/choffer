import * as _ from 'lodash';

type EventBusEventCallback = Function;

type EventBusEventsList = {
  [key: string]: EventBusEventCallback[];
}

const events: EventBusEventsList = {};

function on(eventName: string, callback: EventBusEventCallback) {
  if (!events[eventName]) {
    events[eventName] = [];
  }

  events[eventName].push(callback);
}

function emit(eventName: string, ...args: any) {
  const evts = events[eventName];
  evts.map(fn => fn.apply(null, args));
}

export default {
  on,
  emit,
};
