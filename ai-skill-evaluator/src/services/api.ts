const API_BASE = "http://127.0.0.1:5000";

export async function fetchModels(apiKey: string) {
  const res = await fetch(`${API_BASE}/models`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ api_key: apiKey })
  });
  return res.json();
}

export async function analyzePortfolio(payload: {
  portfolio_url: string;
  job_description: string;
  model: string;
  api_key: string;
}) {
  const res = await fetch(`${API_BASE}/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  return res.json();
}
