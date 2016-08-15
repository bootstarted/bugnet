import {createErrorQueue} from './util';

const globals = [
  'EventTarget',
  'Window',
  'Node',
  'ApplicationCache',
  'AudioTrackList',
  'ChannelMergerNode',
  'CryptoOperation',
  'EventSource',
  'FileReader',
  'HTMLUnknownElement',
  'IDBDatabase',
  'IDBRequest',
  'IDBTransaction',
  'KeyOperation',
  'MediaController',
  'MessagePort',
  'ModalWindow',
  'Notification',
  'SVGElementInstance',
  'Screen',
  'TextTrack',
  'TextTrackCue',
  'TextTrackList',
  'WebSocket',
  'WebSocketWorker',
  'Worker',
  'XMLHttpRequest',
  'XMLHttpRequestEventTarget',
  'XMLHttpRequestUpload',
];

let _wrappedError = null;

const wrap = (f) => {
  try {
    if (typeof f !== 'function' || f._isWrap) {
      return f;
    } else if (!f._wrapped) {
      const wrapped = function(...args) {
        try {
          return f.apply(this, args); // eslint-disable-line
        } catch (e) {
          _wrappedError = e;
          throw e;
        }
      };
      wrapped._isWrap = true;
      f._wrapped = wrapped;
      return Object.assign(wrapped, f);
    }
    return f._wrapped;
  } catch (e) {
    // If anything messes up while trying to wrap the function then don't
    // break the app.
    if (process.env.NODE_ENV === 'production') {
      return f;
    }
    throw e;
  }
};

const unwrap = (f) => {
  return (f && f._wrapped) ? f._wrapped : f;
};

const _extendListenerPrototype = (listener) => {
  const prototype = listener && listener.prototype;
  if (prototype && 'addEventListener' in prototype) {
    const oldAddEventListener = prototype.addEventListener;
    prototype.addEventListener = function(event, callback, bubble) {
      oldAddEventListener.call(this, event, wrap(callback), bubble);
    };
    const oldRemoveEventListener = prototype.removeEventListener;
    prototype.removeEventListener = function(event, callback, bubble) {
      oldRemoveEventListener.call(this, event, unwrap(callback), bubble);
    };
  }
};

const noop = () => {};
const oldOnError = window.onerror || noop;
const oldOnUnhandledRejection = window.onunhandledrejection || noop;

const queue = createErrorQueue();

const handleError = (
  message,
  url,
  line,
  column,
  error
  /* , context */
) => {
  const thing = error || _wrappedError;
  _wrappedError = null;
  queue.invoke(thing);
};

const handleRejection = (
  evt
) => {
  queue.invoke(evt.reason);
};

// Handle uncaught errors.
window.onerror = (...args) => {
  handleError(...args);
  return oldOnError.apply(window, args);
};

// Handle uncaught promise rejections.
window.onunhandledrejection = (...args) => {
  handleRejection(...args);
  return oldOnUnhandledRejection.apply(window, args);
};

globals.forEach((name) => _extendListenerPrototype(window[name]));

export default (callback) => queue.addListener(callback);
