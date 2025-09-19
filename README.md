Number Guessing Game: A full-stack web application where users try to guess a randomly generated number within a specified range. Built with FastAPI (Python) for the backend and Next.js (React) for the frontend.

//Features
- User sets a lower and upper bound for the guessing range.
- Backend generates a random number and tracks game state per session.
- User submits guesses and receives feedback: "Too high", "Too low", or "Correct!"
- Limited number of attempts per game (calculated based on range).
- Clear win/loss messages and ability to restart the game.

//How To Play
2. Enter the lower and upper bounds to start a new game.
3. Enter guesses and follow the feedback until you win or run out of attempts.
4. Restart the game as desired.

//Tech Stack
- Backend: Python, FastAPI, Uvicorn
- Frontend: Next.js (React)

//Developer Notes
- CORS is enabled on the backend for `http://localhost:3000`.
- All game state is stored in memory (for demo purposes).
- For production, consider using persistent storage and environment variable management.
- The backend will be available at [http://localhost:8000](http://localhost:8000)
- API docs: [http://localhost:8000/docs](http://localhost:8000/docs)
- The frontend will be available at [http://localhost:3000](http://localhost:3000)
