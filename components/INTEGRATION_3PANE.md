/**
 * Optional: 3-Pane Studio Route
 * Add this to App.tsx for the full split-pane experience
 */

// In App.tsx imports:
import CSSSplitStudio from './components/CSSSplitStudio';

// Add this route alongside the existing studio route:
<Route 
  path="studio-pro" 
  element={
    <CSSSplitStudio
      projects={projects}
      selectedProjectId={selectedProjectId}
      onSelectProject={setSelectedProjectId}
      scriptContent={scriptContent}
      onContentChange={setScriptContent}
      onSave={handleSave}
      onEnhance={handleEnhance}
    />
  } 
/>

// Note: You'll need to add these state variables at the top of App component:
const [selectedProjectId, setSelectedProjectId] = useState<string | undefined>();
const [scriptContent, setScriptContent] = useState('');

const handleSave = async () => {
  if (!selectedProjectId) return;
  try {
    const script = await api.scripts.create({
      projectId: selectedProjectId,
      content: scriptContent
    });
    toast.success('Script saved!');
  } catch (error) {
    toast.error('Failed to save script');
  }
};

const handleEnhance = async (content: string): Promise<string> => {
  try {
    const response = await api.ai.chat({
      message: `Refine and structure this creative writing. Use markdown headers and bullet points. Content: ${content}`
    });
    return response.data?.response || content;
  } catch (error) {
    console.error('Enhancement failed:', error);
    return content;
  }
};
