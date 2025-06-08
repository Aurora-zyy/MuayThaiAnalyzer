from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from typing import Dict, Any
import os
import tempfile
import json
from main_pipeline import MuayThaiAnalysisPipeline
from pose_estimation import MuayThaiPoseAnalyzer

app = FastAPI(
    title="Muay Thai Analyzer API",
    description="AI-powered Muay Thai technique analysis",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

try:
    pipeline = MuayThaiAnalysisPipeline()
    pose_analyzer = MuayThaiPoseAnalyzer()
    print("✅ Analysis pipeline initialized successfully!")
except Exception as e:
    print(f"❌ Error initializing pipeline: {e}")
    pipeline = None
    pose_analyzer = None

@app.get("/")
async def root():
    return {
        "message": "🥋 Muay Thai Analyzer API",
        "version": "1.0.0",
        "status": "running",
        "endpoints": {
            "analyze": "/analyze - POST video file for full analysis",
            "pose": "/pose - POST video file for pose estimation only",
            "health": "/health - GET health check"
        }
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "pipeline_ready": pipeline is not None,
        "pose_analyzer_ready": pose_analyzer is not None
    }

@app.post("/analyze")
async def analyze_video(file: UploadFile = File(...)):
    
    if not pipeline:
        raise HTTPException(status_code=500, detail="Analysis pipeline not initialized")
    
    # Validate file type
    if not file.content_type.startswith('video/'):
        raise HTTPException(status_code=400, detail="File must be a video")
    
    try:
        # Create temporary file to save uploaded video
        with tempfile.NamedTemporaryFile(delete=False, suffix='.mp4') as temp_file:
            content = await file.read()
            temp_file.write(content)
            temp_path = temp_file.name
        
        print(f"📹 Processing video: {file.filename}")
        
        # Run full analysis pipeline
        result = pipeline.analyze_technique_video(temp_path)
        
        # Clean up temporary file
        os.unlink(temp_path)
        
        return JSONResponse(content={
            "success": True,
            "filename": file.filename,
            "analysis": result
        })
        
    except Exception as e:
        # Clean up temporary file on error
        if 'temp_path' in locals():
            try:
                os.unlink(temp_path)
            except:
                pass
        
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@app.post("/pose")
async def pose_estimation_only(file: UploadFile = File(...)):
    
    if not pose_analyzer:
        raise HTTPException(status_code=500, detail="Pose analyzer not initialized")
    
    if not file.content_type.startswith('video/'):
        raise HTTPException(status_code=400, detail="File must be a video")
    
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix='.mp4') as temp_file:
            content = await file.read()
            temp_file.write(content)
            temp_path = temp_file.name
        
        print(f"🎯 Pose estimation for: {file.filename}")
        
        # Run pose estimation only
        result = pose_analyzer.analyze_video(temp_path)
        
        # Clean up temporary file
        os.unlink(temp_path)
        
        return JSONResponse(content={
            "success": True,
            "filename": file.filename,
            "pose_data": result
        })
        
    except Exception as e:
        # Clean up temporary file on error
        if 'temp_path' in locals():
            try:
                os.unlink(temp_path)
            except:
                pass
        
        raise HTTPException(status_code=500, detail=f"Pose analysis failed: {str(e)}")

@app.get("/techniques")
async def get_supported_techniques():
    return {
        "techniques": [
            "jab", "cross", "hook", "uppercut",
            "roundhouse_kick", "teep", 
            "elbow_strike", "knee_strike"
        ],
        "total": 8
    }

if __name__ == "__main__":
    import uvicorn
    print("🚀 Starting Muay Thai Analyzer API server...")
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True) 