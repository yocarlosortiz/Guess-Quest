// app/page.tsx or pages/index.js

'use client';

import { useState } from 'react';

// Main component for the Number Guessing Game
export default function Home() {
  // State for session ID and game session
  const [session, setSession] = useState(null);
  // State for lower and upper bounds input
  const [bounds, setBounds] = useState({ lower: '', upper: '' });
  // State for the user's current guess input
  const [guess, setGuess] = useState('');
  // State for feedback message from backend
  const [feedback, setFeedback] = useState('');
  // State for attempts tracking
  const [attempts, setAttempts] = useState({ used: 0, left: 0, allowed: 0 });
  // State for game status: 'in-progress', 'win', 'lose'
  const [gameStatus, setGameStatus] = useState('');
  // State for the answer (revealed if user loses)
  const [answer, setAnswer] = useState(null);

  // Start a new game by sending bounds to backend
  const startGame = async (e) => {
    e.preventDefault();
    setFeedback('');
    setGuess('');
    setGameStatus('');
    setAnswer(null);

    // POST /start to backend
    const res = await fetch('http://localhost:8000/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lower: Number(bounds.lower), upper: Number(bounds.upper) }),
    });
    if (!res.ok) {
      setFeedback('Error starting game.');
      return;
    }
    const data = await res.json();
    setSession(data.session_id);
    setAttempts({ used: 0, left: data.attempts_allowed, allowed: data.attempts_allowed });
  };

  // Submit a guess to the backend
  const submitGuess = async (e) => {
    e.preventDefault();
    if (!guess) return;

    // POST /guess to backend
    const res = await fetch('http://localhost:8000/guess', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_id: session, guess: Number(guess) }),
    });
    const data = await res.json();
    setFeedback(data.hint);
    setAttempts({ used: data.attempts_used, left: data.attempts_left, allowed: attempts.allowed });
    setGameStatus(data.status);
    setAnswer(data.answer || null);
    setGuess('');
  };

  // Render the UI
  return (
    <main style={{ maxWidth: 420, margin: 'auto', padding: 32 }}>
      <h1>Number Guessing Game</h1>

      {/* Show bounds form if no session or game ended */}
      {!session || gameStatus === 'win' || gameStatus === 'lose' ? (
        <form onSubmit={startGame} style={{ marginBottom: 24 }}>
          <label>
            Lower Bound:
            <input
              type="number"
              required
              value={bounds.lower}
              onChange={e => setBounds(b => ({ ...b, lower: e.target.value }))}
              style={{ marginLeft: 8, marginBottom: 8 }}
            />
          </label>
          <br />
          <label>
            Upper Bound:
            <input
              type="number"
              required
              value={bounds.upper}
              onChange={e => setBounds(b => ({ ...b, upper: e.target.value }))}
              style={{ marginLeft: 8, marginBottom: 8 }}
            />
          </label>
          <br />
          <button type="submit">Start Game</button>
        </form>
      ) : null}

      {/* Show guessing form if game is in progress */}
      {session && gameStatus !== 'win' && gameStatus !== 'lose' && (
        <form onSubmit={submitGuess} style={{ marginBottom: 16 }}>
          <div>Attempts Left: {attempts.left}</div>
          <label>
            Enter your guess:
            <input
              type="number"
              value={guess}
              onChange={e => setGuess(e.target.value)}
              required
              style={{ marginLeft: 8 }}
            />
          </label>
          <button type="submit" style={{ marginLeft: 8 }}>Guess</button>
        </form>
      )}

      {/* Feedback and game result messages */}
      {feedback && <div style={{ marginBottom: 16, color: 'blue' }}>{feedback}</div>}
      {gameStatus === 'win' && <div style={{ color: 'green', fontWeight: 'bold' }}>You win! 🎉</div>}
      {gameStatus === 'lose' && (
        <div style={{ color: 'red', fontWeight: 'bold' }}>
          You lost. The correct number was {answer}.
        </div>
      )}

      {/* Restart button after win/loss */}
      {(gameStatus === 'win' || gameStatus === 'lose') && (
        <button onClick={() => { setSession(null); setBounds({ lower: '', upper: '' }); }}>Restart Game</button>
      )}
    </main>
  );
}
