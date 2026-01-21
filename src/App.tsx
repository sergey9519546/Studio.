import CommandBar from "./components/layout/CommandBar";
import Sidebar from "./components/layout/Sidebar";
import { StudioProvider } from "./context/StudioContext";
import { AppRoutes } from "./routing/routes";

// Layout Component
function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="app-main">{children}</div>
      <CommandBar />
    </div>
  );
}

// Main App Component with Router
export default function App() {
  return (
    <StudioProvider>
      <Layout>
        <AppRoutes />
      </Layout>
    </StudioProvider>
  );
}
