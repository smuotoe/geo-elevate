from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import desc, func
from typing import List, Optional
from datetime import datetime
from ..database import get_db
from ..models.user import User
from ..models.score import Score
from ..schemas.score import (
    ScoreCreate, 
    ScoreResponse, 
    LeaderboardEntry,
    ScoreMigrateRequest
)
from ..utils.auth import get_current_user

router = APIRouter()


@router.post("", response_model=ScoreResponse, status_code=status.HTTP_201_CREATED)
async def submit_score(
    score_data: ScoreCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Submit a new score (requires authentication)."""
    new_score = Score(
        user_id=current_user.id,
        game_mode=score_data.game_mode,
        score=score_data.score,
        questions_answered=score_data.questions_answered
    )
    
    db.add(new_score)
    db.commit()
    db.refresh(new_score)
    
    return new_score


@router.get("/me", response_model=List[ScoreResponse])
async def get_my_scores(
    game_mode: Optional[str] = None,
    limit: int = 10,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get current user's scores."""
    query = db.query(Score).filter(Score.user_id == current_user.id)
    
    if game_mode:
        query = query.filter(Score.game_mode == game_mode)
    
    scores = query.order_by(desc(Score.score)).limit(limit).all()
    return scores


@router.get("/leaderboard/{game_mode}", response_model=List[LeaderboardEntry])
async def get_leaderboard(
    game_mode: str,
    limit: int = 10,
    db: Session = Depends(get_db)
):
    """Get global leaderboard for a game mode (public endpoint)."""
    if game_mode not in ["capitals", "flags", "speed"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid game mode"
        )
    
    # Get top scores with usernames
    scores = (
        db.query(Score, User.username)
        .join(User)
        .filter(Score.game_mode == game_mode)
        .order_by(desc(Score.score))
        .limit(limit)
        .all()
    )
    
    # Format as leaderboard entries with ranks
    leaderboard = []
    for rank, (score, username) in enumerate(scores, start=1):
        leaderboard.append(
            LeaderboardEntry(
                rank=rank,
                username=username,
                score=score.score,
                questions_answered=score.questions_answered,
                created_at=score.created_at
            )
        )
    
    return leaderboard


@router.post("/migrate", status_code=status.HTTP_201_CREATED)
async def migrate_local_scores(
    migration_data: ScoreMigrateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Migrate localStorage scores to user account."""
    migrated_count = 0
    
    for score_data in migration_data.scores:
        # Parse date from localStorage
        try:
            created_at = datetime.fromisoformat(score_data.date.replace('Z', '+00:00'))
        except:
            created_at = datetime.utcnow()
        
        # Create score entry
        new_score = Score(
            user_id=current_user.id,
            game_mode=score_data.mode,
            score=score_data.score,
            questions_answered=10,  # Default, localStorage doesn't track this
            created_at=created_at
        )
        
        db.add(new_score)
        migrated_count += 1
    
    db.commit()
    
    return {
        "message": f"Successfully migrated {migrated_count} scores",
        "count": migrated_count
    }
