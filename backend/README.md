# Muay Thai Analyzer - Backend

Python backend service for Muay Thai technique analysis and pose estimation.

## 🛠️ Tech Stack

- **Python 3.11+**
- **FastAPI** - Web API framework
- **MediaPipe** - Pose estimation
- **OpenCV** - Video processing
- **scikit-learn** - Machine learning classification
- **NumPy** - Numerical computing

## 📦 Installation

```bash
# Create virtual environment (recommended)
python3 -m venv venv
source venv/bin/activate  # macOS/Linux
# or venv\Scripts\activate  # Windows

# Install dependencies
pip install -r requirements.txt
```

## 🚀 Start Backend

### API Server (Production)

```bash
# Start FastAPI server
uvicorn api:app --reload --host 127.0.0.1 --port 8000

# Server will be available at: http://127.0.0.1:8000
# API Documentation: http://127.0.0.1:8000/docs
```

### Stop Backend

```bash
# Press Ctrl+C in terminal
# Or kill process: kill $(lsof -t -i:8000)
```

### Testing Individual Components

```bash
# Test pose estimation
python3 pose_estimation.py input_test.mov

# Test full analysis pipeline
python3 main_pipeline.py

# Test technique classifier
python3 technique_classifier.py
```

## 📡 API Endpoints

- **GET** `/` - API info and health check
- **POST** `/analyze` - Full video analysis
- **POST** `/pose` - Pose estimation only
- **GET** `/health` - Health check
- **GET** `/techniques` - List supported techniques

## 🧪 Test Files

- `pose_estimation.py` - Pose estimation and video analysis
- `technique_classifier.py` - Muay Thai technique classification
- `scoring_engine.py` - Scoring engine
- `main_pipeline.py` - Complete analysis pipeline
- `api.py` - FastAPI server

## 📊 Output

- **JSON Data**: Pose analysis results with scores
- **Video Files**: Annotated output videos (optional)
- **Scores**: Form, Chain of Power, Explosiveness (0-100)
