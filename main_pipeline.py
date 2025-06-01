from pose_estimation import MuayThaiPoseAnalyzer
from technique_classifier import TechniqueClassifier
from scoring_engine import MuayThaiScoringEngine
import json

class MuayThaiAnalysisPipeline:
    def __init__(self):
        self.pose_analyzer = MuayThaiPoseAnalyzer()
        self.technique_classifier = TechniqueClassifier()
        self.scoring_engine = MuayThaiScoringEngine()
    
    def analyze_technique_video(self, video_path: str, user_technique_hint: str = None) -> dict:
        """Complete analysis pipeline for a Muay Thai technique video"""
        print(f"Starting analysis of video: {video_path}")
        
        # Step 1: Extract pose data from video
        print("Step 1: Extracting pose data...")
        pose_data = self.pose_analyzer.analyze_video(video_path)
        
        if not pose_data['pose_sequence']:
            return {
                'error': 'No pose data could be extracted from video',
                'success': False
            }
        
        print(f"Extracted {len(pose_data['pose_sequence'])} frames of pose data")
        
        # Step 2: Classify technique
        print("Step 2: Classifying technique...")
        if user_technique_hint:
            technique = user_technique_hint
            confidence = 1.0
        else:
            technique, confidence = self.technique_classifier.predict_technique(
                pose_data['pose_sequence']
            )
        
        print(f"Detected technique: {technique} (confidence: {confidence:.2f})")
        
        # Step 3: Score the technique
        print("Step 3: Scoring technique...")
        
        # Form analysis
        form_result = self.scoring_engine.calculate_form_score(
            pose_data['pose_sequence'], technique
        )
        
        # Chain of power analysis
        power_result = self.scoring_engine.calculate_chain_of_power_score(
            pose_data['pose_sequence'], technique
        )
        
        # Explosiveness analysis
        explosiveness_result = self.scoring_engine.calculate_explosiveness_score(
            pose_data['pose_sequence']
        )
        
        # Calculate overall score
        overall_score = (
            form_result['score'] * 0.4 +
            power_result['score'] * 0.3 +
            explosiveness_result['score'] * 0.3
        )
        
        # Step 4: Generate key frames for comparison
        print("Step 4: Extracting key frames...")
        key_frames = self._extract_key_frames(pose_data['pose_sequence'])
        
        # Step 5: Compile results
        analysis_result = {
            'success': True,
            'video_info': {
                'duration': pose_data['duration'],
                'total_frames': pose_data['total_frames'],
                'fps': pose_data['fps']
            },
            'technique': {
                'name': technique,
                'confidence': confidence
            },
            'scores': {
                'overall': round(overall_score),
                'form': form_result['score'],
                'chain_of_power': power_result['score'],
                'explosiveness': explosiveness_result['score']
            },
            'feedback': {
                'form': form_result['feedback'],
                'chain_of_power': power_result['feedback'],
                'explosiveness': explosiveness_result['feedback']
            },
            'key_frames': key_frames,
            'detailed_analysis': {
                'form_details': form_result,
                'power_details': power_result,
                'explosiveness_details': explosiveness_result
            }
        }
        
        print("Analysis complete!")
        return analysis_result
    
    def _extract_key_frames(self, pose_sequence: list) -> list:
        """Extract key frames for visual comparison"""
        if len(pose_sequence) < 4:
            return []
        
        # Extract frames at key moments
        total_frames = len(pose_sequence)
        key_frame_indices = [
            0,  # Starting position
            total_frames // 4,  # 25% through
            total_frames // 2,  # Peak/impact point
            3 * total_frames // 4,  # 75% through
            total_frames - 1  # End position
        ]
        
        key_frames = []
        for idx in key_frame_indices:
            if idx < len(pose_sequence):
                frame_data = pose_sequence[idx]
                key_frames.append({
                    'frame_index': idx,
                    'timestamp': frame_data['timestamp'],
                    'landmarks': frame_data['landmarks']
                })
        
        return key_frames

# Example usage and demonstration
def demo_analysis():
    """Demonstrate the analysis pipeline with mock data"""
    pipeline = MuayThaiAnalysisPipeline()
    
    # Simulate analysis result (since we don't have actual video)
    mock_result = {
        'success': True,
        'video_info': {
            'duration': 3.5,
            'total_frames': 105,
            'fps': 30.0
        },
        'technique': {
            'name': 'roundhouse_kick',
            'confidence': 0.87
        },
        'scores': {
            'overall': 84,
            'form': 85,
            'chain_of_power': 78,
            'explosiveness': 90
        },
        'feedback': {
            'form': 'Good stance, but elbows slightly high',
            'chain_of_power': 'Improve hip rotation for power',
            'explosiveness': 'Excellent speed, maintain aggression'
        },
        'key_frames': [
            {'frame_index': 0, 'timestamp': 0.0, 'landmarks': []},
            {'frame_index': 26, 'timestamp': 0.87, 'landmarks': []},
            {'frame_index': 52, 'timestamp': 1.73, 'landmarks': []},
            {'frame_index': 78, 'timestamp': 2.6, 'landmarks': []},
            {'frame_index': 104, 'timestamp': 3.47, 'landmarks': []}
        ]
    }
    
    print("=== Muay Thai Analysis Pipeline Demo ===")
    print(json.dumps(mock_result, indent=2))
    
    return mock_result

# Run demonstration
demo_result = demo_analysis()
print(f"\nAnalysis completed successfully: {demo_result['success']}")
print(f"Overall technique score: {demo_result['scores']['overall']}/100")
