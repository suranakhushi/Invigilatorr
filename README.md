# Invigilatorr
a.main indexx- comprises of code for the first 2 webpages i.e. the various checks plus capturing picture.

b.index.html - it comprises of the html and css code for the last webpage

c.mainscript.js-
startVideo(): Requests access to the user's webcam using getUserMedia and sets up the video stream on the video element. It also adjusts the display size of the video and canvas elements according to the loaded metadata. It then calls the detectFace() function to start face detection.

detectFace(): Uses faceapi.js to detect faces in the video stream. It repeatedly checks for faces at 10-second intervals and changes the border color of the canvas-container element to green when a face is detected or red when no face is visible. It also displays an error message if the face is not visible.

checkMicrophoneStatus(): Checks the microphone volume using the Web Audio API. If the volume is low or muted, it displays an error message. Otherwise, it calls checkBackgroundNoise() to check for background noise.

checkBackgroundNoise(stream): Uses the Web Audio API to analyze background noise from the microphone stream. If background noise is detected, it displays an error message.

checkWebcamStatus(): Checks whether the webcam stream is active or closed. If it's closed or unavailable, it displays an error message.

checkNetworkConnection(): Checks if the user is connected to the internet and displays an error message if there is no network connection.

isBrowserSupported(): Checks if the browser supports the necessary features (getUserMedia, MediaRecorder, and full-screen mode).

checkFullScreenModeSupport(): Checks if full-screen mode is enabled and displays an error message if it's disabled.

showError(message): Helper function to display error messages in a chat box format. It sets the errorMessage element's content and style to show the message for a short duration.
