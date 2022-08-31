var context;
var source;

// Set the name of the "hidden" property and the change event for visibility
var hidden, visibilityChange;
if (typeof document.hidden !== "undefined") {
  // To support the standard web browser engine
  hidden = "hidden";
  visibilityChange = "visibilitychange";
} else if (typeof document.webkitHidden !== "undefined") {
  // To support the webkit engine
  hidden = "webkitHidden";
  visibilityChange = "webkitvisibilitychange";
}

function initWebAudio() {
  var sounds = [
    "./sounds/shutter.wav",
    "./sounds/camstart.wav",
    "./sounds/camstop.wav",
    "./sounds/strings3.wav",
  ];

  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  context = new AudioContext();
  source = new SoundSource(context, sounds, finishedLoading);
}

function initAudioElement() {
  // Handle page visibility change
  document.addEventListener(visibilityChange, handleVisibilityChange, false);
}

//initialize page
function initPage() {
  initWebAudio();
  initAudioElement();
  document
    .getElementById("take_picture")
    .addEventListener("click", takePicture);
  document
    .getElementById("start_recording")
    .addEventListener("click", startRecording);
  document
    .getElementById("stop_recording")
    .addEventListener("click", stopRecording);
  document
    .getElementById("play_long_sound")
    .addEventListener("click", playLongSound);
}

function finishedLoading(bufferList) {
  // Create two sources and play them both together.
}

function takePicture() {
  source.start(0);
}

function startRecording() {
  source.start(1);
}

function stopRecording() {
  source.start(2);
}

function playLongSound() {
  source.start(3, false);
}

function suspend() {
  var audioElement = document.getElementById("audioElement");
  audioElement.pause();
  source.stopAll();
}

function resume() {
  var audioElement = document.getElementById("audioElement");
  audioElement.play();
}

// If the page is hidden, pause the audio
// if the page is shown, play the audio
function handleVisibilityChange() {
  if (document[hidden]) {
    console.log("app suspend");
    suspend();
  } else {
    console.log("app resume");
    resume();
  }
}

window.addEventListener("load", initPage);
