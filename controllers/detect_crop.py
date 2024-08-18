import cv2
import pytesseract
import sys

def is_text_near_edges(image_path, edge_margin=10, min_text_length=30, resize_factor=0.5):
    image = cv2.imread(image_path)
    
    # Resize the image to reduce processing time
    resized_image = cv2.resize(image, None, fx=resize_factor, fy=resize_factor)
    
    gray = cv2.cvtColor(resized_image, cv2.COLOR_BGR2GRAY)
    
    # Apply bilateral filtering to remove noise
    denoised = cv2.bilateralFilter(gray, 9, 75, 75)
    
    # Apply adaptive thresholding
    thresh = cv2.adaptiveThreshold(denoised, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
                                   cv2.THRESH_BINARY_INV, 11, 2)
    
    h, w = thresh.shape
    
    # Define edge regions
    edges_roi = [
        thresh[0:int(edge_margin*resize_factor), :],            
        thresh[h-int(edge_margin*resize_factor):h, :],          
        thresh[:, 0:int(edge_margin*resize_factor)],            
        thresh[:, w-int(edge_margin*resize_factor):w]          
    ]
    
    for roi in edges_roi:
        # Use a minimum area filter to ignore small noise regions
        contours, _ = cv2.findContours(roi, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        for contour in contours:
            x, y, roi_w, roi_h = cv2.boundingRect(contour)
            if roi_w * roi_h > 100:  # Minimum area threshold
                text = pytesseract.image_to_string(roi[y:y+roi_h, x:x+roi_w], config='--psm 6')
                if len(text.strip()) > min_text_length:
                    return True 
    return False

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Usage: python detect_crop.py <image_path>")
        sys.exit(1)

    image_path = sys.argv[1]
    
    cropped = is_text_near_edges(image_path)
    print(cropped)

# import cv2
# import pytesseract
# import sys

# def is_text_near_edges(image_path, edge_margin=8, min_text_length=40):
#     image = cv2.imread(image_path)
#     gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    
#     # Apply bilateral filtering to remove noise
#     denoised = cv2.bilateralFilter(gray, 9, 75, 75)
    
#     # Apply adaptive thresholding
#     thresh = cv2.adaptiveThreshold(denoised, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
#                                    cv2.THRESH_BINARY_INV, 11, 2)
    
#     h, w = thresh.shape
    
#     # Define edge regions
#     edges_roi = [
#         thresh[0:edge_margin, :],            
#         thresh[h-edge_margin:h, :],          
#         thresh[:, 0:edge_margin],            
#         thresh[:, w-edge_margin:w]          
#     ]
    
#     for roi in edges_roi:
#         # Use a minimum area filter to ignore small noise regions
#         contours, _ = cv2.findContours(roi, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
#         for contour in contours:
#             x, y, roi_w, roi_h = cv2.boundingRect(contour)
#             if roi_w * roi_h > 100:  # Minimum area threshold
#                 text = pytesseract.image_to_string(roi[y:y+roi_h, x:x+roi_w], config='--psm 6')
#                 if len(text.strip()) > min_text_length:
#                     return True 
#     return False

# if __name__ == '__main__':
#     if len(sys.argv) < 2:
#         print("Usage: python detect_crop.py <image_path>")
#         sys.exit(1)

#     image_path = sys.argv[1]
    
#     cropped = is_text_near_edges(image_path)
#     print(cropped)
