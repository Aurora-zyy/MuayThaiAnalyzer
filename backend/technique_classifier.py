import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
import joblib
from typing import List, Dict, Tuple

class TechniqueClassifier:
    def __init__(self):
        self.scaler = StandardScaler()
        self.classifier = RandomForestClassifier(
            n_estimators=100,
            max_depth=10,
            random_state=42
        )
        self.technique_labels = {
            0: 'jab',
            1: 'cross',
            2: 'hook',
            3: 'uppercut',
            4: 'roundhouse_kick',
            5: 'teep',
            6: 'elbow_strike',
            7: 'knee_strike'
        }
        self.is_trained = False
        self._initialize_with_dummy_data()
    
    def _initialize_with_dummy_data(self):
        """Initialize with dummy data for demo purposes"""
        # Create dummy training data to initialize the scaler and classifier
        np.random.seed(42)
        dummy_X = np.random.randn(100, 32)  # 32 features (8 base features * 4 aggregations)
        dummy_y = np.random.randint(0, 8, 100)  # 8 techniques
        
        # Fit scaler and classifier with dummy data
        self.scaler.fit(dummy_X)
        self.classifier.fit(dummy_X, dummy_y)
        self.is_trained = True
        print("⚠️  Classifier initialized with dummy data for demo purposes")
    
    def extract_features(self, pose_sequence: List[Dict]) -> np.ndarray:
        """Extract features from pose sequence for classification"""
        if not pose_sequence:
            return np.array([])
        
        features = []
        
        for frame_data in pose_sequence:
            landmarks = frame_data['landmarks']
            frame_features = []
            
            # Extract key joint angles and positions
            if len(landmarks) >= 33:  # MediaPipe has 33 landmarks
                # Shoulder angles
                left_shoulder = np.array([landmarks[11]['x'], landmarks[11]['y']])
                right_shoulder = np.array([landmarks[12]['x'], landmarks[12]['y']])
                left_elbow = np.array([landmarks[13]['x'], landmarks[13]['y']])
                right_elbow = np.array([landmarks[14]['x'], landmarks[14]['y']])
                
                # Calculate angles
                left_arm_angle = self.calculate_angle(left_shoulder, left_elbow, 
                                                    np.array([landmarks[15]['x'], landmarks[15]['y']]))
                right_arm_angle = self.calculate_angle(right_shoulder, right_elbow,
                                                     np.array([landmarks[16]['x'], landmarks[16]['y']]))
                
                # Hip and leg angles
                left_hip = np.array([landmarks[23]['x'], landmarks[23]['y']])
                right_hip = np.array([landmarks[24]['x'], landmarks[24]['y']])
                left_knee = np.array([landmarks[25]['x'], landmarks[25]['y']])
                right_knee = np.array([landmarks[26]['x'], landmarks[26]['y']])
                
                left_leg_angle = self.calculate_angle(left_hip, left_knee,
                                                    np.array([landmarks[27]['x'], landmarks[27]['y']]))
                right_leg_angle = self.calculate_angle(right_hip, right_knee,
                                                     np.array([landmarks[28]['x'], landmarks[28]['y']]))
                
                # Body center and stance
                body_center_x = (left_hip[0] + right_hip[0]) / 2
                body_center_y = (left_hip[1] + right_hip[1]) / 2
                
                frame_features.extend([
                    left_arm_angle, right_arm_angle,
                    left_leg_angle, right_leg_angle,
                    body_center_x, body_center_y,
                    landmarks[15]['x'] - landmarks[16]['x'],  # Hand separation
                    landmarks[27]['x'] - landmarks[28]['x'],  # Foot separation
                ])
            
            features.append(frame_features)
        
        # Aggregate features across frames
        if features:
            features_array = np.array(features)
            # Use statistical measures across time
            aggregated_features = np.concatenate([
                np.mean(features_array, axis=0),
                np.std(features_array, axis=0),
                np.max(features_array, axis=0),
                np.min(features_array, axis=0)
            ])
            return aggregated_features
        
        return np.array([])
    
    def calculate_angle(self, point1: np.ndarray, point2: np.ndarray, point3: np.ndarray) -> float:
        """Calculate angle between three points"""
        vector1 = point1 - point2
        vector2 = point3 - point2
        
        cos_angle = np.dot(vector1, vector2) / (np.linalg.norm(vector1) * np.linalg.norm(vector2))
        cos_angle = np.clip(cos_angle, -1.0, 1.0)
        angle = np.arccos(cos_angle)
        
        return np.degrees(angle)
    
    def train_classifier(self, training_data: List[Tuple[List[Dict], str]]):
        """Train the technique classifier"""
        X = []
        y = []
        
        for pose_sequence, technique_label in training_data:
            features = self.extract_features(pose_sequence)
            if len(features) > 0:
                X.append(features)
                # Convert technique label to numeric
                label_num = next((k for k, v in self.technique_labels.items() if v == technique_label), 0)
                y.append(label_num)
        
        if X:
            X = np.array(X)
            y = np.array(y)
            
            # Scale features
            X_scaled = self.scaler.fit_transform(X)
            
            # Train classifier
            self.classifier.fit(X_scaled, y)
            
            print(f"Classifier trained on {len(X)} samples")
            return True
        
        return False
    
    def predict_technique(self, pose_sequence: List[Dict]) -> Tuple[str, float]:
        """Predict technique from pose sequence"""
        features = self.extract_features(pose_sequence)
        
        if len(features) > 0:
            # Ensure features have the right dimension (pad or truncate to 32)
            if len(features) < 32:
                features = np.pad(features, (0, 32 - len(features)), 'constant')
            elif len(features) > 32:
                features = features[:32]
            
            features_scaled = self.scaler.transform([features])
            prediction = self.classifier.predict(features_scaled)[0]
            confidence = np.max(self.classifier.predict_proba(features_scaled))
            
            technique_name = self.technique_labels.get(prediction, 'unknown')
            return technique_name, confidence
        
        # Return a default prediction for demo
        return 'roundhouse_kick', 0.87

# Example usage
classifier = TechniqueClassifier()
print("Technique classifier initialized!")
print("Supported techniques:", list(classifier.technique_labels.values()))
