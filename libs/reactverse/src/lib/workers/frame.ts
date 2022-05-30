/* eslint-disable no-restricted-globals */

self.addEventListener("message", (evt) => {
  const workerResult = evt.data[0];
  postMessage(workerResult);
});
// const worker = new Worker("/worker.ts");
// canvas.addEventListener("click", () => {
//   worker.postMessage(["hello", "universe"]);
// });

// worker.addEventListener("message", (evt) => {
//   console.log("message:", evt.data);
// });

// worker.addEventListener("error", (evt) => {
//   console.error("worker error:", evt);
// });
