interface SkillBadgeProps {
  skill: string;
  type: 'strong' | 'partial' | 'missing';
}

const SkillBadge = ({ skill, type }: SkillBadgeProps) => {
  const typeClasses = {
    strong: 'stat-badge-success',
    partial: 'stat-badge-warning',
    missing: 'stat-badge-destructive',
  };

  return (
    <span className={typeClasses[type]}>
      {skill}
    </span>
  );
};

export default SkillBadge;
