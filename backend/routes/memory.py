from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime

router = APIRouter()

class MemoryToggleRequest(BaseModel):
    enabled: bool
    user_id: Optional[str] = "default"

class MemoryToggleResponse(BaseModel):
    status: str
    enabled: bool
    message: str
    timestamp: str

class MemoryStatusResponse(BaseModel):
    enabled: bool
    memory_size: int
    last_updated: str
    retention_policy: str

# In-memory storage for demo purposes
# In production, this would be a proper database
memory_state: Dict[str, Any] = {
    "enabled": True,
    "conversations": [],
    "last_updated": None,
    "total_interactions": 0
}

@router.post("/memory/toggle", response_model=MemoryToggleResponse)
async def toggle_memory(request: MemoryToggleRequest):
    """
    Toggle memory functionality on/off for the AI assistant
    
    Args:
        request: MemoryToggleRequest with enabled status
        
    Returns:
        MemoryToggleResponse with confirmation
    """
    try:
        memory_state["enabled"] = request.enabled
        memory_state["last_updated"] = datetime.now().isoformat()
        
        status = "enabled" if request.enabled else "disabled"
        message = f"Memory has been {status} successfully."
        
        if request.enabled:
            message += " I will now remember our conversations and learn from them."
        else:
            message += " I will not retain information from our conversations."
        
        return MemoryToggleResponse(
            status="success",
            enabled=request.enabled,
            message=message,
            timestamp=datetime.now().isoformat()
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to toggle memory: {str(e)}")

@router.get("/memory/status", response_model=MemoryStatusResponse)
async def get_memory_status():
    """
    Get current memory system status
    
    Returns:
        MemoryStatusResponse with current memory state
    """
    return MemoryStatusResponse(
        enabled=memory_state["enabled"],
        memory_size=len(memory_state["conversations"]),
        last_updated=memory_state["last_updated"] or "Never",
        retention_policy="Session-based (demo mode)"
    )

@router.post("/memory/clear")
async def clear_memory():
    """
    Clear all stored memory/conversations
    
    Returns:
        Confirmation message
    """
    memory_state["conversations"].clear()
    memory_state["last_updated"] = datetime.now().isoformat()
    memory_state["total_interactions"] = 0
    
    return {
        "status": "success",
        "message": "Memory cleared successfully",
        "timestamp": datetime.now().isoformat()
    }

@router.get("/memory/conversations")
async def get_conversations(limit: int = 10):
    """
    Get recent conversations from memory
    
    Args:
        limit: Maximum number of conversations to return
        
    Returns:
        List of recent conversations
    """
    conversations = memory_state["conversations"][-limit:] if memory_state["conversations"] else []
    
    return {
        "conversations": conversations,
        "total": len(memory_state["conversations"]),
        "memory_enabled": memory_state["enabled"],
        "showing": len(conversations)
    }
