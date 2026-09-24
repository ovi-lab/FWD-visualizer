# Haru Chat Visualizer

A Next.js web page for visualising conversations between a child and the Haru social robot. It gets its data from the **Haru-Chat-Processor** backend (https://github.com/juliapetrie/Julia-CDV-processor), which must be running on the same machine.

## Views

| Route | Description |
|---|---|
| `/chat` | Scrollable chat transcript styled as a messaging conversation, with emotion and sentiment labels per turn |
| `/diagrams/arc` | Arc diagram showing topic-to-topic conversation flow |
| `/diagrams/sankey` | Sankey diagram showing the flow of topics and sentiment across the conversation |
| `/diagrams/ferris-wheel` | Ferris wheel diagram with concentric bubbles representing topics (centre), robot turns (inner ring), and user turns (outer ring), sized by frequency and sentiment |
| `/diagrams/ToF` | Tiers of Friendship diagram |

---

## Setup

**Requirements:** Node.js **18+** (20 LTS recommended), and the **Haru-Chat-Processor** backend set up on the same machine (see its README). Works on Windows and Linux.

```bash
git clone https://github.com/ovi-lab/Haru-Chat-Visualizer.git Haru-Chat-Visualizer
cd Haru-Chat-Visualizer
git checkout feature-ferris-wheel-start
npm install
```

## Running it

1. Start the backend: `python conversation_analysis/app.py` in the processor repo (venv active). It listens on port `6400`.
2. Start the page: `npm run dev` in this repo.
3. Open [http://localhost:8080](http://localhost:8080).

The dev script runs with `--max_old_space_size=4096` to avoid webpack out-of-memory crashes.

---

## Using it

Upload a transcript from the sidebar (with or without a `.json` extension):

| Upload | What happens |
|---|---|
| A **raw Haru transcript** (straight from the robot) | The backend processes it (emotion, sentiment, transcription fixes, topics). Progress shows under Submit, including a yellow warning if the Gemma model isn't reachable. Takes about 15–25 seconds with `gemma3:1b`. The result is saved in the processor's `data/named_outputs/` |
| A **processed transcript** from the processor's `data/named_outputs/` | Shown exactly as saved, in about a second. Use this to re-open a session without re-processing it |

The filename sets the participant ID and name (e.g. `P1_Bob.json`, `16_Raiken`; see the processor README). The diagram pages have a colour picker and a background picker.

### Ferris wheel layout

Topics sit clockwise in conversation order, each appearing once. Each topic bubble has a line from the robot ring and from the user ring when that speaker took part. Each topic change is a single line into the next topic, from whoever changed it (usually Haru; the child when their reply led into the next topic). The processor produces this structure.

### Hidden UI elements

Commented out (`{/* ... */}`), not deleted — uncomment to restore:

| Element | File |
|---|---|
| "Receive the live feed" toggle (streams from an active ROS session) | `src/app/components/selectionForm.jsx` |
| Download JSON / Download YAML buttons | `src/app/components/selectionForm.jsx` |
| Bottom filter panel: speaker, sentiment, emotion and topic filters, safety, reset, timeline | `src/app/(dashboard)/layout.tsx` (`<ControlPanel />`) |
| Sankey "Both" direction button | `src/app/(dashboard)/diagrams/sankey/page.jsx` |
| Ferris wheel legend | `src/app/(dashboard)/diagrams/layout.tsx` (`<Legend />`) |

---

## For developers

### Tech stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript / JSX
- **Styling:** Tailwind CSS
- **Charts:** D3, d3-sankey
- **Realtime data:** Socket.IO client (connects to the backend at `http://localhost:6400`)
- **Animation:** Framer Motion

### Data flow

1. On load, the app connects to the backend via WebSocket (`socketDataContext`) and requests the current transcript and diagram.
2. **SelectionForm** (`components/selectionForm.jsx`) sends the uploaded file with `upload_file`. The backend replies with `upload-progress` messages, then `upload-success` or `upload-error` (with a message).
3. On success the app requests `transcript_response` (processed turns) and `diagram_response` (topic/link maps) and updates all views.
4. All views share data through React context; the filter context exposes a `filteredTranscript` and `filteredDiagramData`. While the filter panel is hidden, no filters apply. When it's shown, loading a different transcript resets the filters so the previous session's timeline can't hide the new one.

### Project structure

```
src/app/
├── (dashboard)/
│   ├── layout.tsx          # Root layout: sidebar (+ control panel, currently hidden)
│   ├── chat/               # Chat transcript view
│   └── diagrams/
│       ├── layout.tsx      # Colour/background pickers (+ legend, currently hidden)
│       ├── arc/
│       ├── sankey/
│       ├── ferris-wheel/
│       └── ToF/
├── components/
│   ├── sideBar.tsx         # Navigation
│   ├── selectionForm.jsx   # File upload form (+ hidden live feed / download controls)
│   ├── controlPanel.jsx    # Timeline / filter controls (currently hidden)
│   ├── timeline.jsx        # Timeline slider used by the control panel
│   ├── ColorPicker.tsx     # Diagram colour scheme picker
│   ├── BackgroundPicker.tsx
│   ├── Legend.tsx          # Ferris wheel legend (currently hidden)
│   ├── infoPanel.jsx       # Detail panel
│   └── svgs/               # Emotion icon SVGs (joy, sadness, anger, …)
└── contexts/               # Shared React contexts (socket data, filter, dark mode, colour picker, …)
```
