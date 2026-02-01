import { ReactNode } from 'react';

interface ResultCardProps {
  title: string;
  children: ReactNode;
  className?: string;
}

const ResultCard = ({ title, children, className = '' }: ResultCardProps) => {
  return (
    <div className={`glass-card p-4 animate-fade-in ${className}`}>
      <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
        {title}
      </h3>
      {children}
    </div>
  );
};

export default ResultCard;
