# ClientView Python Backend

FastAPI microservice for PowerPoint processing and AI analysis.

## Features

- PowerPoint file parsing and manipulation
- AI-powered slide categorization using Claude
- Variable detection and extraction
- Theme and color scheme analysis
- Chart data extraction
- Presentation generation

## Setup

### Local Development

```bash
# Install dependencies
pip install -r requirements.txt

# Set environment variables
cp .env.example .env
# Edit .env and add your ANTHROPIC_API_KEY

# Run server
python main.py
# or
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`

### Docker

```bash
# Build image
docker build -t clientview-backend .

# Run container
docker run -p 8000:8000 --env-file .env clientview-backend
```

## Deployment

### Railway

1. Install Railway CLI:
```bash
npm i -g @railway/cli
```

2. Login and initialize:
```bash
railway login
railway init
```

3. Add environment variables in Railway dashboard:
   - `ANTHROPIC_API_KEY`
   - `ALLOWED_ORIGINS`

4. Deploy:
```bash
railway up
```

### Render

1. Create new Web Service
2. Connect your GitHub repository
3. Set:
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
4. Add environment variables

## API Endpoints

### `POST /analyze`

Analyze uploaded PowerPoint presentation.

**Request:**
```json
{
  "fileUrl": "https://blob.vercel-storage.com/...",
  "presentationId": "abc123"
}
```

**Response:**
```json
{
  "presentationId": "abc123",
  "status": "processing",
  "message": "Analysis started"
}
```

### `POST /generate`

Generate final PowerPoint with edits.

**Request:**
```json
{
  "templateId": "abc123",
  "slides": [...]
}
```

**Response:**
Binary PowerPoint file (.pptx)

## Full Implementation Notes

The current version is a stub. Full implementation requires:

1. **PowerPoint Processing** (`python-pptx`):
   - Parse uploaded .pptx files
   - Extract text, images, charts
   - Modify slides programmatically
   - Generate new presentations

2. **AI Integration** (`anthropic`):
   - Categorize slides using Claude
   - Generate slide content
   - Apply edits while maintaining theme

3. **Image Processing** (`Pillow`):
   - Generate slide thumbnails
   - Process images for preview

4. **Storage**:
   - Store processed data in database
   - Cache analysis results
   - Manage file uploads/downloads

## Tech Stack

- **FastAPI**: High-performance async web framework
- **python-pptx**: PowerPoint file manipulation
- **Anthropic SDK**: Claude AI integration
- **Pillow**: Image processing
- **Uvicorn**: ASGI server

