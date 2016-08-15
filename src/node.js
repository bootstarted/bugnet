import {createErrorQueue} from './util';
const queue = createErrorQueue();

process.on('uncaughtException', (error) => {
  queue.invoke(error);
});
process.on('unhandledRejection', (error, promise) => {
  error.promise = promise;
  queue.invoke(error);
});
process.on('warning', (error) => {
  queue.invoke(error);
});

export default (callback) => queue.addListener(callback);
