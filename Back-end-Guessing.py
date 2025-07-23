# backend/main.py

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import random
import uuid
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Add CORS middleware for frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"] ,
    allow_headers=["*"]
)

# In-memory game storage
games = {}

class StartRequest(BaseModel):
    lower: int
    upper: int

class StartResponse(BaseModel):
    session_id: str
    attempts_allowed: int
    lower: int
    upper: int

class GuessRequest(BaseModel):
    session_id: str
    guess: int

class GuessResponse(BaseModel):
    result: str
    hint: str
    attempts_used: int
    attempts_left: int
    status: str  # "in-progress", "win", or "lose"
    answer: int = None  # only sent if lost

def calc_attempts(lower, upper):
    import math
    return int(math.ceil(math.log2(upper - lower + 1))) + 1

@app.post("/start", response_model=StartResponse)
def start_game(req: StartRequest):
    if req.upper <= req.lower:
        raise HTTPException(status_code=400, detail="Upper must be greater than lower")
    session_id = str(uuid.uuid4())
    target = random.randint(req.lower, req.upper)
    attempts_allowed = calc_attempts(req.lower, req.upper)
    games[session_id] = {
        "lower": req.lower,
        "upper": req.upper,
        "target": target,
        "attempts_allowed": attempts_allowed,
        "attempts_used": 0,
        "finished": False
    }
    return StartResponse(
        session_id=session_id,
        attempts_allowed=attempts_allowed,
        lower=req.lower,
        upper=req.upper
    )

@app.post("/guess", response_model=GuessResponse)
def make_guess(req: GuessRequest):
    game = games.get(req.session_id)
    if not game or game["finished"]:
        raise HTTPException(status_code=404, detail="Invalid or finished session")
    if req.guess < game["lower"] or req.guess > game["upper"]:
        raise HTTPException(status_code=400, detail="Guess out of bounds")

    game["attempts_used"] += 1

    if req.guess == game["target"]:
        game["finished"] = True
        return GuessResponse(
            result="Correct!",
            hint="Congratulations!",
            attempts_used=game["attempts_used"],
            attempts_left=game["attempts_allowed"] - game["attempts_used"],
            status="win"
        )
    elif game["attempts_used"] >= game["attempts_allowed"]:
        game["finished"] = True
        return GuessResponse(
            result="Incorrect",
            hint=f"Game Over! The number was {game['target']}.",
            attempts_used=game["attempts_used"],
            attempts_left=0,
            status="lose",
            answer=game["target"]
        )
    else:
        hint = "Too high! Try a lower number." if req.guess > game["target"] else "Too low! Try a higher number."
        return GuessResponse(
            result="Incorrect",
            hint=hint,
            attempts_used=game["attempts_used"],
            attempts_left=game["attempts_allowed"] - game["attempts_used"],
            status="in-progress"
        )
