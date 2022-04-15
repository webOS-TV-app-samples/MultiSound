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
          alert('error decoding file data: ' + url);
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
    alert('BufferLoader: XHR error');        
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

SoundSource.prototype.stop = function(index) {
  var sound = this.sound[index];
  if(sound == null)
    return;

  if((sound.playbackState == sound.PLAYING_STATE) || (sound.playbackState == sound.SCHEDULED_STATE)) {
    sound.stop(0);
	this.sound[index] = null;
  }
};

SoundSource.prototype.stopAll = function() {
  var sound;
  var index;
  for(index=0; index<this.sound.length; index++)
  {
    if((sound = this.sound[index]) != null)
      this.stop(index);
  }
};


