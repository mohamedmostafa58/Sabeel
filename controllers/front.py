import cv2
import numpy as np
import sys
def detect_faces(image_data):
    image_np = np.frombuffer(image_data, dtype=np.uint8)
    
    image = cv2.imdecode(image_np, cv2.IMREAD_COLOR)
    
    if image is None:
        return False  
        
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))
    return len(faces) > 0 

if __name__ == "__main__":
    image_data = sys.stdin.buffer.read()

    has_face = detect_faces(image_data)
    print(has_face)

