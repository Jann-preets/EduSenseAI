🎓 EduSense AI

EduSense AI is an intelligent web application that analyzes student reviews using Sentiment Analysis and Emotion Detection to generate meaningful insights for educational improvement.

---

💡 Overview

EduSense AI goes beyond basic sentiment classification by understanding emotions and context in student feedback. It helps institutions identify strengths and weaknesses in teaching, syllabus, and overall learning experience.

---

✨ Features

🧠 AI-Powered Analysis

* Sentiment Classification: Positive, Negative, Neutral
* Emotion Detection: Happy, Sad, Angry, Frustrated, Confused

📊 Interactive Dashboard

* Sentiment distribution (Pie Chart)
* Emotion distribution (Bar Chart)
* Real-time updates

💬 Smart Insights

* Generates meaningful summaries from reviews
* Identifies common issues (e.g., stress, poor teaching)

📝 Review System

* Users can input and analyze reviews
* Stores review history

🎨 Modern UI/UX

* 3D-style design
* Smooth animations
* Light/Dark mode

---

🏗️ Tech Stack

Frontend

* React (Vite)
* Tailwind CSS
* Framer Motion
* Chart.js / Recharts

Backend

* FastAPI
* Uvicorn

AI/ML

* Scikit-learn (TF-IDF + ML models)
* Transformers (for advanced sentiment analysis)

Database

* SQLite / JSON

---

⚙️ Installation & Setup

1. Clone the repository
   git clone https://github.com/Jann-preets/EduSenseAI.git
   cd EduSenseAI

2. Backend Setup
   cd backend
   python -m venv venv
   source venv/bin/activate   (Mac/Linux)
   pip install -r requirements.txt
   uvicorn app:app --reload

3. Frontend Setup
   cd frontend
   npm install
   npm run dev

---

🚀 Usage

1. Open the frontend in browser (http://localhost:5173)
2. Enter a student review
3. Click Analyze
4. View sentiment, emotion, confidence score, and dashboard insights

---

🧪 Example Input

"The syllabus is outdated and not useful for real-world applications."

Output:

* Sentiment: Negative
* Emotion: Frustrated

---

📈 Future Improvements

* Improve model accuracy using deep learning
* Add voice-based input
* Deploy on cloud (AWS / Vercel)
* Personalized analytics for institutions

---

🤝 Contributing

TEAM MEMBERS:
* Janar Preethika
* Prithika
* Harini
* Nainika
* Shreyaa

---

📄 License

This project is open-source and available under the MIT License.

---

💡 Vision

EduSense AI aims to transform raw student feedback into actionable insights, helping institutions create better learning experiences.
