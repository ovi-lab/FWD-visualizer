# Haru Chat Visualizer

A Next.js web application for visualising chat transcripts between a user and the Haru social robot. Conversation data is streamed in real-time via a Socket.IO backend and rendered across multiple interactive diagram views.

## Views

| Route | Description |
|---|---|
| `/chat` | Scrollable chat transcript styled as a messaging conversation, with emotion and sentiment labels per turn |
| `/diagrams/arc` | Arc diagram showing topic-to-topic conversation flow |
| `/diagrams/sankey` | Sankey diagram showing the flow of topics and sentiment across the conversation |
| `/diagrams/ferris-wheel` | Ferris wheel diagram with concentric bubbles representing topics (centre), robot turns (inner ring), and user turns (outer ring), sized by frequency and sentiment |
| `/diagrams/ToF` | Tiers of Friendship diagram |

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript / JSX
- **Styling:** Tailwind CSS
- **Charts:** D3, d3-sankey
- **Realtime data:** Socket.IO client (connects to backend at `http://localhost:6400`)
- **Animation:** Framer Motion

## Prerequisites

- Node.js 18+
- The Haru backend server running on port `6400` (provides `diagram_response` and `transcript_response` socket events)

## Getting Started

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:8080](http://localhost:8080) in your browser.

> The dev script runs with `--max_old_space_size=4096` to avoid webpack out-of-memory crashes on larger builds.

## Data Flow

1. On load, the app connects to the backend via WebSocket (`socketDataContext`)
2. The sidebar's **SelectionForm** lets you upload a pre-processed JSON file (produced by the processing script in Haru-Chat-Processor) or download the current transcript as JSON
3. After upload the backend signals completion; the app requests `transcript_response` (processed turns) and `diagram_response` (topic/link maps) and updates all views automatically
4. All views share data through React context; the filter context exposes a `filteredTranscript` and `filteredDiagramData` that respect the active time/topic filter
5. The live feed toggle streams data directly from an active ROS session without needing to upload a file

## Project Structure

```
src/app/
├── (dashboard)/
│   ├── layout.tsx          # Root layout: sidebar + control panel
│   ├── chat/               # Chat transcript view
│   └── diagrams/
│       ├── arc/
│       ├── sankey/
│       ├── ferris-wheel/
│       └── ToF/
├── components/
│   ├── sideBar.tsx         # Navigation + file upload form
│   ├── controlPanel.jsx    # Timeline / filter controls
│   ├── infoPanel.jsx       # Detail panel
│   └── svgs/               # Emotion icon SVGs (joy, sadness, anger, …)
└── contexts/               # Shared React contexts (socket data, filter, dark mode, colour picker, …)
```
