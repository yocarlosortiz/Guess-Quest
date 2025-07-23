# Number Guessing Game

A full-stack web application where users try to guess a randomly generated number within a specified range. Built with **FastAPI** (Python) for the backend and **Next.js** (React) for the frontend.

---

## Features
- User sets a lower and upper bound for the guessing range.
- Backend generates a random number and tracks game state per session.
- User submits guesses and receives feedback: "Too high", "Too low", or "Correct!"
- Limited number of attempts per game (calculated based on range).
- Clear win/loss messages and ability to restart the game.

---

## Tech Stack
- **Backend:** Python, FastAPI, Uvicorn
- **Frontend:** Next.js (React)

---

## Getting Started

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd Guessing-Game
```

### 2. Backend Setup (FastAPI)

#### a. Create and activate a virtual environment
```bash
python3 -m venv venv
source venv/bin/activate
```

#### b. Install dependencies
```bash
pip install 'fastapi[all]'
```

#### c. Run the backend server
```bash
uvicorn Back-end-Guessing:app --reload --port 8000
```
- The backend will be available at [http://localhost:8000](http://localhost:8000)
- API docs: [http://localhost:8000/docs](http://localhost:8000/docs)

### 3. Frontend Setup (Next.js)

#### a. Navigate to the frontend directory
```bash
cd guessing-game-frontend
```

#### b. Install dependencies
```bash
npm install
```

#### c. Run the frontend development server
```bash
npm run dev
```
- The frontend will be available at [http://localhost:3000](http://localhost:3000)

---

## Usage
1. Open [http://localhost:3000](http://localhost:3000) in your browser.
2. Enter the lower and upper bounds to start a new game.
3. Enter guesses and follow the feedback until you win or run out of attempts.
4. Restart the game as desired.

---

## Project Structure
```
Guessing-Game/
├── Back-end-Guessing.py         # FastAPI backend
├── Front-Guessing.js            # Main React component (copied to frontend)
├── guessing-game-frontend/      # Next.js frontend app
├── venv/                        # Python virtual environment
├── .gitignore
└── README.md
```

---

## Notes
- CORS is enabled on the backend for `http://localhost:3000`.
- All game state is stored in memory (for demo purposes).
- For production, consider using persistent storage and environment variable management.

---

## License
MIT
