# AI Summarizer

A responsive, modern AI-powered web application for video summarization, text summarization, and data-to-table conversion.

## Features

- **Video Summarizer**: Upload videos to generate transcripts and AI summaries.
- **Text Summarizer**: Generate concise or detailed summaries from text input.
- **Data to Table**: Convert unstructured text data into structured tables automatically.
- **Modern UI**: Built with React, Bootstrap 5, and glassmorphism design elements.

## Tech Stack

- **Frontend**: React.js, Vite, Bootstrap 5, Axios, Lucide React
- **Backend**: Node.js, Express.js, Multer, Fluent-ffmpeg
- **AI Integration**: Mocked architecture ready for OpenAI/Whisper integration.

## Setup Instructions

### Prerequisites
- Node.js installed

### Installation

1. **Clone the repository** (if applicable)

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file in `backend/` if not exists (default: `PORT=5000`).

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   ```

### Running the Application

1. **Start the Backend**
   Open a terminal:
   ```bash
   cd backend
   node server.js
   ```
   Server will run on `http://localhost:5000`.

2. **Start the Frontend**
   Open a new terminal:
   ```bash
   cd frontend
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

## API Endpoints

- `POST /api/upload-video`: Accepts `video` file. Returns `{ transcript, summary }`.
- `POST /api/summarize-text`: Accepts `{ text, type }`. Returns `{ summary }`.
- `POST /api/generate-table`: Accepts `{ data }`. Returns `{ table }`.

## License
MIT
