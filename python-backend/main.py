from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel, validator
from typing import List, Dict, Any, Optional
import os
import re
from pathlib import Path
import time
from collections import defaultdict
from datetime import datetime, timedelta

app = FastAPI(
    title="ClientView Python Backend",
    docs_url="/docs" if os.getenv("ENVIRONMENT") == "development" else None,
    redoc_url="/redoc" if os.getenv("ENVIRONMENT") == "development" else None
)

# Security: Configure CORS properly
allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["Content-Type", "Authorization"],
    max_age=3600,
)

# Security: Trusted host middleware (prevents host header attacks)
if os.getenv("ENVIRONMENT") == "production":
    app.add_middleware(
        TrustedHostMiddleware,
        allowed_hosts=["*.vercel.app", "*.railway.app"]
    )

# Rate limiting (simple in-memory implementation)
rate_limit_storage: Dict[str, List[float]] = defaultdict(list)
RATE_LIMIT_REQUESTS = 100  # requests
RATE_LIMIT_WINDOW = 60  # seconds

def check_rate_limit(identifier: str) -> bool:
    """Simple rate limiter"""
    now = time.time()
    window_start = now - RATE_LIMIT_WINDOW
    
    # Clean old entries
    rate_limit_storage[identifier] = [
        timestamp for timestamp in rate_limit_storage[identifier]
        if timestamp > window_start
    ]
    
    # Check limit
    if len(rate_limit_storage[identifier]) >= RATE_LIMIT_REQUESTS:
        return False
    
    rate_limit_storage[identifier].append(now)
    return True

@app.middleware("http")
async def rate_limit_middleware(request: Request, call_next):
    """Rate limiting middleware"""
    # Skip rate limiting for health checks
    if request.url.path in ["/", "/health"]:
        return await call_next(request)
    
    # Get client identifier
    client_ip = request.client.host if request.client else "unknown"
    
    if not check_rate_limit(client_ip):
        return JSONResponse(
            status_code=429,
            content={"error": "Too many requests. Please try again later."}
        )
    
    return await call_next(request)

@app.middleware("http")
async def security_headers_middleware(request: Request, call_next):
    """Add security headers to all responses"""
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    return response

# Models with validation
class AnalyzeRequest(BaseModel):
    fileUrl: str
    presentationId: str
    
    @validator('fileUrl')
    def validate_url(cls, v):
        if not v.startswith(('http://', 'https://')):
            raise ValueError('fileUrl must be a valid HTTP/HTTPS URL')
        if len(v) > 2048:
            raise ValueError('fileUrl is too long')
        return v
    
    @validator('presentationId')
    def validate_presentation_id(cls, v):
        if not re.match(r'^[a-zA-Z0-9_-]+$', v):
            raise ValueError('presentationId contains invalid characters')
        if len(v) > 100:
            raise ValueError('presentationId is too long')
        return v

class GenerateRequest(BaseModel):
    templateId: str
    slides: List[Dict[str, Any]]
    
    @validator('templateId')
    def validate_template_id(cls, v):
        if not re.match(r'^[a-zA-Z0-9_-]+$', v):
            raise ValueError('templateId contains invalid characters')
        if len(v) > 100:
            raise ValueError('templateId is too long')
        return v
    
    @validator('slides')
    def validate_slides(cls, v):
        if len(v) > 100:
            raise ValueError('Too many slides (max 100)')
        return v

# Constants
SLIDE_CATEGORIES = [
    "Current Allocation",
    "Target Allocation", 
    "Performance",
    "Risk/Reward",
    "Pacing",
    "Fees",
    "Appendix",
    "Disclosures"
]

@app.get("/")
async def root():
    return {"message": "ClientView Python Backend API", "status": "running"}

@app.get("/health")
async def health():
    return {"status": "healthy"}

@app.post("/analyze")
async def analyze_presentation(request: AnalyzeRequest):
    """
    Main analysis endpoint:
    1. Download PPT from URL
    2. Extract all slides, text, charts, images
    3. Detect variables ({{variable_name}})
    4. Use Claude to categorize slides
    5. Extract color scheme and fonts
    6. Generate thumbnails
    7. Return structured template data
    
    For MVP, this returns mock data. Full implementation requires:
    - python-pptx for PowerPoint manipulation
    - Anthropic SDK for Claude API
    - PIL for image processing
    - requests for file download
    """
    
    try:
        # In production, implement full PowerPoint processing
        # For MVP, acknowledge the request
        
        presentation_id = request.presentationId
        
        # Store analysis status (use database in production)
        # This would trigger background processing
        
        return {
            "presentationId": presentation_id,
            "status": "processing",
            "message": "Analysis started"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@app.post("/generate")
async def generate_presentation(request: GenerateRequest):
    """
    Generate final PowerPoint with all edits applied
    
    Full implementation would:
    1. Load original presentation
    2. Apply all slide edits
    3. Update variables
    4. Regenerate charts
    5. Export as new .pptx
    6. Return file for download
    """
    
    try:
        # In production, generate actual PowerPoint file
        # For MVP, return placeholder
        
        raise HTTPException(
            status_code=501, 
            detail="PowerPoint generation not yet implemented. Install python-pptx and implement full processing."
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Generation failed: {str(e)}")

# Helper functions (stubs for full implementation)

def extract_theme(presentation):
    """Extract color scheme, fonts, and styling from PowerPoint"""
    # Requires python-pptx
    pass

def process_slide(slide, index: int, theme: Dict):
    """Extract all content from a slide"""
    # Requires python-pptx
    pass

def extract_chart_data(chart) -> Dict[str, Any]:
    """Extract chart data for later manipulation"""
    # Requires python-pptx
    pass

async def categorize_slide_with_ai(slide_data: Dict) -> str:
    """Use Claude to categorize the slide"""
    # Requires Anthropic SDK
    pass

def generate_thumbnail(slide, index: int) -> str:
    """Generate thumbnail image of slide"""
    # Requires PIL and python-pptx
    pass

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

