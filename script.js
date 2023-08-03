const socket = io('http://localhost:5500')

socket.on('hello from server', (...args) => {
  console.log('hello from server', ...args)
})

let isPopSoundPlayed = false
let cameraStream = null
let audioStream = null

const video = document.getElementById('video')
const canvas = document.getElementById('canvas')
const canvasContainer = document.getElementById('canvas-container')
const errorMessage = document.getElementById('error-message')

if (!video || !canvas || !canvasContainer || !errorMessage) {
  console.error('Required elements not found.')
}

let displaySize = { width: 560, height: 560 }

if (video) {
  video.width = displaySize.width
  video.height = displaySize.height
}
if (canvas) {
  canvas.width = displaySize.width
  canvas.height = displaySize.height
}

async function startVideo() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: {} })
    if (video) {
      video.srcObject = stream
      video.addEventListener('loadedmetadata', () => {
        displaySize = { width: video.videoWidth, height: video.videoHeight }
        video.width = displaySize.width
        video.height = displaySize.height
        faceapi.matchDimensions(canvas, displaySize)
        detectFace()
      })
      cameraStream = stream
    }
  } catch (err) {
    console.error('Error accessing the camera: ', err)
    showError('Error accessing the camera: ' + err.message)
    canvasContainer.style.border = '4px solid red'
    socket.emit('canvas-color', 'red')
    playPopSound()
  }
}

startVideo()

async function detectFace() {
  if (canvas) {
    try {
      await faceapi.nets.tinyFaceDetector.loadFromUri('./models')
      const ctx = canvas.getContext('2d')

      setInterval(async () => {
        const detections = await faceapi.detectAllFaces(
          video,
          new faceapi.TinyFaceDetectorOptions()
        )
        const resizedDetections = faceapi.resizeResults(detections, displaySize)
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        if (resizedDetections.length > 0) {
          const numFacesDetected = resizedDetections.length
          socket.emit('num-faces-detected', numFacesDetected)

          if (numFacesDetected === 1) {
            canvasContainer.style.border = '4px solid green'
            socket.emit('canvas-color', 'green')
          } else {
            const errorMessage = `Multiple faces detected. Please ensure only one face is visible in the camera. Detected: ${numFacesDetected}`
            socket.emit('error-message', errorMessage)

            showError(errorMessage)
            playPopSound()

            canvasContainer.style.border = '4px solid red'
            socket.emit('canvas-color', 'red')
          }
        } else {
          const errorMessage =
            'No face detected. Please ensure your face is visible and looking into the camera.'
          socket.emit('error-message', errorMessage)

          showError(errorMessage)
          playPopSound()

          canvasContainer.style.border = '4px solid red'
          socket.emit('canvas-color', 'red')
        }
      }, 10000)
    } catch (error) {
      console.error('Error detecting face:', error)

      const errorMessage = 'Error detecting face: ' + error.message
      socket.emit('error-message', errorMessage)

      showError(errorMessage)
      canvasContainer.style.border = '4px solid red'
      socket.emit('canvas-color', 'red')
      playPopSound()
    }
  }
}

async function checkBackgroundNoise(stream) {
  try {
    const audioContext = new AudioContext()
    const analyser = audioContext.createAnalyser()
    const microphone = audioContext.createMediaStreamSource(stream)
    microphone.connect(analyser)

    analyser.fftSize = 256
    const bufferLength = analyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)
    analyser.getByteFrequencyData(dataArray)
    const averageVolume =
      dataArray.reduce((acc, val) => acc + val) / bufferLength

    if (averageVolume < 50) {
      canvasContainer.style.border = '4px solid red'
      socket.emit('canvas-color', 'red')
      showError(
        'Background noise detected. Please ensure you are in a quiet environment to take the test.'
      )
      playPopSound()
    } else {
      canvasContainer.style.border = '4px solid green'
      socket.emit('canvas-color', 'green')
    }

    analyser.disconnect()
    microphone.disconnect()
  } catch (error) {
    showError('Error accessing the microphone: ' + error.message)
    canvasContainer.style.border = '4px solid red'
    socket.emit('canvas-color', 'red')
    playPopSound()
  }
}

