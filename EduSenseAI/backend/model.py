import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import make_pipeline
from transformers import pipeline


EMOTION_DATA = [
    ("I am so happy with my grades and the teacher", "Happy"),
    ("This learning experience makes me smile, excellent delivery", "Happy"),
    ("I feel depressed about my performance, very sad", "Sad"),
    ("It makes me sad that the course is ending because I loved it", "Sad"),
    ("I am furious about the unfair grading system", "Angry"),
    ("This is outrageous and I am very angry at the professor", "Angry"),
    ("The assignments are so frustrating I can't do this", "Frustrated"),
    ("I am stressed and frustrated with the heavy workload", "Frustrated"),
    ("I don't understand the lectures at all, totally lost", "Confused"),
    ("The concepts are so confusing and unclear", "Confused"),
    ("Excellent setup, feeling great about the syllabus", "Happy"),
    ("I'm lost and have no idea what's going on with these slides", "Confused"),
    ("The syllabus is outdated and not useful", "Frustrated"),
    ("Instructions are vague and conflicting", "Confused"),
    ("Absolutely amazing interactions", "Happy")
]

class AIAnalyzer:
    def __init__(self):
        
        print("Loading AI Transformer Models... This may take a moment.")
        try:
            self.sentiment_pipeline = pipeline('sentiment-analysis', model="distilbert-base-uncased-finetuned-sst-2-english")
        except Exception as e:
            print(f"Failed to load transformer model: {e}")
            self.sentiment_pipeline = None

        
        self.emotion_model = make_pipeline(
            TfidfVectorizer(ngram_range=(1, 3)), 
            LogisticRegression(max_iter=1000, class_weight='balanced')
        )
        X_emo = [x[0] for x in EMOTION_DATA]
        y_emo = [x[1] for x in EMOTION_DATA]
        self.emotion_model.fit(X_emo, y_emo)

    def analyze(self, text):
        target_text = text[:512] 
        if self.sentiment_pipeline:
            result = self.sentiment_pipeline(target_text)[0]
            label = result['label']
            score = result['score']
            
            
            sentiment = "Positive" if label == "POSITIVE" else "Negative"
            sent_conf = round(score * 100, 2)
        else:
            
            sentiment = "Neutral"
            sent_conf = 0.0

        
        emo_pred = self.emotion_model.predict([text])[0]
        emo_prob = np.max(self.emotion_model.predict_proba([text])[0])

        return {
            "sentiment": sentiment,
            "sentiment_confidence": sent_conf,
            "emotion": emo_pred,
            "emotion_confidence": round(float(emo_prob) * 100, 2)
        }

analyzer = AIAnalyzer()

def generate_insights(reviews):
    """Generate dynamic insights based on accumulated metrics without static keyword logic."""
    if not reviews:
        return ["No reviews yet to analyze."]
    
    total = len(reviews)
    pos = sum(1 for r in reviews if r.sentiment == "Positive")
    neg = sum(1 for r in reviews if r.sentiment == "Negative")
    
    emotions = {}
    for r in reviews:
        emotions[r.emotion] = emotions.get(r.emotion, 0) + 1
    
    most_common_emotion = max(emotions, key=emotions.get) if emotions else "Unknown"

    insights = []
    
    if pos / total > 0.6:
        insights.append(f"Strong Positive consensus ({round(pos/total*100)}%). Teaching methods resonate well.")
    elif neg / total > 0.4:
        insights.append(f"Significant dissatisfaction detected ({round(neg/total*100)}%). Immediate review recommended.")
    
    if most_common_emotion == "Frustrated":
        insights.append("Dominant emotion aligns with 'Frustrated'. Likely caused by workload or strict grading.")
    elif most_common_emotion == "Confused":
        insights.append("Consistent 'Confused' signals detected. Consider clarifying the syllabus and prerequisites.")
    elif most_common_emotion == "Happy":
        insights.append("Students express happiness. The curriculum structure is succeeding.")
        
    if not insights:
        insights.append("The reviews show a balanced, evenly distributed sentiment overall.")
        
    return insights

def highlight_keywords(text):
    """
    Since predictions are no longer keyword-constrained, we simply return common 
    qualifier words purely for UI highlighting purposes.
    """
    ui_highlights = [
        "excellent", "good", "great", "amazing", "happy", "smile", 
        "bad", "poor", "terrible", "worst", "useless", "frustrating", 
        "outdated", "stressful", "stressed", "confusing", "confused", 
        "angry", "furious", "sad", "depressed", "outrageous", "not useful"
    ]
    
    words = text.lower().replace(".", "").replace(",", "")
    found = [word for word in ui_highlights if word in words]
    return list(set(found))
