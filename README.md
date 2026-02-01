# SummarEase 🚀

SummarEase is an AI-powered web application designed to simplify content consumption. It allows users to **summarize text**, **convert unstructured data into clean tables**, and **generate summaries from video content** using a hybrid AI approach. The project combines a modern React frontend with a robust Node.js/Express backend and leverages both **cloud-based and local AI models** for efficient processing.

---

## ✨ Features

* **Text Summarizer**
  Generate short or detailed summaries from large blocks of text with clean Markdown output.

* **Data to Table Converter**
  Convert messy, unstructured text into structured, dynamic HTML tables.

* **Video Summarizer**
  Upload a video, automatically extract audio, transcribe speech locally, and generate a concise AI-powered summary.

---

## 🛠 Tech Stack

### Frontend

* React.js (Vite)
* Bootstrap 5
* React Router

### Backend

* Node.js
* Express.js

### AI & Processing

* Hugging Face Inference API (`@huggingface/inference`)
* Qwen/Qwen2.5-7B-Instruct (Text & Data processing)
* Facebook/bart-large-cnn (Summarization)
* Xenova Transformers (`@xenova/transformers`) – Local Whisper inference
* Xenova/whisper-tiny.en (Speech-to-text)
* FFmpeg (`fluent-ffmpeg`, `ffmpeg-static`) – Audio extraction

### Utilities

* Multer (File uploads)
* CORS
* Dotenv

---

## 🔄 API Pipelines & Workflow

### 1️⃣ Text Summarizer Pipeline

**Endpoint:** `POST /api/summarize-text`

**Flow:**

1. User enters text and selects summary type (short / detailed).
2. Frontend sends text to the backend.
3. Backend constructs an expert-level summarization prompt.
4. Hugging Face Inference API is called using **Qwen/Qwen2.5-7B-Instruct**.
5. AI returns a Markdown-formatted summary.
6. Frontend renders the summary dynamically.

---

### 2️⃣ Data to Table Pipeline

**Endpoint:** `POST /api/generate-table`

**Flow:**

1. User pastes unstructured text data.
2. Backend prompts the AI to return a **JSON array of objects**.
3. Response is cleaned (Markdown removed) and parsed into JSON.
4. Structured data is sent back to the frontend.
5. Frontend dynamically generates a styled HTML table.

---

### 3️⃣ Video Summarizer Pipeline (Hybrid Local + Cloud)

**Endpoint:** `POST /api/upload-video`

**Flow:**

1. User uploads a video file.
2. Multer stores the video temporarily in `/uploads`.
3. FFmpeg extracts audio and converts it to **16kHz mono WAV**.
4. Whisper model (`Xenova/whisper-tiny.en`) transcribes audio locally.
5. Transcript is sent to Hugging Face using **facebook/bart-large-cnn**.
6. Backend returns both transcript and summary.
7. Temporary files are deleted to save space.

---

## 📁 Project Structure

```
/backend
  server.js          # Express server entry point
  /routes
    api.js           # API endpoints
  /controllers       # AI processing logic
  /middleware
    upload.js        # Multer configuration
  /uploads           # Temporary file storage

/frontend
  /src/pages         # Feature pages (Text, Video, Data)
  /src/components    # Reusable UI components
  App.jsx            # Routing and theme management
```

---

## ⚙️ Environment Variables

Create a `.env` file in the backend directory:

```
HF_API_KEY=your_huggingface_api_key
PORT=5000
```

---

## ▶️ Running the Project

### Backend

```
cd backend
npm install
npm start
```

### Frontend

```
cd frontend
npm install
npm run dev
```

---

## 🎯 Use Cases

* Students summarizing lectures or notes
* Professionals extracting insights from reports
* Researchers structuring raw data
* Content creators summarizing long videos

---

## 📌 Future Enhancements

* User authentication & history
* Support for more languages
* Downloadable summaries (PDF/Markdown)
* Cloud storage integration

---

## 📄 License

This project is for educational and demonstration purposes.

---

**SummarEase – Turn long content into instant clarity.** ✨
