from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from ..database import Base


class Score(Base):
    """Score model for game results."""
    
    __tablename__ = "scores"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    game_mode = Column(String, nullable=False, index=True)  # 'capitals', 'flags', 'speed'
    score = Column(Integer, nullable=False)
    questions_answered = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    
    # Relationship to user
    user = relationship("User", back_populates="scores")
    
    def __repr__(self):
        return f"<Score(id={self.id}, user_id={self.user_id}, mode='{self.game_mode}', score={self.score})>"
