interface DecisionBadgeProps {
  decision: string;
}

const DecisionBadge = ({ decision }: DecisionBadgeProps) => {
  const normalizedDecision = decision.toLowerCase();
  
  const getDecisionStyles = () => {
    switch (normalizedDecision) {
      case 'hire':
      case 'yes':
      case 'accept':
        return 'bg-success/20 text-success border-success/30';
      case 'hold':
      case 'maybe':
      case 'pending':
        return 'bg-warning/20 text-warning border-warning/30';
      case 'reject':
      case 'no':
      case 'decline':
        return 'bg-destructive/20 text-destructive border-destructive/30';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  return (
    <span className={`inline-flex items-center px-4 py-2 text-lg font-semibold rounded-lg border ${getDecisionStyles()}`}>
      {decision}
    </span>
  );
};

export default DecisionBadge;
