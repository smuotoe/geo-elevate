from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from ..database import get_db
from ..models.user import User
from ..models.score import Score
from ..schemas.user import UserResponse, UserStats
from ..utils.auth import get_current_user

router = APIRouter()


@router.get("/me", response_model=UserResponse)
async def get_my_profile(current_user: User = Depends(get_current_user)):
    """Get current user's profile."""
    return current_user


@router.get("/{username}/stats", response_model=UserStats)
async def get_user_stats(username: str, db: Session = Depends(get_db)):
    """Get public user statistics."""
    user = db.query(User).filter(User.username == username).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Get statistics
    total_games = db.query(Score).filter(Score.user_id == user.id).count()
    
    best_capitals = db.query(func.max(Score.score)).filter(
        Score.user_id == user.id,
        Score.game_mode == "capitals"
    ).scalar() or 0
    
    best_flags = db.query(func.max(Score.score)).filter(
        Score.user_id == user.id,
        Score.game_mode == "flags"
    ).scalar() or 0
    
    best_speed = db.query(func.max(Score.score)).filter(
        Score.user_id == user.id,
        Score.game_mode == "speed"
    ).scalar() or 0
    
    total_score = db.query(func.sum(Score.score)).filter(
        Score.user_id == user.id
    ).scalar() or 0
    
    return UserStats(
        username=user.username,
        total_games=total_games,
        best_capitals=best_capitals,
        best_flags=best_flags,
        best_speed=best_speed,
        total_score=total_score
    )
