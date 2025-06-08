"""
Data types and quantities needed for real implementation
"""

# 1. Professional Muay Thai video dataset
professional_video_requirements = {
    "techniques": {
        "jab": {"videos": 500, "angles": ["front", "side", "45_degree"]},
        "cross": {"videos": 500, "angles": ["front", "side", "45_degree"]},
        "hook": {"videos": 500, "angles": ["front", "side", "45_degree"]},
        "uppercut": {"videos": 500, "angles": ["front", "side", "45_degree"]},
        "roundhouse_kick": {"videos": 500, "angles": ["front", "side", "45_degree"]},
        "teep": {"videos": 500, "angles": ["front", "side", "45_degree"]},
        "elbow_strike": {"videos": 500, "angles": ["front", "side", "45_degree"]},
        "knee_strike": {"videos": 500, "angles": ["front", "side", "45_degree"]}
    },
    "total_videos": 4000,
    "video_specs": {
        "resolution": "1080p",
        "fps": 30,
        "duration": "3-10 seconds",
        "lighting": "consistent studio lighting",
        "background": "plain background"
    }
}

# 2. Expert scoring data
expert_scoring_data = {
    "evaluators": {
        "count": 10,
        "qualifications": "Professional Muay Thai trainers with 10+ years experience"
    },
    "scoring_criteria": {
        "form": {
            "stance": "0-25 points",
            "guard_position": "0-25 points", 
            "technique_execution": "0-25 points",
            "balance": "0-25 points"
        },
        "chain_of_power": {
            "hip_rotation": "0-33 points",
            "shoulder_engagement": "0-33 points",
            "weight_transfer": "0-34 points"
        },
        "explosiveness": {
            "speed": "0-50 points",
            "aggression": "0-25 points",
            "fluidity": "0-25 points"
        }
    },
    "inter_rater_reliability": "Target: >0.8 correlation"
}

# 3. User practice data
user_practice_data = {
    "beta_users": 200,
    "videos_per_user": 20,
    "total_user_videos": 4000,
    "skill_levels": {
        "beginner": "40%",
        "intermediate": "40%", 
        "advanced": "20%"
    },
    "data_collection_period": "6 months"
}

print("=== Real Data Collection Requirements ===")
print(f"Professional videos: {professional_video_requirements['total_videos']} videos")
print(f"Expert evaluators: {expert_scoring_data['evaluators']['count']} people")
print(f"User test videos: {user_practice_data['total_user_videos']} videos")
print(f"Total data estimate: ~50GB video data")
