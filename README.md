# AI-Powered Portfolio Evaluation System

An end-to-end AI-based system that evaluates a candidate’s **portfolio website against a Job Description (JD)** using **Google Gemini models**.  
The system performs **strict recruiter-style analysis**, ATS keyword matching, and skill gap detection, and presents results via a modern React frontend.

---

## 🚀 Features

- 🔍 **Portfolio scraping & analysis**
- 📄 **JD-based strict recruiter evaluation**
- 🧠 **Gemini model–powered reasoning**
- 📊 ATS keyword match scoring
- 🧩 Strong / Partial / Missing skill detection
- ⚙️ **Frontend-controlled model selection**
- 🔑 **Frontend-provided Gemini API key**
- 🌐 Modern React + Tailwind UI
- 🔌 Flask REST API backend

---

## 🧠 How It Works

1. User opens the frontend UI
2. User enters:
   - Portfolio URL
   - Job Description
   - Gemini API Key (via Settings)
   - Gemini model (via Settings)
3. Frontend sends all inputs to the backend
4. Backend:
   - Scrapes the portfolio website
   - Extracts ATS keywords from JD
   - Evaluates skills using Gemini
   - Generates a strict recruiter-style decision
5. Frontend visualizes:
   - JD Fit Score
   - ATS Match Score
   - Hiring Decision (Shortlist / Hold / Reject)
   - Missing and partial skills

---

## ⚙️ Backend Setup (Flask)

### 1️⃣ Create Virtual Environment
```bash
python -m venv .venv
source .venv/bin/activate   # Linux / Mac
.venv\Scripts\activate      # Windows
````

### 2️⃣ Install Dependencies

```bash
pip install -r requirements.txt
```

### 3️⃣ Install Playwright Browsers

```bash
playwright install
```

### 4️⃣ Run Backend

```bash
python app.py
```

Backend runs at:

```
http://127.0.0.1:5000
```

---

## 🎨 Frontend Setup (React + Vite)

### 1️⃣ Navigate to Frontend

```bash
cd ai-skill-evaluator
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Run Frontend

```bash
npm run dev
```

Frontend runs at:

```
http://localhost:5173
```

---

## 🔑 Gemini API Key Handling

⚠️ **Important Note**

* The Gemini API key is **entered via the frontend UI**
* The key is sent to the backend **per request**
* The backend does **not store** the API key
* This approach is suitable for:

  * Local development
  * Internal tools
  * Demos
* **Not recommended for public production deployments**

---

## 📡 API Endpoints

### 🔹 List Available Models

```http
POST /models
```

**Body**

```json
{
  "api_key": "YOUR_GEMINI_API_KEY"
}
```

---

### 🔹 Analyze Portfolio

```http
POST /analyze
```

**Body**

```json
{
  "portfolio_url": "https://example.com",
  "job_description": "Full job description text",
  "model": "models/gemini-flash-lite-latest",
  "api_key": "YOUR_GEMINI_API_KEY"
}
```

---

## 📊 Sample Output

```json
{
  "jd_fit_score": 40,
  "hiring_decision": "Hold",
  "ats_match": {
    "ats_keyword_score": 52
  },
  "skill_evidence": {
    "partial_matches": ["Java", "JS"],
    "missing_skills": ["Azure ML", "Generative AI"]
  }
}
```

---

## 🛠️ Tech Stack

**Backend**

* Python
* Flask
* Playwright
* Google Gemini API

**Frontend**

* React
* TypeScript
* Vite
* Tailwind CSS
* shadcn/ui

---

## ⚠️ Disclaimer

This system provides **AI-assisted analysis** and should be used as a **decision-support tool**, not as a sole hiring authority.

---

## 📌 Future Enhancements

* Secure API key handling
* Authentication & user accounts
* Resume PDF parsing
* Score normalization
* Multi-JD comparison
* Cloud deployment (Docker)

---

## 👤 Author

Developed by **Vignesh Hariraj**
AI & ML Engineer | Portfolio Evaluation System

---

## ⭐ If you find this useful

Give the repo a ⭐ and feel free to contribute!

