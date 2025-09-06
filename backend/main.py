from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
import os

try:
    # Try relative import when running from project root
    from backend.routes import chat, memory, system
except ImportError:
    # Fall back to absolute import when running from backend directory
    from routes import chat, memory, system

# Create FastAPI app
app = FastAPI(
    title="JoeyAi API",
    description="Advanced AI Assistant Backend",
    version="1.0.0"
)

# Add CORS middleware for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routers
app.include_router(chat.router, prefix="/api", tags=["chat"])
app.include_router(memory.router, prefix="/api", tags=["memory"])
app.include_router(system.router, prefix="/api", tags=["system"])

# Mount static files from frontend directory
# Get frontend path relative to this file's location
frontend_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "frontend")

# Mount individual frontend subdirectories to match expected paths
app.mount("/styles", StaticFiles(directory=os.path.join(frontend_path, "styles")), name="styles")
app.mount("/scripts", StaticFiles(directory=os.path.join(frontend_path, "scripts")), name="scripts")
app.mount("/assets", StaticFiles(directory=os.path.join(frontend_path, "assets")), name="assets")

@app.get("/")
async def read_index():
    """Serve the main index.html file"""
    return FileResponse(os.path.join(frontend_path, "index.html"))

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy", 
        "message": "JoeyAi server is running",
        "version": "1.0.0"
    }

# Root API info endpoint
@app.get("/api")
async def api_info():
    """API information endpoint"""
    return {
        "name": "JoeyAi API",
        "version": "1.0.0",
        "endpoints": {
            "chat": "/api/chat",
            "memory": "/api/memory/toggle",
            "system": "/api/system/stats",
            "health": "/health"
        }
    }
