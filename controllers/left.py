import cv2
import numpy as np
import sys
def analyze_gaze_direction(image_data):
    # Convert image_data (bytes) to numpy array and decode
    image_np = np.frombuffer(image_data, dtype=np.uint8)
    image = cv2.imdecode(image_np, cv2.IMREAD_COLOR)

    if image is None:
        return False

    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # Initialize the detectors
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    profile_face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_profileface.xml')
    eye_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_eye.xml')

    # Frontal face detection
    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))
    if len(faces) > 0:
        for (x, y, w, h) in faces:
            roi_gray = gray[y:y+h, x:x+w]
            eyes = eye_cascade.detectMultiScale(roi_gray)
            if len(eyes) >= 2:
                return False


    gray_flipped = cv2.flip(gray, 1)
    faces_left = profile_face_cascade.detectMultiScale(gray_flipped, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))
    if len(faces_left) > 0:
     return True
    else:
        return False
if __name__ == "__main__":
    image_data = sys.stdin.buffer.read()

    has_face = analyze_gaze_direction(image_data)
    print(has_face)

