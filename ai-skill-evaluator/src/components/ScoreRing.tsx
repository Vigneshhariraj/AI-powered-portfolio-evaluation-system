interface ScoreRingProps {
  score: number;
  label: string;
  size?: 'sm' | 'md' | 'lg';
}

const ScoreRing = ({ score, label, size = 'md' }: ScoreRingProps) => {
  const sizeClasses = {
    sm: { outer: 'w-14 h-14', inner: 'w-10 h-10 text-sm' },
    md: { outer: 'w-20 h-20', inner: 'w-16 h-16 text-xl' },
    lg: { outer: 'w-24 h-24', inner: 'w-20 h-20 text-2xl' },
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'hsl(158 64% 52%)'; // success
    if (score >= 40) return 'hsl(38 92% 50%)'; // warning
    return 'hsl(0 72% 51%)'; // destructive
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`relative flex items-center justify-center rounded-full ${sizeClasses[size].outer}`}
        style={{
          background: `conic-gradient(${getScoreColor(score)} ${score}%, hsl(222 30% 12%) 0%)`,
        }}
      >
        <div
          className={`absolute flex items-center justify-center rounded-full bg-card font-bold ${sizeClasses[size].inner}`}
        >
          {score}%
        </div>
      </div>
      <span className="text-xs text-muted-foreground uppercase tracking-wider">{label}</span>
    </div>
  );
};

export default ScoreRing;
