
import React, { useState, useMemo } from 'react';
import { Search, Plus, LayoutGrid, List as ListIcon, Clock, MapPin } from 'lucide-react';
import { Freelancer, FreelancerStatus, Assignment } from '../types';
import { Link } from 'react-router-dom';
import { Badge } from '../src/components/design/Badge';
import { Button } from '../src/components/design/Button';
import { Card } from '../src/components/design/Card';

interface FreelancerListProps {
  freelancers: Freelancer[];
  assignments?: Assignment[]; 
  onCreate?: () => void;
}

// "God Mode" IsAwake Logic
const IsAwakeIndicator = ({ timezone }: { timezone: string }) => {
    let timeString = '';
    let isAwake = false;
    let isLate = false;

    try {
        const now = new Date();
        timeString = now.toLocaleTimeString('en-US', { timeZone: timezone, hour: '2-digit', minute: '2-digit', hour12: false });
        const hour = parseInt(timeString.split(':')[0]);
        isAwake = hour >= 9 && hour < 18;
        isLate = hour >= 22 || hour < 6;
    } catch (e) {
        timeString = 'UNK';
    }

    return (
        <div className="flex items-center gap-2 text-[10px] font-mono font-bold tracking-tight bg-subtle/50 px-2 py-1 rounded-md border border-border-subtle">
            <div className={`w-1.5 h-1.5 rounded-full ${isAwake ? 'bg-state-success shadow-[0_0_6px_rgba(22,163,74,0.6)]' : isLate ? 'bg-ink-tertiary' : 'bg-state-warning'}`}></div>
            <span className="text-ink-secondary">{timeString}</span>
        </div>
    );
};

const FreelancerList: React.FC<FreelancerListProps> = ({ freelancers, assignments = [], onCreate }) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchText, setSearchText] = useState('');
  
  const filteredFreelancers = useMemo(() => {
    return freelancers.filter(f => f.name.toLowerCase().includes(searchText.toLowerCase()));
  }, [freelancers, searchText]);

  return (
    <div className="p-8 max-w-[2000px] mx-auto space-y-8 animate-enter pb-24 font-sans">
       {/* Header */}
       <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-5xl font-display font-semibold tracking-tighter text-ink-primary leading-[0.9]">Roster.</h1>
          <p className="text-ink-secondary mt-2 text-sm font-medium tracking-wide">Global talent index.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="primary" leftIcon={<Plus size={14} />} onClick={onCreate}>
            Add Talent
          </Button>
        </div>
      </div>

      {/* Controls */}
       <div className="bg-surface p-2 rounded-xl flex flex-col xl:flex-row gap-4 xl:items-center justify-between sticky top-4 z-20 shadow-card border border-border-subtle/60 backdrop-blur-md">
        <div className="relative w-full xl:w-96 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-tertiary group-focus-within:text-primary transition-colors" size={14} />
            <input
                type="text"
                placeholder="Search by name or skill..."
                className="w-full pl-9 pr-4 py-2.5 bg-subtle/30 border border-transparent rounded-lg focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary text-xs transition-all font-medium placeholder-ink-tertiary text-ink-primary outline-none"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
            />
        </div>
        
        <div className="flex items-center gap-2 p-1">
            <div className="flex bg-subtle/50 p-1 rounded-lg border border-border-subtle">
                <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-ink-primary' : 'text-ink-tertiary hover:text-ink-secondary'}`}>
                    <LayoutGrid size={16}/>
                </button>
                <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-ink-primary' : 'text-ink-tertiary hover:text-ink-secondary'}`}>
                    <ListIcon size={16}/>
                </button>
            </div>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredFreelancers.map((freelancer) => (
                  <Link key={freelancer.id} to={`/freelancers/${freelancer.id}`}>
                      <Card className="h-full flex flex-col p-6 hover:-translate-y-1 transition-transform duration-300">
                          <div className="flex justify-between items-start mb-5">
                               <div className="relative">
                                   <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-sm ring-1 ring-black/5">
                                      <img src={freelancer.avatar} alt={freelancer.name} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" />
                                   </div>
                               </div>
                               <div className="text-right flex flex-col items-end gap-1">
                                   <IsAwakeIndicator timezone={freelancer.timezone} />
                               </div>
                          </div>
                          
                          <div className="mb-6">
                              <h3 className="font-display font-semibold text-lg text-ink-primary leading-tight hover:text-primary transition-colors tracking-tight">{freelancer.name}</h3>
                              <p className="text-xs text-ink-secondary font-medium mt-1 uppercase tracking-wide">{freelancer.role}</p>
                          </div>

                          <div className="flex flex-wrap gap-1.5 mt-auto">
                              {(freelancer.skills || []).slice(0, 3).map(skill => (
                                  <span key={skill} className="px-2 py-1 bg-subtle text-ink-secondary text-[9px] font-bold uppercase tracking-wider rounded border border-border-subtle">{skill}</span>
                              ))}
                          </div>
                          
                          <div className="mt-5 pt-4 border-t border-border-subtle flex justify-between items-center">
                              <span className="text-[10px] font-mono font-semibold text-ink-primary uppercase tracking-wider">
                                {freelancer.currency === 'USD' ? '$' : freelancer.currency}{freelancer.rate}<span className="text-ink-tertiary text-[9px]">/Day</span>
                              </span>
                              <Badge variant={freelancer.status === FreelancerStatus.ACTIVE ? 'success' : 'neutral'}>
                                  {freelancer.status}
                              </Badge>
                          </div>
                      </Card>
                  </Link>
              ))}
          </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
      <Card noPadding className="overflow-hidden">
        <table className="w-full text-left border-collapse">
            <thead className="bg-subtle/30 border-b border-border-subtle">
              <tr>
                <th className="px-8 py-5 text-[10px] font-bold text-ink-tertiary uppercase tracking-widest">Talent</th>
                <th className="px-8 py-5 text-[10px] font-bold text-ink-tertiary uppercase tracking-widest">Local Time</th>
                <th className="px-8 py-5 text-[10px] font-bold text-ink-tertiary uppercase tracking-widest">Rate</th>
                <th className="px-8 py-5 text-[10px] font-bold text-ink-tertiary uppercase tracking-widest">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle bg-surface">
              {filteredFreelancers.map((freelancer) => (
                <tr key={freelancer.id} className="group hover:bg-subtle/30 transition-colors">
                  <td className="px-8 py-5">
                    <Link to={`/freelancers/${freelancer.id}`} className="flex items-center gap-4">
                        <img src={freelancer.avatar} className="w-10 h-10 rounded-xl grayscale group-hover:grayscale-0 transition-all border border-border-subtle object-cover" />
                        <div>
                            <div className="text-sm font-semibold text-ink-primary tracking-tight group-hover:text-primary transition-colors">{freelancer.name}</div>
                            <div className="text-[10px] text-ink-secondary uppercase tracking-wide font-medium">{freelancer.role}</div>
                        </div>
                    </Link>
                  </td>
                  <td className="px-8 py-5">
                    <IsAwakeIndicator timezone={freelancer.timezone} />
                  </td>
                  <td className="px-8 py-5">
                    <div className="text-xs font-mono font-medium text-ink-primary tracking-tight">{freelancer.currency === 'USD' ? '$' : freelancer.currency}{freelancer.rate}</div>
                  </td>
                  <td className="px-8 py-5">
                    <Badge variant={freelancer.status === FreelancerStatus.ACTIVE ? 'success' : 'neutral'}>
                        {freelancer.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
        </table>
      </Card>
      )}
    </div>
  );
};

export default FreelancerList;
