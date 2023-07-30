document.addEventListener('DOMContentLoaded', () => {
  const video = document.getElementById('video');
  const canvas = document.getElementById('canvas');
  const canvasContainer = document.getElementById('canvas-container');
  const errorMessage = document.getElementById('error-message');

  if (!video || !canvas || !canvasContainer || !errorMessage) {
    console.error('Required elements not found.');
    return;
  }

  let displaySize = { width: 560, height: 560 };

  if (video) {
    video.width = displaySize.width;
    video.height = displaySize.height;
  }
  if (canvas) {
    canvas.width = displaySize.width;
    canvas.height = displaySize.height;
  }

  async function startVideo() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
      if (video) {
        video.srcObject = stream;
        video.addEventListener('loadedmetadata', () => {
          displaySize = { width: video.videoWidth, height: video.videoHeight };
          video.width = displaySize.width; // Update video element width
          video.height = displaySize.height; // Update video element height
          faceapi.matchDimensions(canvas, displaySize);
          detectFace();
        });
      }
    } catch (err) {
      console.error('Error accessing the camera: ', err);
      showError('Error accessing the camera: ' + err.message);
    }
  }

  startVideo();  

  async function detectFace() {
    if (canvas) {
      await faceapi.nets.tinyFaceDetector.loadFromUri('./models');

      const ctx = canvas.getContext('2d');

      let isFaceVisible = true;

      setInterval(async () => {
        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions());
        const resizedDetections = faceapi.resizeResults(detections, displaySize);
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the main canvas before drawing

        if (resizedDetections.length > 0) {
          canvasContainer.style.border = '4px solid green'; // Change the canvas outline color to green

          isFaceVisible = true;
        } else {
          canvasContainer.style.border = '4px solid red'; // Change the canvas outline color to red

          if (isFaceVisible) {
            showError('Face not visible or not looking into the camera. Please adjust your position.');
            isFaceVisible = false;
          }
        }
      }, 10000); // Check every 10 seconds
    }
  }

  async function checkFaceVisibility() {
    try {
      const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions());
      if (detections.length === 0) {
        showError('Face not visible or not looking into the camera. Please adjust your position.');
        canvasContainer.style.border = '4px solid red'; // Change the canvas outline to red
      } else {
        // Clear the error message and border when face is detected
        errorMessage.style.display = 'none';
        canvasContainer.style.border = '4px solid green'; // Change the canvas outline to green
      }
    } catch (error) {
      console.error('Error detecting face:', error);
    }
  }

  checkFaceVisibility(); // Initial check

  // Helper function to show error message in chat box format
  function showError(message) {
    errorMessage.innerHTML = message;
    errorMessage.style.display = 'block';
    errorMessage.classList.add('chatbox'); // Add the 'chatbox' class to the error message

    setTimeout(() => {
      errorMessage.style.display = 'none';
      errorMessage.classList.remove('chatbox'); // Remove the 'chatbox' class after hiding the message
    }, 1000); // Hide the error message after 10 seconds
  }

async function checkBackgroundNoise(stream) {
  try {
    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    const microphone = audioContext.createMediaStreamSource(stream);
    microphone.connect(analyser);

    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteFrequencyData(dataArray);
    const averageVolume = dataArray.reduce((acc, val) => acc + val) / bufferLength;
    console.log('Average Volume:', averageVolume); 

    if (averageVolume < 50) {
      showError('Background noise detected. Please ensure you are in a quiet environment to take the test.');
      canvasContainer.style.border = '4px solid red'; 
    } else {
      canvasContainer.style.border = '4px solid green'; 
    }

    analyser.disconnect();
    microphone.disconnect();
  } catch (error) {
    showError('Error accessing the microphone: ' + error.message);
    canvasContainer.style.border = '4px solid red'; 
  }
}
async function checkMicrophoneStatus() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    const microphone = audioContext.createMediaStreamSource(stream);
    microphone.connect(analyser);

    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteFrequencyData(dataArray);
    const averageVolume = dataArray.reduce((acc, val) => acc + val) / bufferLength;
    console.log('Average Volume:', averageVolume);

    if (averageVolume < 50) {
      showError('Microphone volume is low or muted. Please increase the volume or unmute the microphone for the test.');
      canvasContainer.style.border = '4px solid red';
    } else {
      canvasContainer.style.border = '4px solid green';
      checkBackgroundNoise(stream);
      checkNetworkConnection();
    }

    analyser.disconnect();
    microphone.disconnect();
    stream.getTracks().forEach(track => track.stop());
  } catch (error) {
    showError('Error accessing the microphone: ' + error.message);
    canvasContainer.style.border = '4px solid red';
  }
}


function checkWebcamStatus() {
  if (!video.srcObject || video.srcObject.active === false) {
    showError('Webcam stream is closed or unavailable. Please make sure your webcam is enabled and try again.');
    canvasContainer.style.border = '4px solid red';
  } else {
    canvasContainer.style.border = '4px solid green';
    checkFaceVisibility();
  }
}
setInterval(checkWebcamStatus, 1000);
async function checkNetworkConnection() {
  const networkCircleElement = document.getElementById('network-circle');
  if (networkCircleElement) {
    const isOnline = navigator.onLine;

    if (isOnline) {
      networkCircleElement.classList.add('success-circle');
    } else {
      showError('No network connection. Please ensure you are connected to the internet to take the test.');
      networkCircleElement.classList.add('error-circle');
    }
  } else {
    console.error('Element with ID "network-circle" not found.');
  }
}
function showError(message) {
  errorMessage.innerHTML = message;
  errorMessage.style.display = 'block';
  errorMessage.classList.add('chatbox'); 

  setTimeout(() => {
    errorMessage.style.display = 'none';
    errorMessage.classList.remove('chatbox'); 
  }, 10000); 
}


function isBrowserSupported() {
  return !!(navigator.getUserMedia && window.MediaRecorder && document.fullscreenEnabled);
}

if (!isBrowserSupported()) {
  showError('Your browser is not supported. Please use a modern browser to take the test.');
}

function checkFullScreenModeSupport() {
  const isFullScreenEnabled = document.fullscreenEnabled || document.mozFullScreenEnabled || document.webkitFullscreenEnabled || document.msFullscreenEnabled;

  if (!isFullScreenEnabled) {
    showError('Full-screen mode is disabled. Please enable full-screen mode to take the test.');
  }
}
navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((stream) => {
        checkMicrophoneStatus();
        checkBackgroundNoise(stream);
        checkNetworkConnection();
        checkFullScreenModeSupport();
      })
      .catch((error) => {
        console.error('Error accessing media devices:', error);
      });

    startVideo();
    checkFaceVisibility(); // Initial check
  });