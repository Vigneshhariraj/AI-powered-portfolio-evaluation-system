import re
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
from playwright.sync_api import sync_playwright
import google.generativeai as genai

app = Flask(__name__)
CORS(app)

MAX_TEXT_LENGTH = 6000


# =========================================================
# UTILS
# =========================================================
def extract_json(text: str):
    start = text.find("{")
    end = text.rfind("}")
    if start == -1 or end == -1:
        raise ValueError("Model did not return valid JSON")
    return json.loads(text[start:end + 1])


def list_text_models(api_key: str):
    genai.configure(api_key=api_key)
    models = []

    for m in genai.list_models():
        name = m.name.lower()
        methods = m.supported_generation_methods or []

        if "generateContent" not in methods:
            continue

        if any(x in name for x in [
            "image", "audio", "vision", "embedding",
            "tts", "robot", "veo", "imagen"
        ]):
            continue

        models.append(m.name)

    return models


# =========================================================
# API: LIST MODELS (API KEY FROM FRONTEND)
# =========================================================
@app.route("/models", methods=["POST"])
def get_models():
    data = request.get_json()
    api_key = data.get("api_key")

    if not api_key:
        return jsonify({"error": "API key required"}), 400

    try:
        models = list_text_models(api_key)
        return jsonify({"models": models})
    except Exception as e:
        return jsonify({"error": str(e)}), 400


# =========================================================
# PORTFOLIO RENDER
# =========================================================
def render_portfolio(url: str):
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto(url, wait_until="domcontentloaded", timeout=60000)
        page.wait_for_timeout(3000)

        text = page.evaluate("() => document.body.innerText")
        html = page.content()
        links = page.evaluate(
            "() => Array.from(document.querySelectorAll('a')).map(a => a.href)"
        )

        browser.close()

    clean_text = " ".join(text.split())
    return clean_text[:MAX_TEXT_LENGTH], html, links


def detect_build_type(html: str, links: list):
    score = 0
    if re.search(r'id="root"|id="app"', html, re.I):
        score += 2
    if "react" in html.lower():
        score += 2
    if any("netlify.app" in l or "vercel.app" in l for l in links):
        score += 1

    if score >= 3:
        return {"build_type": "React / SPA", "confidence": round(score / 5, 2)}
    return {"build_type": "Static HTML", "confidence": 0.9}


# =========================================================
# CORE ANALYSIS
# =========================================================
def analyze_with_model(api_key, model_name, portfolio_url, jd_text):
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel(model_name)

    def gen(prompt):
        return model.generate_content(prompt).text

    portfolio_text, html, links = render_portfolio(portfolio_url)
    build_info = detect_build_type(html, links)

    jd_prompt = f"""
Extract minimal hiring data.

Return JSON only:
{{ "job_title": "", "ats_keywords": [] }}

JD:
\"\"\"{jd_text}\"\"\"
"""
    jd_data = extract_json(gen(jd_prompt))
    ats_keywords = jd_data.get("ats_keywords", [])

    text_lower = portfolio_text.lower()
    matched = [k for k in ats_keywords if k.lower() in text_lower]
    missing = [k for k in ats_keywords if k.lower() not in text_lower]

    ats_score = int((len(matched) / max(len(ats_keywords), 1)) * 100)

    fit_prompt = f"""
STRICT recruiter.

Return JSON only:
{{
 "strong_matches": [],
 "partial_matches": [],
 "missing_skills": [],
 "jd_fit_score": 0,
 "hiring_decision": "Shortlist | Hold | Reject",
 "decision_reason": ""
}}

Portfolio:
\"\"\"{portfolio_text}\"\"\"

ATS Keywords:
{ats_keywords}
"""
    fit = extract_json(gen(fit_prompt))

    return {
        "portfolio_url": portfolio_url,
        "job_title": jd_data.get("job_title", ""),
        "evaluation_mode": "STRICT_JD_BASED_RECRUITER",
        "portfolio_build": build_info,
        "ats_match": {
            "ats_keyword_score": ats_score,
            "matched_keyword_count": len(matched),
            "missing_keyword_count": len(missing)
        },
        "skill_evidence": {
            "strong_match_count": len(fit["strong_matches"]),
            "partial_match_count": len(fit["partial_matches"]),
            "missing_skill_count": len(fit["missing_skills"]),
            "partial_matches": fit["partial_matches"],
            "missing_skills": fit["missing_skills"]
        },
        "jd_fit_score": fit["jd_fit_score"],
        "hiring_decision": fit["hiring_decision"],
        "decision_reason": fit["decision_reason"]
    }


# =========================================================
# API: ANALYZE
# =========================================================
@app.route("/analyze", methods=["POST"])
def analyze():
    data = request.get_json()

    required = ["portfolio_url", "job_description", "model", "api_key"]
    if not all(k in data for k in required):
        return jsonify({"error": "Missing required fields"}), 400

    try:
        result = analyze_with_model(
            data["api_key"],
            data["model"],
            data["portfolio_url"],
            data["job_description"]
        )
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=False)