async function checkMicrophoneStatus() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    const audioContext = new AudioContext()
    const analyser = audioContext.createAnalyser()
    const microphone = audioContext.createMediaStreamSource(stream)
    microphone.connect(analyser)

    analyser.fftSize = 256
    const bufferLength = analyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)
    analyser.getByteFrequencyData(dataArray)
    const averageVolume =
      dataArray.reduce((acc, val) => acc + val) / bufferLength

    if (averageVolume < 50) {
      canvasContainer.style.border = '4px solid red'
      socket.emit('canvas-color', 'red')
      showError(
        'Microphone volume is low or muted. Please increase the volume or unmute the microphone for the test.'
      )
      playPopSound()
    } else {
      canvasContainer.style.border = '4px solid green'
      socket.emit('canvas-color', 'green')
      checkBackgroundNoise(stream)
      checkNetworkConnection()
    }

    analyser.disconnect()
    microphone.disconnect()
    stream.getTracks().forEach((track) => track.stop())
  } catch (error) {
    showError('Error accessing the microphone: ' + error.message)
    canvasContainer.style.border = '4px solid red'
    socket.emit('canvas-color', 'red')
    playPopSound()
  }
}

function checkWebcamStatus() {
  if (!video.srcObject || video.srcObject.active === false) {
    showError(
      'Webcam stream is closed or unavailable. Please make sure your webcam is enabled and try again.'
    )
    canvasContainer.style.border = '4px solid red'
    socket.emit('canvas-color', 'red')
    playPopSound()
  } else {
    canvasContainer.style.border = '4px solid green'
    socket.emit('canvas-color', 'green')
    checkFaceVisibility()
  }
}

setInterval(checkWebcamStatus, 1000)

async function checkNetworkConnection() {
  const networkCircleElement = document.getElementById('network-circle')
  if (networkCircleElement) {
    const isOnline = navigator.onLine
    if (isOnline) {
      networkCircleElement.classList.add('success-circle')
    } else {
      showError(
        'No network connection. Please ensure you are connected to the internet to take the test.'
      )
      networkCircleElement.classList.add('error-circle')
      socket.emit('canvas-color', 'red')
      playPopSound()
    }
  } else {
    console.error('Element with ID "network-circle" not found.')
  }
}

function playPopSound() {
  if (!isPopSoundPlayed) {
    const popSound = new Audio('pop-39222.mp3')
    popSound.play()
    isPopSoundPlayed = true
  }
}

function showError(message) {
  errorMessage.innerHTML = message
  errorMessage.style.display = 'block'
  errorMessage.classList.add('chatbox')

  if (!isPopSoundPlayed) {
    playPopSound()
  }

  setTimeout(() => {
    errorMessage.style.display = 'none'
    errorMessage.classList.remove('chatbox')
  }, 10000)
}

function isBrowserSupported() {
  return !!(
    navigator.getUserMedia &&
    window.MediaRecorder &&
    document.fullscreenEnabled
  )
}

if (!isBrowserSupported()) {
  showError(
    'Your browser is not supported. Please use a modern browser to take the test.'
  )
}

function checkFullScreenModeSupport() {
  const isFullScreenEnabled =
    document.fullscreenEnabled ||
    document.mozFullScreenEnabled ||
    document.webkitFullscreenEnabled ||
    document.msFullscreenEnabled

  if (!isFullScreenEnabled) {
    showError(
      'Full-screen mode is disabled. Please enable full-screen mode to take the test.'
    )
  }
}

navigator.mediaDevices
  .getUserMedia({ video: true, audio: true })
  .then((stream) => {
    checkMicrophoneStatus()
    checkBackgroundNoise(stream)
    checkNetworkConnection()
    checkFullScreenModeSupport()
  })
  .catch((error) => {
    console.error('Error accessing media devices:', error)
  })
