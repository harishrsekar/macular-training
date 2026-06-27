# Macular Training App

A clinical web application for low vision rehabilitation, designed to train patients with macular degeneration to use their **Preferred Retinal Locus (PRL)** — an alternate part of the retina used as a substitute for the damaged central fovea.

---

## What It Does

Patients with macular degeneration lose central vision. This app guides them through:

1. **PRL Detection** — Identifies which quadrant of the retina the patient can best use for eccentric viewing, using an adaptive Landolt C test
2. **Eccentric View Training (EVT)** — Trains the patient to consistently use their identified PRL quadrant
3. **Scroll Text Training** — Reading practice using a scrolling text strip with a fixation dot positioned relative to the patient's PRL

---

## Tech Stack

- **React 19** + **Vite**
- **React Router v7** (client-side routing)
- **Firebase Realtime Database** (patient records)
- Deployed on **Vercel**

---

## Patient Flow

```
Registration → Instructions → PRL Detection → Result → Eccentric View Training → Stats
                                                     ↘ Scroll Text Training
```

- **Registration**: Collects patient info (Name, Age, Eye OD/OS, BCVA, Spectacle, Contact, Address). Detects existing patients by name (case-insensitive) and shows previous results.
- **Instructions**: Plays an intro audio clip explaining the task.
- **PRL Detection** (`/test`): 24 adaptive test cases cycling through 4 quadrants. Shows a Landolt C at one of 4 positions on a background chart. Patient presses an arrow key matching the C's opening direction.
  - Correct → next test case, smaller font
  - Wrong → font size increases, new random direction
  - 5 wrong in a quadrant → quadrant marked non-identifiable (blurred)
  - 3+ non-identifiable quadrants → test ends, remaining quadrant used for training
- **Result** (`/result/:power_grid`): Announces the training quadrant and saves results to Firebase.
- **Eccentric View Training** (`/eccentric-training`): 5 runs of 12 stimuli with decreasing font size. Tracks correct vs mistake runs.
- **Scroll Text Training** (`/scroll-text-training`): Scrolling story text with a fixation dot — position (above/below/left/right) is determined by the patient's quadrant.

---

## Running Locally

```bash
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## Firebase Data Structure

```
patients/{name}/
  registrationDetails   ← name, age, gender, eye, BCVA, contact, address
  testResults           ← trainingQuadrant, letterSize, centralDotSize, testEndDate
  trainingResults       ← evtCorrectResponses, evtWrongResponses, trainingEndDate
```

All timestamps are in **IST (UTC+5:30)**.

---

## AppBar Controls

Most training screens have a top bar with configurable options:

| Control | Description |
|---|---|
| Quadrant | Which screen quadrant the C appears in |
| Central Spot | Size of the fixation dot (Big / Medium / Small) |
| Grid Type | Background chart style (Charts 1–7) |
| Quadrant Blur | Manually mark quadrants as non-identifiable |
| Duration | How long the C is shown (EVT only) |
| Speed | Scroll speed (Scroll Text Training only) |
| Spacing | Distance between dot and text box |
| Font Size | Size of the stimulus letter |

---

## Audio Files

| File | Played when |
|---|---|
| `intro.mp3` | Instructions page loads |
| `correct_direction.mp3` | Patient presses correct arrow |
| `wrong_direction.mp3` | Patient presses wrong arrow |
| `grid1–4.mp3` | Result page announces training quadrant |
