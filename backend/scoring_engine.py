import numpy as np
from typing import Dict, List, Tuple
import math

class MuayThaiScoringEngine:
    def __init__(self):
        # Professional reference poses for comparison
        self.reference_poses = {
            'jab': {
                'key_angles': {
                    'lead_arm_extension': 160,  # degrees
                    'rear_guard_position': 90,
                    'hip_rotation': 15,
                    'stance_width': 0.3  # normalized
                }
            },
            'roundhouse_kick': {
                'key_angles': {
                    'kicking_leg_angle': 90,
                    'supporting_leg_pivot': 180,
                    'hip_rotation': 90,
                    'torso_lean': 20
                }
            }
        }
    
    def calculate_form_score(self, pose_sequence: List[Dict], technique: str) -> Dict:
        """Calculate form score based on pose analysis"""
        if technique not in self.reference_poses:
            return {'score': 0, 'feedback': 'Technique not recognized'}
        
        reference = self.reference_poses[technique]
        form_scores = []
        detailed_feedback = []
        
        for frame_data in pose_sequence:
            landmarks = frame_data['landmarks']
            frame_score = 0
            
            if len(landmarks) >= 33:
                # Analyze key body positions
                if technique == 'jab':
                    frame_score, feedback = self._analyze_jab_form(landmarks, reference)
                elif technique == 'roundhouse_kick':
                    frame_score, feedback = self._analyze_kick_form(landmarks, reference)
                
                form_scores.append(frame_score)
                detailed_feedback.extend(feedback)
        
        # Calculate overall form score
        if form_scores:
            avg_score = np.mean(form_scores)
            # Normalize to 0-100 scale
            final_score = min(100, max(0, avg_score))
            
            return {
                'score': round(final_score),
                'feedback': self._generate_form_feedback(detailed_feedback, final_score),
                'frame_scores': form_scores
            }
        
        return {'score': 0, 'feedback': 'Unable to analyze form'}
    
    def calculate_chain_of_power_score(self, pose_sequence: List[Dict], technique: str) -> Dict:
        """Calculate kinetic chain efficiency score"""
        power_scores = []
        
        for i in range(1, len(pose_sequence)):
            prev_frame = pose_sequence[i-1]['landmarks']
            curr_frame = pose_sequence[i]['landmarks']
            
            if len(prev_frame) >= 33 and len(curr_frame) >= 33:
                # Analyze power generation sequence
                hip_rotation = self._calculate_hip_rotation(prev_frame, curr_frame)
                shoulder_engagement = self._calculate_shoulder_movement(prev_frame, curr_frame)
                weight_transfer = self._calculate_weight_transfer(prev_frame, curr_frame)
                
                # Combine power metrics
                power_score = (hip_rotation * 0.4 + shoulder_engagement * 0.3 + weight_transfer * 0.3)
                power_scores.append(power_score)
        
        if power_scores:
            avg_power = np.mean(power_scores)
            final_score = min(100, max(0, avg_power * 100))
            
            return {
                'score': round(final_score),
                'feedback': self._generate_power_feedback(final_score),
                'components': {
                    'hip_rotation': round(np.mean([self._calculate_hip_rotation(
                        pose_sequence[i-1]['landmarks'], pose_sequence[i]['landmarks']
                    ) for i in range(1, len(pose_sequence))]) * 100),
                    'shoulder_engagement': round(np.mean([self._calculate_shoulder_movement(
                        pose_sequence[i-1]['landmarks'], pose_sequence[i]['landmarks']
                    ) for i in range(1, len(pose_sequence))]) * 100),
                    'weight_transfer': round(np.mean([self._calculate_weight_transfer(
                        pose_sequence[i-1]['landmarks'], pose_sequence[i]['landmarks']
                    ) for i in range(1, len(pose_sequence))]) * 100)
                }
            }
        
        return {'score': 0, 'feedback': 'Unable to analyze power chain'}
    
    def calculate_explosiveness_score(self, pose_sequence: List[Dict]) -> Dict:
        """Calculate speed and explosiveness score"""
        velocities = []
        accelerations = []
        
        # Calculate hand/foot velocities
        for i in range(2, len(pose_sequence)):
            dt = pose_sequence[i]['timestamp'] - pose_sequence[i-1]['timestamp']
            if dt > 0:
                # Calculate velocity of striking limb
                velocity = self._calculate_limb_velocity(
                    pose_sequence[i-2]['landmarks'],
                    pose_sequence[i-1]['landmarks'],
                    pose_sequence[i]['landmarks'],
                    dt
                )
                velocities.append(velocity)
                
                if len(velocities) >= 2:
                    acceleration = (velocities[-1] - velocities[-2]) / dt
                    accelerations.append(abs(acceleration))
        
        if velocities:
            max_velocity = max(velocities)
            avg_acceleration = np.mean(accelerations) if accelerations else 0
            
            # Normalize and combine metrics
            velocity_score = min(100, max_velocity * 1000)  # Scale factor
            acceleration_score = min(100, avg_acceleration * 500)  # Scale factor
            
            final_score = (velocity_score * 0.6 + acceleration_score * 0.4)
            
            return {
                'score': round(final_score),
                'feedback': self._generate_explosiveness_feedback(final_score),
                'max_velocity': round(max_velocity, 3),
                'avg_acceleration': round(avg_acceleration, 3)
            }
        
        return {'score': 0, 'feedback': 'Unable to analyze explosiveness'}
    
    def _analyze_jab_form(self, landmarks: List[Dict], reference: Dict) -> Tuple[float, List[str]]:
        """Analyze jab-specific form"""
        score = 0
        feedback = []
        
        # Check arm extension
        left_shoulder = np.array([landmarks[11]['x'], landmarks[11]['y']])
        left_elbow = np.array([landmarks[13]['x'], landmarks[13]['y']])
        left_wrist = np.array([landmarks[15]['x'], landmarks[15]['y']])
        
        arm_angle = self._calculate_angle_3points(left_shoulder, left_elbow, left_wrist)
        target_angle = reference['key_angles']['lead_arm_extension']
        
        angle_diff = abs(arm_angle - target_angle)
        if angle_diff < 10:
            score += 25
            feedback.append("Good arm extension")
        elif angle_diff < 20:
            score += 15
            feedback.append("Arm extension needs slight adjustment")
        else:
            score += 5
            feedback.append("Improve arm extension")
        
        # Check stance and balance
        left_hip = np.array([landmarks[23]['x'], landmarks[23]['y']])
        right_hip = np.array([landmarks[24]['x'], landmarks[24]['y']])
        stance_width = abs(left_hip[0] - right_hip[0])
        
        if 0.2 < stance_width < 0.4:
            score += 25
            feedback.append("Good stance width")
        else:
            score += 10
            feedback.append("Adjust stance width")
        
        return score, feedback
    
    def _analyze_kick_form(self, landmarks: List[Dict], reference: Dict) -> Tuple[float, List[str]]:
        """Analyze kick-specific form"""
        score = 0
        feedback = []
        
        # Check kicking leg position
        right_hip = np.array([landmarks[24]['x'], landmarks[24]['y']])
        right_knee = np.array([landmarks[26]['x'], landmarks[26]['y']])
        right_ankle = np.array([landmarks[28]['x'], landmarks[28]['y']])
        
        leg_angle = self._calculate_angle_3points(right_hip, right_knee, right_ankle)
        
        if 80 < leg_angle < 100:
            score += 30
            feedback.append("Excellent leg position")
        elif 70 < leg_angle < 110:
            score += 20
            feedback.append("Good leg position")
        else:
            score += 10
            feedback.append("Adjust leg angle")
        
        return score, feedback
    
    def _calculate_angle_3points(self, p1: np.ndarray, p2: np.ndarray, p3: np.ndarray) -> float:
        """Calculate angle between three points"""
        v1 = p1 - p2
        v2 = p3 - p2
        cos_angle = np.dot(v1, v2) / (np.linalg.norm(v1) * np.linalg.norm(v2))
        return np.degrees(np.arccos(np.clip(cos_angle, -1, 1)))
    
    def _calculate_hip_rotation(self, prev_landmarks: List[Dict], curr_landmarks: List[Dict]) -> float:
        """Calculate hip rotation between frames"""
        prev_left_hip = np.array([prev_landmarks[23]['x'], prev_landmarks[23]['y']])
        prev_right_hip = np.array([prev_landmarks[24]['x'], prev_landmarks[24]['y']])
        curr_left_hip = np.array([curr_landmarks[23]['x'], curr_landmarks[23]['y']])
        curr_right_hip = np.array([curr_landmarks[24]['x'], curr_landmarks[24]['y']])
        
        prev_hip_vector = prev_right_hip - prev_left_hip
        curr_hip_vector = curr_right_hip - curr_left_hip
        
        # Calculate rotation angle
        cos_angle = np.dot(prev_hip_vector, curr_hip_vector) / (
            np.linalg.norm(prev_hip_vector) * np.linalg.norm(curr_hip_vector)
        )
        rotation = abs(np.degrees(np.arccos(np.clip(cos_angle, -1, 1))))
        
        return min(1.0, rotation / 45.0)  # Normalize to 0-1
    
    def _calculate_shoulder_movement(self, prev_landmarks: List[Dict], curr_landmarks: List[Dict]) -> float:
        """Calculate shoulder engagement"""
        prev_left_shoulder = np.array([prev_landmarks[11]['x'], prev_landmarks[11]['y']])
        prev_right_shoulder = np.array([prev_landmarks[12]['x'], prev_landmarks[12]['y']])
        curr_left_shoulder = np.array([curr_landmarks[11]['x'], curr_landmarks[11]['y']])
        curr_right_shoulder = np.array([curr_landmarks[12]['x'], curr_landmarks[12]['y']])
        
        left_movement = np.linalg.norm(curr_left_shoulder - prev_left_shoulder)
        right_movement = np.linalg.norm(curr_right_shoulder - prev_right_shoulder)
        
        total_movement = left_movement + right_movement
        return min(1.0, total_movement * 10)  # Scale and normalize
    
    def _calculate_weight_transfer(self, prev_landmarks: List[Dict], curr_landmarks: List[Dict]) -> float:
        """Calculate weight transfer efficiency"""
        # Simplified weight transfer calculation based on center of mass movement
        prev_com_x = (prev_landmarks[23]['x'] + prev_landmarks[24]['x']) / 2
        curr_com_x = (curr_landmarks[23]['x'] + curr_landmarks[24]['x']) / 2
        
        weight_shift = abs(curr_com_x - prev_com_x)
        return min(1.0, weight_shift * 5)  # Scale and normalize
    
    def _calculate_limb_velocity(self, landmarks1: List[Dict], landmarks2: List[Dict], 
                                landmarks3: List[Dict], dt: float) -> float:
        """Calculate velocity of striking limb"""
        # Use right hand for punches, right foot for kicks
        pos1 = np.array([landmarks1[16]['x'], landmarks1[16]['y']])  # Right wrist
        pos2 = np.array([landmarks2[16]['x'], landmarks2[16]['y']])
        pos3 = np.array([landmarks3[16]['x'], landmarks3[16]['y']])
        
        velocity1 = np.linalg.norm(pos2 - pos1) / dt
        velocity2 = np.linalg.norm(pos3 - pos2) / dt
        
        return max(velocity1, velocity2)
    
    def _generate_form_feedback(self, detailed_feedback: List[str], score: float) -> str:
        """Generate form feedback based on score"""
        if score >= 85:
            return "Excellent form! " + "; ".join(detailed_feedback[:3])
        elif score >= 70:
            return "Good form with room for improvement. " + "; ".join(detailed_feedback[:3])
        else:
            return "Form needs significant work. " + "; ".join(detailed_feedback[:3])
    
    def _generate_power_feedback(self, score: float) -> str:
        """Generate power chain feedback"""
        if score >= 80:
            return "Excellent power generation through kinetic chain"
        elif score >= 60:
            return "Good power generation, focus on hip rotation"
        else:
            return "Improve power generation by engaging hips and core"
    
    def _generate_explosiveness_feedback(self, score: float) -> str:
        """Generate explosiveness feedback"""
        if score >= 85:
            return "Excellent speed and explosiveness"
        elif score >= 70:
            return "Good speed, work on acceleration"
        else:
            return "Focus on speed and explosive movement"

# Example usage
scoring_engine = MuayThaiScoringEngine()
print("Scoring engine initialized!")
print("Available techniques:", list(scoring_engine.reference_poses.keys()))
