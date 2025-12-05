import React, { useState } from 'react';
import { Search, Filter, Star, MapPin, Briefcase } from 'lucide-react';
import { Card } from './design/Card';
import { Button } from './design/Button';
import { Input } from './design/Input';
import { LiquidGlassContainer } from './design/LiquidGlassContainer';

interface Freelancer {
  id: string;
  name: string;
  role: string;
  availability: string;
  rate: number;
  skills: string[];
  location: string;
  rating: number;
  bio: string;
  portfolio?: string;
}

interface TalentRosterProps {
  freelancers?: Freelancer[];
  onSelect?: (freelancer: Freelancer) => void;
  onTalentMatch?: (projectBrief: string) => void;
}

export const TalentRoster: React.FC<TalentRosterProps> = ({
  freelancers = [],
  onSelect,
  onTalentMatch,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [filteredFreelancers, setFilteredFreelancers] = useState(freelancers);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    filterFreelancers(query, selectedSkills);
  };

  const toggleSkillFilter = (skill: string) => {
    const newSkills = selectedSkills.includes(skill)
      ? selectedSkills.filter(s => s !== skill)
      : [...selectedSkills, skill];
    setSelectedSkills(newSkills);
    filterFreelancers(searchQuery, newSkills);
  };

  const filterFreelancers = (query: string, skills: string[]) => {
    let results = freelancers;

    if (query) {
      results = results.filter(f =>
        f.name.toLowerCase().includes(query.toLowerCase()) ||
        f.role.toLowerCase().includes(query.toLowerCase()) ||
        f.skills.some(s => s.toLowerCase().includes(query.toLowerCase()))
      );
    }

    if (skills.length > 0) {
      results = results.filter(f =>
        skills.some(skill => f.skills.includes(skill))
      );
    }

    setFilteredFreelancers(results);
  };

  const allSkills = Array.from(
    new Set(freelancers.flatMap(f => f.skills))
  ).sort();

  return (
    <div className="w-full h-full bg-app">
      <div className="max-w-7xl mx-auto p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-ink-primary mb-2">Talent Roster</h1>
          <p className="text-ink-secondary">Discover and match creative professionals with your projects</p>
        </div>

        {/* Search & Filter */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-2">
            <Input
              placeholder="Search by name, role, or skill..."
              icon={<Search size={18} />}
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          <Button onClick={() => onTalentMatch?.(searchQuery)}>
            <Briefcase size={16} className="mr-2" />
            AI Talent Match
          </Button>
        </div>

        {/* Skill Filters */}
        {allSkills.length > 0 && (
          <div className="mb-8">
            <h3 className="text-sm font-bold text-ink-secondary uppercase tracking-wide mb-3">Filter by Skills</h3>
            <div className="flex flex-wrap gap-2">
              {allSkills.map(skill => (
                <button
                  key={skill}
                  onClick={() => toggleSkillFilter(skill)}
                  className={`px-3 py-1.5 rounded-[24px] text-xs font-medium transition-all ${
                    selectedSkills.includes(skill)
                      ? 'bg-primary text-ink-inverse'
                      : 'bg-subtle text-ink-secondary hover:bg-surface'
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Freelancer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFreelancers.length > 0 ? (
            filteredFreelancers.map(freelancer => (
              <Card key={freelancer.id} hoverable onClick={() => onSelect?.(freelancer)}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-ink-primary">{freelancer.name}</h3>
                    <p className="text-sm text-ink-secondary">{freelancer.role}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star size={16} className="text-edge-magenta fill-edge-magenta" />
                    <span className="text-sm font-semibold text-ink-primary">{freelancer.rating}</span>
                  </div>
                </div>

                <div className="mb-4 space-y-2">
                  <div className="flex items-center text-sm text-ink-secondary">
                    <MapPin size={14} className="mr-2" />
                    {freelancer.location}
                  </div>
                  <div className="text-sm">
                    <span className="font-semibold text-primary">${freelancer.rate}</span>
                    <span className="text-ink-secondary">/hour</span>
                  </div>
                </div>

                {freelancer.bio && (
                  <p className="text-sm text-ink-secondary mb-4 line-clamp-2">{freelancer.bio}</p>
                )}

                {/* Skills */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {freelancer.skills.slice(0, 3).map(skill => (
                      <span
                        key={skill}
                        className="px-2 py-1 rounded-[12px] bg-primary-tint text-primary text-xs font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                    {freelancer.skills.length > 3 && (
                      <span className="px-2 py-1 text-xs text-ink-tertiary">
                        +{freelancer.skills.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Availability */}
                <div className="mb-4">
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-[12px] ${
                      freelancer.availability === 'available'
                        ? 'bg-state-success-bg text-state-success'
                        : 'bg-state-warning-bg text-state-warning'
                    }`}
                  >
                    {freelancer.availability === 'available' ? '✓ Available' : 'Limited Availability'}
                  </span>
                </div>

                <Button variant="secondary" className="w-full">
                  View Profile
                </Button>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <Briefcase size={48} className="mx-auto text-ink-tertiary mb-4" />
              <p className="text-ink-secondary">No freelancers match your criteria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TalentRoster;
