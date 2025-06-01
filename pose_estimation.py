import cv2
import numpy as np
import mediapipe as mp
from typing import List, Dict, Tuple
import json

class MuayThaiPoseAnalyzer:
    def __init__(self):
        # Initialize MediaPipe Pose
        self.mp_pose = mp.solutions.pose
        self.pose = self.mp_pose.Pose(
            static_image_mode=False,
            model_complexity=2,
            enable_segmentation=False,
            min_detection_confidence=0.5,
            min_tracking_confidence=0.5
        )
        self.mp_drawing = mp.solutions.drawing_utils
        
        # Define key body landmarks for Muay Thai analysis
        self.key_landmarks = {
            'left_shoulder': 11,
            'right_shoulder': 12,
            'left_elbow': 13,
            'right_elbow': 14,
            'left_wrist': 15,
            'right_wrist': 16,
            'left_hip': 23,
            'right_hip': 24,
            'left_knee': 25,
            'right_knee': 26,
            'left_ankle': 27,
            'right_ankle': 28,
            'nose': 0
        }
    
    def extract_pose_from_frame(self, frame):
        """Extract pose landmarks from a single frame"""
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = self.pose.process(rgb_frame)
        
        if results.pose_landmarks:
            landmarks = []
            for landmark in results.pose_landmarks.landmark:
                landmarks.append({
                    'x': landmark.x,
                    'y': landmark.y,
                    'z': landmark.z,
                    'visibility': landmark.visibility
                })
            return landmarks
        return None
    
    def analyze_video(self, video_path: str) -> Dict:
        """Analyze entire video and extract pose data"""
        cap = cv2.VideoCapture(video_path)
        frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        fps = cap.get(cv2.CAP_PROP_FPS)
        
        pose_data = []
        frame_idx = 0
        
        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break
                
            landmarks = self.extract_pose_from_frame(frame)
            if landmarks:
                pose_data.append({
                    'frame': frame_idx,
                    'timestamp': frame_idx / fps,
                    'landmarks': landmarks
                })
            
            frame_idx += 1
        
        cap.release()
        
        return {
            'total_frames': frame_count,
            'fps': fps,
            'duration': frame_count / fps,
            'pose_sequence': pose_data
        }

# Example usage
analyzer = MuayThaiPoseAnalyzer()
print("Pose analyzer initialized successfully!")
print("Key landmarks tracked:", list(analyzer.key_landmarks.keys()))
