from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List

import database
import model

app = FastAPI(title="EduSense AI Backend")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ReviewRequest(BaseModel):
    text: str
    department: str = "General"

@app.get("/")
def root():
    return {"message": "Welcome to EduSense AI API"}

@app.post("/api/analyze")
def predict_review(req: ReviewRequest, db: Session = Depends(database.get_db)):
    if not req.text.strip():
        raise HTTPException(status_code=400, detail="Review text cannot be empty")
        
    
    analysis = model.analyzer.analyze(req.text)
    keywords = model.highlight_keywords(req.text)
    
    
    new_review = database.Review(
        text=req.text,
        department=req.department,
        sentiment=analysis["sentiment"],
        sentiment_confidence=analysis["sentiment_confidence"],
        emotion=analysis["emotion"],
        emotion_confidence=analysis["emotion_confidence"]
    )
    db.add(new_review)
    db.commit()
    db.refresh(new_review)
    
    return {
        "id": new_review.id,
        "text": new_review.text,
        "department": new_review.department,
        "sentiment": analysis["sentiment"],
        "sentiment_confidence": analysis["sentiment_confidence"],
        "emotion": analysis["emotion"],
        "emotion_confidence": analysis["emotion_confidence"],
        "keywords": keywords,
        "timestamp": new_review.timestamp
    }

@app.get("/api/reviews")
def get_reviews(db: Session = Depends(database.get_db), limit: int = 20):
    reviews = db.query(database.Review).order_by(database.Review.timestamp.desc()).limit(limit).all()
    return reviews

@app.get("/api/stats")
def get_stats(db: Session = Depends(database.get_db)):
    reviews = db.query(database.Review).all()
    
    total = len(reviews)
    if total == 0:
        return {
            "total_reviews": 0,
            "positive_percent": 0,
            "negative_percent": 0,
            "most_common_emotion": "N/A",
            "sentiment_data": [],
            "emotion_data": [],
            "trend_data": [],
            "insights": ["Not enough data to generate insights."]
        }
        
    pos = sum(1 for r in reviews if r.sentiment == "Positive")
    neg = sum(1 for r in reviews if r.sentiment == "Negative")
    neu = sum(1 for r in reviews if r.sentiment == "Neutral")
    
    pos_pct = round((pos / total) * 100, 1)
    neg_pct = round((neg / total) * 100, 1)
    
    emotions_counts = {}
    for r in reviews:
        emotions_counts[r.emotion] = emotions_counts.get(r.emotion, 0) + 1
        
    most_common_emotion = max(emotions_counts, key=emotions_counts.get) if emotions_counts else "N/A"
    
    
    sentiment_data = [
        {"name": "Positive", "value": pos},
        {"name": "Negative", "value": neg},
        {"name": "Neutral", "value": neu}
    ]
    
    emotion_data = [{"name": k, "value": v} for k, v in emotions_counts.items()]
    
    
    trend_data = []
    recent_reviews = sorted(reviews, key=lambda x: x.timestamp)
    
    for r in recent_reviews[-20:]:
        val = 1 if r.sentiment == "Positive" else (-1 if r.sentiment == "Negative" else 0)
        trend_data.append({
            "time": r.timestamp.strftime("%H:%M:%S"),
            "sentiment_score": val
        })
        
    insights = model.generate_insights(reviews)
    
    return {
        "total_reviews": total,
        "positive_percent": pos_pct,
        "negative_percent": neg_pct,
        "most_common_emotion": most_common_emotion,
        "sentiment_data": sentiment_data,
        "emotion_data": emotion_data,
        "trend_data": trend_data,
        "insights": insights
    }
