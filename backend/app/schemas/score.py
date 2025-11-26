from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional


class ScoreBase(BaseModel):
    """Base score schema."""
    game_mode: str = Field(..., pattern="^(capitals|flags|speed)$")
    score: int = Field(..., ge=0)
    questions_answered: int = Field(..., ge=0)


class ScoreCreate(ScoreBase):
    """Schema for creating a new score."""
    pass


class ScoreResponse(ScoreBase):
    """Schema for score response."""
    id: int
    user_id: int
    created_at: datetime
    username: Optional[str] = None  # For leaderboard
    
    class Config:
        from_attributes = True


class ScoreMigrate(BaseModel):
    """Schema for migrating localStorage scores."""
    mode: str = Field(..., pattern="^(capitals|flags|speed)$")
    score: int = Field(..., ge=0)
    date: str  # ISO format from localStorage


class ScoreMigrateRequest(BaseModel):
    """Schema for bulk score migration."""
    scores: list[ScoreMigrate]


class LeaderboardEntry(BaseModel):
    """Schema for leaderboard entry."""
    rank: int
    username: str
    score: int
    questions_answered: int
    created_at: datetime
    
    class Config:
        from_attributes = True
