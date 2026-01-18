import React, { useState } from 'react';
import { LiquidContainer, LiquidToolbar, LiquidButton } from '../components/future-editor/LiquidInterface';
import { ObjectEditor } from '../components/future-editor/ObjectEditor';
import { SemanticTimeline } from '../components/future-editor/SemanticTimeline';
import { Sparkles, Play, Layers } from 'lucide-react';

export default function FutureEditor() {
  const [activeTool, setActiveTool] = useState<'edit' | 'magic' | 'layers'>('edit');

  return (
    <LiquidContainer className="flex flex-col">
      {/* Main Content Area */}
      <div className="flex-1 p-4 md:p-8 flex flex-col items-center justify-center relative">
         <div className="w-full h-full max-w-6xl max-h-[70vh] relative mb-24">
            <ObjectEditor mode={activeTool} />
         </div>

         {/* Floating Toolbar (positioned above timeline) */}
         <div className="absolute bottom-32 left-1/2 -translate-x-1/2 z-20">
            <LiquidToolbar>
            <LiquidButton
                isActive={activeTool === 'edit'}
                onClick={() => setActiveTool('edit')}
            >
                <span className="flex items-center gap-2"><Play size={16} /> Edit</span>
            </LiquidButton>
            <LiquidButton
                isActive={activeTool === 'magic'}
                onClick={() => setActiveTool('magic')}
            >
                <span className="flex items-center gap-2"><Sparkles size={16} /> Magic</span>
            </LiquidButton>
            <LiquidButton
                isActive={activeTool === 'layers'}
                onClick={() => setActiveTool('layers')}
            >
                <span className="flex items-center gap-2"><Layers size={16} /> Depth</span>
            </LiquidButton>
            </LiquidToolbar>
        </div>
      </div>

      {/* Semantic Timeline (Fixed at bottom) */}
      <div className="h-48 z-10">
        <SemanticTimeline />
      </div>

    </LiquidContainer>
  );
}
