# Offline PDF Intelligence System

An offline Retrieval-Augmented Generation (RAG) system that enables users to semantically query local PDF documents without relying on external APIs. Built to improve document privacy, contextual search accuracy, and offline accessibility using embedding-based retrieval and scalable backend pipelines.

---

## Features

- Semantic querying over local PDF documents
- Offline-first architecture for enhanced privacy
- Embedding-based vector search for contextual retrieval
- Real-time streaming responses
- Efficient PDF ingestion and chunking pipeline
- Scalable REST API backend
- Optimized document processing workflow

---

## Tech Stack

### Frontend
- React.js
- HTML
- CSS
- JavaScript

### Backend
- Node.js
- Express.js

### Database & Storage
- MongoDB
- Vector Embeddings

### Tools & Technologies
- REST APIs
- Git & GitHub
- Postman

---

## System Workflow

1. User uploads a PDF document
2. Text is extracted and preprocessed
3. Document content is divided into semantic chunks
4. Embeddings are generated for each chunk
5. Vector-based retrieval identifies relevant context
6. Retrieved content is used to answer user queries
7. Responses are streamed back in real-time

---

## Key Highlights

- Eliminated dependency on external AI APIs for improved data privacy
- Designed scalable backend architecture for handling large documents
- Improved contextual relevance using embedding-based semantic search
- Implemented optimized chunking and retrieval mechanisms
- Built real-time query response streaming for smoother user experience

---

## Challenges Faced

- Managing semantic relevance across large PDF datasets
- Optimizing chunk size for better retrieval accuracy
- Handling document preprocessing efficiently
- Designing scalable retrieval pipelines for real-time responses
- Maintaining offline-first functionality without cloud dependency

---

## Future Improvements

- Multi-document querying support
- Hybrid keyword + semantic search
- Local LLM integration
- Chat history and memory support
- Advanced ranking and reranking systems
- PDF highlighting for retrieved context

---

## Installation & Setup

```bash
# Clone repository
git clone <https://github.com/AbhayPratap01/Offline-PDF-Intelligence-System>

# Navigate into project directory
cd <Offline-PDF-Intelligence-System>

# Install dependencies
npm install

# Start development server
npm run dev
```

---

#Project Motivation

This project was built to explore Retrieval-Augmented Generation (RAG) systems and create a privacy-focused document intelligence platform capable of working without external cloud-based AI dependencies. The goal was to combine semantic search, scalable backend engineering, and real-time query handling into a practical AI-powered application.
