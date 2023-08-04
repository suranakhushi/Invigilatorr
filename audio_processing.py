import sys
import numpy as np
import librosa

def is_someone_talking(audio_stream):
    audio_data = np.frombuffer(audio_stream, dtype=np.float32)
    sr = 44100
    rms_energy = librosa.feature.rms(y=audio_data, frame_length=2048, hop_length=512, center=True)
    speech_threshold = 0.1

    if np.max(rms_energy) > speech_threshold:
        return True
    else:
        return False


print("hello world")
audio_stream = sys.stdin.buffer.read()

if is_someone_talking(audio_stream):
    print('someone_talking', flush=True)

