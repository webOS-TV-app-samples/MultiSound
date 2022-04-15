# Multi-Sound

> Except as otherwise noted, the content of this page is licensed under the Creative Commons Attribution 3.0 License, and code samples are licensed under the Apache 2.0 License.

Here is a sample code for playing multi-sound in an app with Web Audio API and audio element. This sample is to show how to initialize Web Audio API as well as handling app visibility in webOS TV. On app suspend, pause audio element (background music) and stop all Web Audio API sounds (sound effects). When the app goes back to the foreground, resume the background music.

We recommend you to use the following sample code. If not, audio resource conflict may occur, and audio sound may not be played on app switching at Launcher UI.

## Handling App Visibility

This code is for guiding how to handle playing sounds in an app when the app goes to the background and comes back to the foreground. This part should be necessarily included in your code so that your app plays sound normally on app switching. For the detailed guide on how to handle the app visibility change in webOS TV, you should see [Managing App Visibility](https://webostv.developer.lge.com/develop/app-developer-guide/web-app-lifecycle/#appvisibility) in **App Lifecycle**.

**\[index.html\]**

```javascript
// Set the name of the "hidden" property and the change event for visibility
var hidden, visibilityChange;
if (typeof document.hidden !== "undefined") {   // To support the standard web browser engine
hidden = "hidden";
visibilityChange = "visibilitychange";
} else if (typeof document.webkitHidden !== "undefined") {   // To support the webkit engine
hidden = "webkitHidden";
visibilityChange = "webkitvisibilitychange";
}
....

function initAudioElement() {
// Handle page visibility change 
document.addEventListener(visibilityChange, handleVisibilityChange, false);
}

...
// On app suspend, pause the audio element and stop all web audio api sounds
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
```

## Initializing and Using Web Audio API

You need to create the [AudioContext](https://developer.mozilla.org/en-US/docs/Web/API/AudioContext) object and use [AudioContext.decodeAudioData()](https://developer.mozilla.org/ko/docs/Web/API/AudioContext/decodeAudioData) method to decode each sound file.

**\[index.html\]**

```javascript
function initWebAudio() {
var sounds = ["./sounds/shutter.wav",
            "./sounds/camstart.wav",
            "./sounds/camstop.wav",
            "./sounds/strings3.wav" ];
window.AudioContext = window.AudioContext || window.webkitAudioContext;
context = new AudioContext();
source = new SoundSource(context, sounds, finishedLoading);
}
...

function finishedLoading(bufferList) {
// Create two sources and play them both together.
}
```

**\[soundEffet.js\]**

```javascript
function SoundSource (context, urlList, callback) {
this.context = context;
this.urlList = urlList;
this.onload = callback;
this.bufferList = new Array();
this.sound = new Array();
this.soundBuf = new Array();
this.loadCount = 0;

this.load();

var loader = this;
}

SoundSource.prototype.loadBuffer = function(url, index) {
// Load buffer asynchronously
var request = new XMLHttpRequest();
request.open("GET", url, true);
request.responseType = "arraybuffer";

var loader = this;

request.onload = function() {
// Asynchronously decode the audio file data in request.response
loader.context.decodeAudioData(
  request.response,
  function(buffer) {
    if (!buffer) {
      console.log('error decoding file data: ' + url);
      return;
    }
    loader.bufferList[index] = buffer;
    loader.prepareSound(index);
    loader.sound[index] = null;
    if ((++loader.loadCount == loader.urlList.length) && (loader.onload != null))
      loader.onload(loader.bufferList);
  }
);
};

request.onerror = function() {
console.log('BufferLoader: XHR error');
};

request.send();
};

SoundSource.prototype.prepareSound = function(index) {
this.soundBuf[index] = this.context.createBufferSource();
this.soundBuf[index].buffer = this.bufferList[index];
this.soundBuf[index].connect(this.context.destination);
};

SoundSource.prototype.load = function() {
for (var i = 0; i < this.urlList.length; ++i)
this.loadBuffer(this.urlList[i], i);
};

SoundSource.prototype.start = function(index) {
this.stop(index);
this.soundBuf[index].start(0);
this.sound[index] = this.soundBuf[index];

this.prepareSound(index);
};

...
```

## Playing Background Music and Sound Effects

Play background music with the audio element, and sound effects by calling functions that are using Web Audio API.

**\[index.html\]**

```html
...
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
...
<body onload="initPage()>
<audio id="audioElement" controls autoplay loop>
<source src="./sounds/demo_secret_garden.mp3" type="audio/mp3">
</audio><br><br>

<h1>webaudio source</h1>
<input type="button" value="Take Picture" onclick="takePicture();" style="font-size:20px;"></input><br>
<input type="button" value="Start Recording" onclick="startRecording();" style="font-size:20px;"></input><br>
<input type="button" value="Stop Recording" onclick="stopRecording();" style="font-size:20px;"></input><br>
<input type="button" value="Play Long Sound" onclick="playLongSound();" style="font-size:20px;"></input><br>
```

## Result in the webOS TV Emulator

You can install the sample app and check the sample app in the webOS TV emulator as below image.

![The result image of the sample app](https://webostv.developer.lge.com/download_file/view_inline/2128/)
