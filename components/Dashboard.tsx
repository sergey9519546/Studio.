import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [counts, setCounts] = useState({
    projects: 0,
    freelancers: 0,
    assignments: 0,
  });
  const [recentActivity, setRecentActivity] = useState<string[]>([]);
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [isImportingData, setIsImportingData] = useState(false);

  useEffect(() => {
    let didCancel = false;

    const loadMetrics = async () => {
      setLoading(true);
      setError(null);

      if (!api.projects?.list || !api.freelancers?.list || !api.assignments?.list) {
        setError("Error loading dashboard data. Some API endpoints may be unavailable.");
        setLoading(false);
        return;
      }

      try {
        const [projectsRes, freelancersRes, assignmentsRes] = await Promise.all([
          api.projects.list({ page: 1, limit: 10 }),
          api.freelancers.list(),
          api.assignments.list(),
        ]);

        if (didCancel) {
          return;
        }

        const projectCount =
          projectsRes.meta?.total ?? projectsRes.data?.length ?? 0;
        const freelancerCount = freelancersRes.data?.length ?? 0;
        const assignmentCount = assignmentsRes.data?.length ?? 0;

        setCounts({
          projects: projectCount,
          freelancers: freelancerCount,
          assignments: assignmentCount,
        });

        const activityEntries =
          assignmentsRes.data
            ?.slice(0, 3)
            .map((assignment) => {
              const freelancerLabel = assignment.freelancerId
                ? `Freelancer ${assignment.freelancerId}`
                : "A freelancer";
              const projectLabel = assignment.projectId
                ? `Project ${assignment.projectId}`
                : "a project";
              return `Assigned ${freelancerLabel} to ${projectLabel}`;
            }) ?? [];
        setRecentActivity(activityEntries);
      } catch (e) {
        console.error("Failed to load dashboard metrics:", e);
        if (!didCancel) {
          setError("Unable to load dashboard data. Please try refreshing the page.");
        }
      } finally {
        if (!didCancel) {
          setLoading(false);
        }
      }
    };

    loadMetrics();
    return () => {
      didCancel = true;
    };
  }, []);

  const handleNewProject = async () => {
    setIsCreatingProject(true);
    try {
      // Simulate API call for new project creation
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("Creating new project...");
      // TODO: Implement actual project creation logic
    } catch (error) {
      console.error("Failed to create project:", error);
    } finally {
      setIsCreatingProject(false);
    }
  };

  const handleImportData = async () => {
    setIsImportingData(true);
    try {
      // Simulate API call for data import
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log("Importing data...");
      // TODO: Implement actual data import logic
    } catch (error) {
      console.error("Failed to import data:", error);
    } finally {
      setIsImportingData(false);
    }
  };

  const statCards = [
    {
      id: "projects",
      label: "Projects",
      value: counts.projects,
      hint: "Active campaigns",
      description: `${counts.projects} active creative projects`,
    },
    {
      id: "freelancers",
      label: "Freelancers",
      value: counts.freelancers,
      hint: "Available talent",
      description: `${counts.freelancers} registered freelancers`,
    },
    {
      id: "assignments",
      label: "Active assignments",
      value: counts.assignments,
      hint: "Allocated shifts",
      description: `${counts.assignments} current project assignments`,
    },
  ];

  return (
    <main className="p-8 max-w-[1600px] mx-auto space-y-8 font-sans text-ink-primary">
      <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-display font-semibold tracking-tight">
            Dashboard
          </h1>
          <p className="text-sm text-ink-secondary">
            Studio intelligence and creative operations overview.
          </p>
        </div>
        <nav aria-label="Quick navigation">
          <div className="flex gap-3 text-xs uppercase tracking-wider">
            <Link
              to="/projects"
              className="text-ink-primary hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded px-2 py-1"
              aria-label="Navigate to all projects view"
            >
              View all projects
            </Link>
            <Link
              to="/freelancers"
              className="text-ink-primary hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded px-2 py-1"
              aria-label="Navigate to all freelancers view"
            >
              View all freelancers
            </Link>
          </div>
        </nav>
      </header>

      {loading && (
        <div 
          className="rounded-2xl border border-border-subtle bg-surface/80 px-6 py-4 text-sm text-ink-secondary"
          role="status"
          aria-live="polite"
          aria-label="Loading dashboard content"
        >
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent"></div>
            Loading dashboard...
          </div>
        </div>
      )}

      {!loading && error && (
        <div 
          className="rounded-2xl border border-state-danger/30 bg-state-danger/10 px-6 py-4 text-sm font-semibold text-state-danger"
          role="alert"
          aria-live="assertive"
        >
          <div className="flex items-start gap-3">
            <div className="text-lg" aria-hidden="true">⚠️</div>
            <div>
              <p className="font-semibold">Error loading dashboard</p>
              <p className="text-sm font-normal mt-1">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-2 text-sm underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 rounded"
              >
                Retry loading
              </button>
            </div>
          </div>
        </div>
      )}

      {!loading && !error && (
        <>
          <section aria-labelledby="stats-heading">
            <h2 id="stats-heading" className="sr-only">Dashboard statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {statCards.map((card) => (
                <article
                  key={card.id}
                  className="bg-surface border border-border-subtle rounded-2xl shadow-card p-6 space-y-2 hover:shadow-lg hover:border-primary/20 transition-all duration-200 focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 focus-within:ring-offset-surface"
                >
                  <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-ink-tertiary">
                    {card.hint}
                  </p>
                  <h2 
                    className="text-4xl font-bold text-ink-primary"
                    aria-describedby={`${card.id}-description`}
                  >
                    {counts[card.id as keyof typeof counts].toLocaleString()}
                  </h2>
                  <p className="text-sm text-ink-secondary">{card.label}</p>
                  <span 
                    id={`${card.id}-description`}
                    className="sr-only"
                  >
                    {card.description}
                  </span>
                </article>
              ))}
            </div>
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
            <article className="bg-surface border border-border-subtle rounded-2xl shadow-card p-6 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-ink-primary">Recent activity</h3>
                <Link
                  to="/projects"
                  className="text-xs uppercase tracking-[0.4em] text-ink-secondary hover:text-ink-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 rounded px-2 py-1"
                  aria-label="View all projects and activity"
                >
                  View all projects
                </Link>
              </div>
              <div 
                className="space-y-3 text-sm text-ink-secondary"
                role="list"
                aria-label="Recent activity feed"
              >
                {recentActivity.length > 0 ? (
                  recentActivity.map((entry, index) => (
                    <p 
                      key={index} 
                      className="text-ink-primary p-3 rounded-lg hover:bg-subtle/50 transition-colors"
                      role="listitem"
                    >
                      {entry}
                    </p>
                  ))
                ) : (
                  <p className="text-ink-tertiary italic">No recent activity yet.</p>
                )}
              </div>
            </article>
            
            <article className="bg-surface border border-border-subtle rounded-2xl shadow-card p-6 space-y-4">
              <h3 className="text-lg font-bold text-ink-primary">Quick actions</h3>
              <div className="space-y-3">
                <button 
                  onClick={handleNewProject}
                  disabled={isCreatingProject}
                  className="w-full rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-white hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 active:scale-[0.98]"
                  aria-describedby="new-project-hint"
                  aria-label={isCreatingProject ? "Creating new project, please wait" : "Create a new project"}
                >
                  {isCreatingProject ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Creating Project...
                    </span>
                  ) : (
                    'New Project'
                  )}
                </button>
                <span id="new-project-hint" className="sr-only">
                  Start a new creative project
                </span>
                
                <button 
                  onClick={handleImportData}
                  disabled={isImportingData}
                  className="w-full rounded-2xl border border-border-subtle px-4 py-3 text-sm font-semibold text-ink-secondary hover:border-ink-primary hover:text-ink-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 active:scale-[0.98]"
                  aria-describedby="import-data-hint"
                  aria-label={isImportingData ? "Importing data, please wait" : "Import data from external sources"}
                >
                  {isImportingData ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-ink-secondary border-t-transparent"></div>
                      Importing...
                    </span>
                  ) : (
                    'Import Data'
                  )}
                </button>
                <span id="import-data-hint" className="sr-only">
                  Import project data from external sources or files
                </span>
              </div>
            </article>
          </section>
        </>
      )}
    </main>
  );
};

export default Dashboard;
