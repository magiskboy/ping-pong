import "https://unpkg.com/handsfree@8.5.1/build/lib/handsfree.js";

const LEFT_SHOULDER = 11;
const RIGHT_SHOULDER = 12;
const LEFT_WRIST = 15;
const RIGHT_WRIST = 16;

const VISIBILITY_THRESHOLD = 0.8;
const FPS = 15;

const handsfree = new Handsfree({
  pose: {
    enabled: false,
  },
  hands: {
    enabled: true,
    maxNumHands: 1,
    // Minimum confidence [0 - 1] for a hand to be considered detected
    minDetectionConfidence: 0.7,

    // Minimum confidence [0 - 1] for the landmark tracker to be considered detected
    // Higher values are more robust at the expense of higher latency
    minTrackingConfidence: 0.2,
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

// handsfree.on("data", ({ pose }) => {
//   const { poseLandmarks } = pose;
//   if (!poseLandmarks) return;
//   const data = {
//     LEFT_SHOULDER: poseLandmarks[LEFT_SHOULDER],
//     RIGHT_SHOULDER: poseLandmarks[RIGHT_SHOULDER],
//     LEFT_WRIST: poseLandmarks[LEFT_WRIST],
//     RIGHT_WRIST: poseLandmarks[RIGHT_WRIST],
//   };
//   let x;
//   // if right hand is not visible, pad is calculated by shoulder
//   if (data.RIGHT_WRIST.visibility < VISIBILITY_THRESHOLD) {
//     x = data.RIGHT_SHOULDER.x + 0.12;
//   } else {
//     x = data.RIGHT_WRIST.x;
//   }
// });

handsfree.on("data", ({ hands }) => {
  if (!hands.landmarks) return;
  if (hands.landmarksVisible[1]) {
    const x = hands.landmarks[1][21].x;
    dispatch(x);
  }
});

handsfree.start();
