/* eslint-disable no-restricted-globals */

self.addEventListener("message", (evt) => {
  const workerResult = evt.data[0];
  postMessage(workerResult);
});
