# Invigilatorr
a.main indexx- comprises of code for the first 2 webpages i.e. the various checks plus capturing picture.
b.index.html - it comprises of the html and css code for the last webpage
c.mainscript.js-
1. `DOMContentLoaded` Event Listener:
   - This event listener is triggered when the DOM (Document Object Model) is fully loaded and ready for manipulation.
   - It sets up various elements needed for the video and facial recognition.

2. `startVideo()` Function:
   - This function initializes the video stream from the user's webcam and sets up event listeners to handle the video stream.
   - It uses the `navigator.mediaDevices.getUserMedia()` method to access the user's webcam.
   - It resizes the video element and canvas to match the dimensions of the video stream.
   - It calls the `detectFace()` function to start detecting faces in the video stream.

3. `detectFace()` Function:
   - This function uses the FaceAPI.js library to detect faces in the video stream.
   - It draws the detected face landmarks on the canvas.
   - It checks if multiple faces are detected and shows an error message if needed.

4. `checkFaceVisibility()` Function:
   - This function is used to check if a face is visible in the video stream.
   - It uses FaceAPI.js to detect faces and checks the number of detected faces.
   - If no face is detected, it shows an error message.

5. `checkMultipleFaces()` Function:
   - This function is used to check if multiple faces are detected in the video stream.
   - It uses FaceAPI.js to detect faces and counts the number of detected faces.
   - If more than one face is detected, it shows an error message.

6. `checkBackgroundNoise(stream)` Function:
   - This function is used to check the background noise level when the microphone is active.
   - It creates an audio context, connects the microphone stream to an analyzer, and calculates the average volume.
   - If the average volume is too low (indicating background noise), it shows an error message.

7. `checkMicrophoneStatus()` Function:
   - This function checks the status of the user's microphone.
   - It uses `navigator.mediaDevices.getUserMedia()` to access the microphone stream.
   - It checks the microphone volume level and calls the `checkBackgroundNoise()` function if the volume is sufficient.

8. `checkWebcamStatus()` Function:
   - This function checks the status of the webcam stream.
   - It shows an error message if the webcam stream is closed or unavailable.

9. `checkNetworkConnection()` Function:
   - This function checks if the user's device has an active network connection.
   - It adds a class to a specific element to indicate the network status (success-circle or error-circle).
   - It shows an error message if there is no network connection.

10. `showError(message)` Function:
   - This function is a helper function to display error messages in a chatbox format.
   - It sets the error message content, displays it, and adds/removes the "chatbox" class for styling.

11. `isBrowserSupported()` Function:
   - This function checks if the user's browser supports the necessary features (getUserMedia, MediaRecorder, fullscreenEnabled).
   - It shows an error message if the browser is not supported.

12. `checkFullScreenModeSupport()` Function:
   - This function checks if the full-screen mode is supported in the user's browser.
   - It shows an error message if full-screen mode is disabled.

13. `navigator.mediaDevices.getUserMedia()`:
   - This method is used to access the user's media devices (webcam and microphone) and returns a promise.
   - It is called initially to check microphone status, background noise, network connection, and full-screen mode support.
