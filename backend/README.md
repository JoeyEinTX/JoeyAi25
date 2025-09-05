# JoeyAi Backend

A modular FastAPI backend for the JoeyAi project.

## Structure

```
backend/
├── main.py              # FastAPI entry point
├── requirements.txt     # Python dependencies
├── routes/             # API route modules
│   ├── __init__.py
│   ├── chat.py         # Chat endpoints
│   ├── memory.py       # Memory management
│   └── system.py       # System monitoring
├── models/             # Pydantic models (future)
│   └── __init__.py
└── utils/              # Utility functions (future)
    └── __init__.py
```

## Installation

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

## Running the Server

From the backend directory:
```bash
uvicorn main:app --reload --port 8000
```

Or from the project root:
```bash
uvicorn backend.main:app --reload --port 8000
```

## API Endpoints

### Core Endpoints
- `GET /` - Serves the frontend
- `GET /health` - Health check
- `GET /api` - API information

### Chat API
- `POST /api/chat` - Send chat messages
- `GET /api/chat/history` - Get chat history

### Memory API
- `POST /api/memory/toggle` - Toggle memory on/off
- `GET /api/memory/status` - Get memory status
- `POST /api/memory/clear` - Clear all memory
- `GET /api/memory/conversations` - Get stored conversations

### System API
- `GET /api/system/stats` - Basic system stats
- `GET /api/system/detailed` - Detailed system metrics
- `GET /api/system/health` - System health assessment

## Development

The backend is designed to be modular and extensible:

- **Routes**: Each feature has its own router module
- **Models**: Pydantic models for request/response validation
- **Utils**: Shared utilities and helpers
- **CORS**: Configured for frontend communication

## Future Enhancements

- Database integration
- Authentication/Authorization
- Real-time WebSocket connections
- Advanced AI model integration
- Logging and monitoring
- Docker containerization
