/* ==================== Make a photo  ==================== */
const photobooth = {
  config: {
    $video: document.querySelector('.player'),
    $canvas: document.querySelector('.photo'),
    $strip: document.querySelector('.strip'),
    $snap: document.querySelector('.snap'),
    $photoBtn: document.querySelector('.btn'),
    $window: window
  },

  /* ==================== Functionality  ==================== */

  getVideo: function() {
    const video = this.config.$video;
    const window = this.config.$window;
    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
      .then(localMediaStream => {
        video.src = window.URL.createObjectURL(localMediaStream);
        video.play();
      })
      .catch(err => {      // when user didng give acces to camera
        console.error(`OH NO!!!`, err);
      });
  },
  /* set video to canvas */
  paintToCanvas: function(source) {
    const canvas = this.config.$canvas;
    const video = this.config.$video;
    const ctx = canvas.getContext('2d');
    /* Set up width and height of canvas */
    const width = video.videoWidth;
    const height = video.videoHeight;
    canvas.width = width;
    canvas.height = height;
    /* streem in canvas */
    ctx.drawImage(video, 0, 0, width, height);
    /* refresh canvas 60 fps for 1 sec */
    window.requestAnimationFrame(() => {
      this.paintToCanvas();
    });
  },

  takePhoto: function() {
    const snap = this.config.$snap;
    const canvas = this.config.$canvas;
    const strip = this.config.$strip;
    /* play sound */
    snap.currentTime = 0;
    snap.play();
    /* Make a photo */
    const data = canvas.toDataURL('image/jpeg');
    const link = document.createElement('a');
    link.href = data;
    link.setAttribute('download', 'handsome');
    link.innerHTML = `<img src="${data}" alt="Handsome Man" />`;
    strip.insertBefore(link, strip.firsChild);
  },
  /* ==================== Handlers  ==================== */
  playVideo: function() {
    const video = this.config.$video;
    video.addEventListener('canplay', this.paintToCanvas.bind(this));
  },

  takePhotoHandler: function() {
    const btn = this.config.$photoBtn;
    btn.addEventListener('click', this.takePhoto.bind(this));
  },

  /* ==================== Initialize  ==================== */
  initialize: function() {
    this.getVideo();
    this.playVideo();
    this.takePhotoHandler();
  },
}
photobooth.initialize();
