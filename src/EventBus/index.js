const _ = require("lodash");
const events = {};

function on(eventName, callback) {
  if (!events[eventName]) {
    events[eventName] = [];
  }

  events[eventName].push(callback);
}

function emit(eventName, ...args) {
  const evts = events[eventName];
  evts.map((fn) => fn.apply(null, args));
}

module.exports = {
  on,
  emit,
};
