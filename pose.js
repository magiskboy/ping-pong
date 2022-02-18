import "https://unpkg.com/handsfree@8.5.1/build/lib/handsfree.js";

const FPS = 14;

const handsfree = new Handsfree({
  pose: {
    enabled: false,
  },
  hands: {
    enabled: true,
    maxNumHands: 1,
    // Minimum confidence [0 - 1] for a hand to be considered detected
    minDetectionConfidence: 0.6,

    // Minimum confidence [0 - 1] for the landmark tracker to be considered detected
    // Higher values are more robust at the expense of higher latency
    minTrackingConfidence: 0.4,
  },
  showDebug: false,
});

handsfree.model.hands.getData = handsfree.throttle(
  handsfree.model.hands.getData,
  1000 / FPS
);

function dispatch(x) {
  document.dispatchEvent(new CustomEvent("pose", { detail: { x } }));
}

handsfree.on("data", ({ hands }) => {
  if (!hands.landmarks) return;
  if (hands.landmarksVisible[1]) {
    const x = hands.landmarks[1].reduce((prev, curr) => prev + curr.x, 0) / 22;

    for (let i = 0; i < 10; ++i) {
      dispatch(x + i * 5 * 10e-4);
    }
  }
});

handsfree.start();
