# DevSignal 📶  
> Low-Bandwidth Developer Hub & Offline Transit Incident Locker  
> **Track 01: Public Transport & Low-Connectivity Utility**

![Build Status](https://img.shields.io/badge/AWS_Amplify-Deployed-success?style=for-the-badge&logo=amazon-aws)
![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?style=for-the-badge&logo=vite)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![License](https://img.shields.io/badge/License-MIT-emerald?style=for-the-badge)

DevSignal is an offline-first developer workstation and transit incident tracker designed specifically for intermittent network conditions across mountain transit corridors (such as the Kochi to Munnar route).

---

## 🚀 Live Prototype & Deployment
- **Hosted App:** [Visit Deployed AWS Amplify URL](https://main.d2ywsq76zptjbv.amplifyapp.com/)
- **Repository:** `https://github.com/Devika-Aravind/devsignal`

---

## ✨ Key Features

### 1. 🗂 Multi-File Code Workspace
- Integrated browser-persistent code editor supporting multiple tabs (`main.js`, `api.md`, `notes.txt`).
- State stored directly in browser `localStorage` to ensure zero code loss during network dead zones.

### 2. 🚌 KSRTC Mountain Corridor Transit Monitor
- Pre-cached offline route mapping for high-altitude low-connectivity zones (Neriamangalam Bridge, Adimali Ghats, Cheeyappara).
- Live query search engine for real-time signal coverage checks and direct emergency depot phone dispatches.

### 3. 🎧 Focus Audio Synthesizer
- Client-side Web Audio API audio engine generating Deep Brown Noise and Static Focus Noise locally.
- Consumes **0 KB network data** during playback.

### 4. ⚡ Micro-Payload AI Engine
- Low-latency query module optimized for compressed micro-packet transmission over fragile edge networks.

---

## 🛠 Tech Stack & Architecture

- **Frontend:** React 18, Vite, Lucide React Icons
- **State & Persistence:** Native Browser LocalStorage, Web Audio API
- **Deployment:** AWS Amplify CI/CD pipeline
- **Dataset Integration:** Pre-cached JSON KSRTC Transit Route Dataset (`src/data/transit_nodes.json`)

---

## 💻 Local Setup & Installation

To run this workstation locally:

```bash
# 1. Clone the repository
git clone [https://github.com/Devika-Aravind/devsignal.git](https://github.com/Devika-Aravind/devsignal.git)

# 2. Navigate to project directory
cd devsignal

# 3. Install dependencies
npm install

# 4. Start local development server
npm run dev