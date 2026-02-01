import { useState } from 'react';

import { Settings, ExternalLink, Loader2, Zap } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { Input } from '@/components/ui/input';

import { Textarea } from '@/components/ui/textarea';

import { Label } from '@/components/ui/label';

import SettingsModal from '@/components/SettingsModal';

import ResultCard from '@/components/ResultCard';

import ScoreRing from '@/components/ScoreRing';

import SkillBadge from '@/components/SkillBadge';

import DecisionBadge from '@/components/DecisionBadge';

import { analyzePortfolio } from '@/services/api';


const Index = () => {
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [selectedModel, setSelectedModel] = useState('gemini-1.5-flash');
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (!portfolioUrl || !jobDescription) {
      setError('Please enter both portfolio URL and job description');
      return;
    }

    if (!apiKey) {
      setError('Please set your API key in settings');
      setSettingsOpen(true);
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      const data = await analyzePortfolio({
        portfolio_url: portfolioUrl,
        job_description: jobDescription,
        model: selectedModel,
        api_key: apiKey
      });

      if (data.error) {
        setError(data.error);
        setResult(null);
      } else {
        setResult(data);
      }
    } catch (err) {
      setError('Failed to analyze portfolio. Please check your inputs and try again.');
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold gradient-text">PortfolioAI</h1>
              <p className="text-xs text-muted-foreground">
                AI-powered candidate evaluation
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setSettingsOpen(true)}
            className="border-border hover:bg-accent/10"
          >
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Panel - Input */}
          <div className="space-y-6">
            <ResultCard title="Input Details" icon={ExternalLink}>
              <div className="space-y-4">
                {/* Portfolio Link Input */}
                <div className="space-y-2">
                  <Label htmlFor="portfolio" className="text-foreground">
                    Portfolio URL
                  </Label>
                  <Input
                    id="portfolio"
                    placeholder="https://example.com"
                    value={portfolioUrl}
                    onChange={(e) => setPortfolioUrl(e.target.value)}
                    className="bg-input border-border text-foreground placeholder:text-muted-foreground input-glow"
                  />
                </div>

                {/* Job Description Input */}
                <div className="space-y-2">
                  <Label htmlFor="jd" className="text-foreground">
                    Job Description
                  </Label>
                  <Textarea
                    id="jd"
                    placeholder="Paste the job description here..."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    className="bg-input border-border text-foreground placeholder:text-muted-foreground input-glow min-h-[300px] resize-none"
                  />
                </div>

                {/* Error Message */}
                {error && (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
                    {error}
                  </div>
                )}

                {/* Analyze Button */}
                <Button
                  onClick={handleAnalyze}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white font-semibold"
                >
                  {isLoading ? (
                    <>
                      Analyzing...
                      <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                    </>
                  ) : (
                    'Analyze Portfolio'
                  )}
                </Button>
              </div>
            </ResultCard>
          </div>

          {/* Right Panel - Results */}
          <div className="space-y-6">
            {!result ? (
              <ResultCard title="Analysis Results">
                <div className="text-center py-12 text-muted-foreground">
                  <p className="text-lg mb-2">
                    Enter a portfolio URL and job description
                  </p>
                  <p className="text-sm">Results will appear here</p>
                </div>
              </ResultCard>
            ) : (
              <>
                {/* Decision Card */}
                <ResultCard
                  title={result.job_title}
                  badge={<DecisionBadge decision={result.hiring_decision} />}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-center">
                      <ScoreRing
                        score={result.jd_fit_score}
                        label="JD Fit Score"
                      />
                    </div>

                    {/* Decision Reason */}
                    <div className="p-4 rounded-lg bg-muted/30 border border-border">
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {result.decision_reason}
                      </p>
                    </div>

                    {/* Portfolio Info */}
                    <div className="space-y-2">
                      <a
                        href={result.portfolio_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline flex items-center gap-1"
                      >
                        {result.portfolio_url}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Build Type
                          </p>
                          <p className="text-sm font-medium">
                            {result.portfolio_build.build_type}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Confidence
                          </p>
                          <p className="text-sm font-medium">
                            {Math.round(result.portfolio_build.confidence * 100)}%
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </ResultCard>

                {/* ATS Match Details */}
                <ResultCard title="ATS Keyword Match">
                  <div className="flex items-center justify-center mb-4">
                    <ScoreRing
                      score={result.ats_match.ats_keyword_score}
                      label="ATS Score"
                      size="sm"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">
                        Matched Keywords
                      </p>
                      <p className="text-2xl font-bold text-green-500">
                        {result.ats_match.matched_keyword_count}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">
                        Missing Keywords
                      </p>
                      <p className="text-2xl font-bold text-red-500">
                        {result.ats_match.missing_keyword_count}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">
                        Evaluation Mode
                      </p>
                      <p className="text-xs font-medium mt-2">
                        {result.evaluation_mode}
                      </p>
                    </div>
                  </div>
                </ResultCard>

                {/* Skill Evidence */}
                <ResultCard title="Skill Evidence">
                  <div className="space-y-4">
                    {/* Strong Matches */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-muted-foreground">
                          Strong Matches
                        </p>
                        <span className="text-xs bg-green-500/20 text-green-500 px-2 py-1 rounded-full">
                          {result.skill_evidence.strong_match_count}
                        </span>
                      </div>
                    </div>

                    {/* Partial Matches */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-muted-foreground">
                          Partial Matches
                        </p>
                        <span className="text-xs bg-yellow-500/20 text-yellow-500 px-2 py-1 rounded-full">
                          {result.skill_evidence.partial_match_count}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {result.skill_evidence.partial_matches.map((skill) => (
                          <SkillBadge key={skill} skill={skill} status="partial" />
                        ))}
                      </div>
                    </div>

                    {/* Missing Skills */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-muted-foreground">
                          Missing Skills
                        </p>
                        <span className="text-xs bg-red-500/20 text-red-500 px-2 py-1 rounded-full">
                          {result.skill_evidence.missing_skill_count}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {result.skill_evidence.missing_skills.map((skill) => (
                          <SkillBadge key={skill} skill={skill} status="missing" />
                        ))}
                      </div>
                    </div>
                  </div>
                </ResultCard>
              </>
            )}
          </div>
        </div>
      </main>

      {/* Settings Modal */}
      <SettingsModal
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        apiKey={apiKey}
        onApiKeyChange={setApiKey}
        selectedModel={selectedModel}
        onModelChange={setSelectedModel}
      />
    </div>
  );
};

export default Index;
