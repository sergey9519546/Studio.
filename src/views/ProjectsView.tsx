import React from 'react';
import { Plus, MoreHorizontal, ArrowRight } from 'lucide-react';
import Card from '../components/ui/Card';

// Define the Project type based on its usage in the component
interface Project {
    id: string;
    status: string;
    title: string;
    description: string;
}

interface ProjectsViewProps {
  projects: Project[];
  onSelect: (project: Project) => void;
}

const ProjectsView: React.FC<ProjectsViewProps> = ({ projects, onSelect }) => (
    <div className="pt-12 px-12 max-w-[1600px] mx-auto animate-in fade-in">
        <div className="flex justify-between items-end mb-8">
            <div>
                <h1 className="text-4xl font-bold tracking-tight text-[#1D1D1F] mb-2">Manifests</h1>
                <p className="text-[#86868B] text-sm">Active creative engagements.</p>
            </div>
            <div className="flex gap-2">
                <button className="px-4 py-2 bg-white border border-gray-200 rounded-[14px] text-xs font-bold hover:border-black transition-colors">Filter</button>
            </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div 
            className="group cursor-pointer min-h-[320px] rounded-xl border-2 border-dashed border-[#E5E5E5] flex flex-col items-center justify-center hover:border-[#1D1D1F]/30 hover:bg-white/50 transition-all duration-300"
            >
                <div className="w-16 h-16 rounded-full bg-white shadow-md flex items-center justify-center text-[#86868B] group-hover:text-[#1D1D1F] group-hover:scale-110 transition-all mb-6">
                    <Plus size={32} />
                </div>
                <span className="font-medium text-[#86868B] group-hover:text-[#1D1D1F]">Initiate Manifest</span>
            </div>
            {projects.map(p => (
                <Card key={p.id} onClick={() => onSelect(p)} className="min-h-[320px] flex flex-col justify-between group cursor-pointer hover:border-[#1D1D1F]/10">
                    <div>
                        <div className="flex justify-between items-start mb-8">
                            <span className="px-3 py-1 bg-[#F5F5F7] border border-gray-100 rounded-lg text-[10px] uppercase font-bold tracking-wider text-[#86868B] flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500"/> {p.status}
                            </span>
                            <button className="text-gray-300 hover:text-black transition-colors"><MoreHorizontal size={20}/></button>
                        </div>
                        <h3 className="text-3xl font-bold text-[#1D1D1F] mb-3 group-hover:translate-x-1 transition-transform kinetic-text">{p.title}</h3>
                        <p className="text-[#86868B] text-sm line-clamp-2 leading-relaxed">{p.description}</p>
                    </div>
                    <div className="pt-8 border-t border-gray-50 flex justify-between items-end">
                        <div className="flex -space-x-3">
                            <div className="w-10 h-10 rounded-full bg-gray-100 border-2 border-white"/>
                            <div className="w-10 h-10 rounded-full bg-gray-200 border-2 border-white"/>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-[#1D1D1F] text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-xl">
                            <ArrowRight size={20}/>
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    </div>
);

export default ProjectsView;
