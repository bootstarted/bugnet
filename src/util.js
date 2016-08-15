export const createErrorQueue = () => {
  const queue = [];
  const listeners = [];
  return {
    addListener: (l) => {
      listeners.push(l);
      queue.forEach((args) => l(...args));
    },
    invoke: (...args) => {
      if (queue.length > 50) {
        queue.shift();
      }
      queue.push(args);
      listeners.forEach((l) => l(...args));
    },
  };
};
