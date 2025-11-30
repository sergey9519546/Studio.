import React from 'react';
import { Zap, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Project, Priority } from '../../types';

interface PriorityStackProps {
    projects: Project[];
}

const PriorityStack: React.FC<PriorityStackProps> = ({ projects }) => {
    const urgentProjects = projects
        .filter(p => p.priority === Priority.URGENT || p.priority === Priority.HIGH)
        .slice(0, 5);

    return (
        <div className="bg-white rounded-2xl border border-mist p-6 shadow-card hover:shadow-lg hover:-translate-y-[2px] transition-all duration-200 h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xs font-semibold text-pencil uppercase tracking-wide flex items-center gap-2">
                    <Zap size={16} className="text-amber-500 fill-amber-500" /> Critical Path
                </h3>
                <Link to="/projects?filter=urgent" className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors group">
                    View All <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
                </Link>
            </div>

            <div className="flex-1 space-y-3">
                {urgentProjects.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-canvas/30 rounded-xl border border-dashed border-mist">
                        <span className="text-sm text-pencil font-medium">All systems normal. No critical items.</span>
                    </div>
                ) : (
                    urgentProjects.map((project, i) => (
                        <Link
                            key={project.id}
                            to={`/projects/${project.id}`}
                            className="flex items-center justify-between p-4 rounded-xl bg-white border border-mist hover:border-indigo-200 hover:shadow-md hover:-translate-y-[1px] transition-all duration-200 group"
                            style={{ animationDelay: `${i * 50}ms` }}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-2 h-2 rounded-full ${project.priority === Priority.URGENT ? 'bg-rose-500' : 'bg-amber-500'}`}></div>
                                <div>
                                    <div className="font-semibold text-sm text-ink group-hover:text-indigo-600 transition-colors duration-200">{project.name}</div>
                                    <div className="text-xs text-pencil mt-0.5">{project.clientName}</div>
                                </div>
                            </div>
                            <div className="text-xs font-medium text-ink bg-canvas px-2.5 py-1 rounded-lg border border-mist group-hover:border-indigo-100 transition-colors duration-200">
                                {project.dueDate ? new Date(project.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'ASAP'}
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
};

export default PriorityStack;
