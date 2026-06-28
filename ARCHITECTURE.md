\# Architecture Summary — POC-08 Card BIN Intelligence Dashboard



\## System Overview

A lightweight intelligence dashboard for BIN/IIN lookup and issuer analytics.



\## Architecture Diagram

┌─────────────────────────────────────────────────────────────┐

│ USER (Browser) │

└─────────────────────────┬───────────────────────────────────┘

│

▼

┌─────────────────────────────────────────────────────────────┐

│ FRONTEND (Next.js + TypeScript) │

│ - pages/home page with search and display │

│ - Tailwind CSS for styling │

│ - Dark cinematic theme │

└─────────────────────────┬───────────────────────────────────┘

│ HTTP (REST API)

▼

┌─────────────────────────────────────────────────────────────┐

│ BACKEND (FastAPI + Python) │

│ - /api/bin/lookup - BIN search endpoint │

│ - /api/bin/stats - Statistics endpoint │

│ - /api/bin/issuers - Issuers list endpoint │

│ - /api/health - Health check │

└─────────────────────────┬───────────────────────────────────┘

│

▼

┌─────────────────────────────────────────────────────────────┐

│ DATA LAYER (CSV) │

│ - Synthetic BIN dataset (185 records) │

│ - Stored in data/bin\_data.csv │

└─────────────────────────────────────────────────────────────┘



text



\## Tech Stack



| Layer | Technology |

|-------|------------|

| Frontend | Next.js 16.2.1, TypeScript, Tailwind CSS |

| Backend | FastAPI, Python 3.14.6 |

| Data | Pandas, CSV |

| Tools | Uvicorn, Git |



\## Key Features

1\. \*\*BIN Lookup\*\* - Search by 6-digit BIN

2\. \*\*Issuer Segmentation\*\* - View top issuers

3\. \*\*Decline Analytics\*\* - Track decline reasons

4\. \*\*Statistics Dashboard\*\* - Key metrics at a glance



\## Deployment Notes

\- Backend: `py -3.14 -m uvicorn main:app --reload --port 8000`

\- Frontend: `npm run dev`

\- Access: `http://localhost:3000`



