import React from 'react';
import { Link, useInRouterContext } from 'react-router-dom';

interface FreelancerCardProps {
  freelancer: {
    id: string;
    name: string;
    role: string;
    rate: number;
    availability?: 'AVAILABLE' | 'BUSY' | string;
    skills?: string[];
    email?: string;
  };
  onClick?: (id: string) => void;
  showContact?: boolean;
}

const FreelancerCard: React.FC<FreelancerCardProps> = ({ freelancer, onClick, showContact }) => {
  const inRouter = useInRouterContext();
  const { id, name, role, rate, availability = 'AVAILABLE', skills = [], email } = freelancer;
  const badgeClass = availability === 'BUSY' ? 'text-state-warning' : 'text-state-success';

  const body = (
    <div className="p-4 border border-border-subtle rounded-xl shadow-sm bg-white hover:shadow-md transition-all">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-lg font-semibold">{name}</div>
          <div className="text-sm text-ink-secondary">{role}</div>
        </div>
        <div className={`text-xs font-bold uppercase ${badgeClass}`}>{availability.toLowerCase()}</div>
      </div>
      <div className="mt-2 text-sm text-ink-primary font-medium">${rate.toLocaleString()}</div>
      {skills.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {skills.map(skill => (
            <span key={skill} className="px-2 py-1 text-[11px] bg-subtle rounded-md text-ink-secondary">
              {skill}
            </span>
          ))}
        </div>
      )}
      {showContact && email && <div className="mt-3 text-xs text-ink-tertiary">{email}</div>}
    </div>
  );

  const handleClick = () => {
    onClick?.(id);
  };

  if (inRouter) {
    return (
      <Link to={`/freelancers/${id}`} onClick={handleClick} className="block focus:outline-none">
        {body}
      </Link>
    );
  }

  return (
    <div onClick={handleClick} className="cursor-pointer">
      {body}
    </div>
  );
};

export default FreelancerCard;
