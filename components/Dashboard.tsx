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

  useEffect(() => {
    let didCancel = false;

    const loadMetrics = async () => {
      setLoading(true);
      setError(null);

      if (!api.projects?.list || !api.freelancers?.list || !api.assignments?.list) {
        setError("Error loading dashboard");
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
          setError("Error loading dashboard");
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

  const statCards = [
    {
      id: "projects",
      label: "Projects",
      value: counts.projects,
      hint: "Active campaigns",
    },
    {
      id: "freelancers",
      label: "Freelancers",
      value: counts.freelancers,
      hint: "Available talent",
    },
    {
      id: "assignments",
      label: "Active assignments",
      value: counts.assignments,
      hint: "Allocated shifts",
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
        <div className="flex gap-3 text-xs uppercase tracking-wider">
          <Link
            to="/projects"
            className="text-ink-primary hover:text-primary transition-colors"
          >
            View all projects
          </Link>
          <Link
            to="/freelancers"
            className="text-ink-primary hover:text-primary transition-colors"
          >
            View all freelancers
          </Link>
        </div>
      </header>

      {loading && (
        <div className="rounded-2xl border border-border-subtle bg-surface/80 px-6 py-4 text-sm text-ink-secondary">
          Loading dashboard...
        </div>
      )}

      {!loading && error && (
        <div className="rounded-2xl border border-state-danger/30 bg-state-danger/10 px-6 py-4 text-sm font-semibold text-state-danger">
          Error loading dashboard
        </div>
      )}

      {!loading && !error && (
        <>
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {statCards.map((card) => (
            <article
              key={card.id}
              className="bg-surface border border-border-subtle rounded-2xl shadow-card p-6 space-y-2"
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-ink-tertiary">
                {card.hint}
              </p>
              <h2 className="text-4xl font-bold text-ink-primary">
                {card.value.toLocaleString()}
              </h2>
              <p className="text-sm text-ink-secondary">{card.label}</p>
              <span className="sr-only">
                {`${card.value.toLocaleString()} ${card.label}`}
              </span>
            </article>
          ))}
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
            <article className="bg-surface border border-border-subtle rounded-2xl shadow-card p-6 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-ink-primary">
                  Recent activity
                </h3>
                <Link
                  to="/projects"
                  className="text-xs uppercase tracking-[0.4em] text-ink-secondary hover:text-ink-primary"
                >
                  View all projects
                </Link>
              </div>
              <div className="space-y-3 text-sm text-ink-secondary">
                {recentActivity.length > 0 ? (
                  recentActivity.map((entry, index) => (
                    <p key={index} className="text-ink-primary">
                      {entry}
                    </p>
                  ))
                ) : (
                  <p className="text-ink-tertiary">No recent activity yet.</p>
                )}
              </div>
            </article>
            <article className="bg-surface border border-border-subtle rounded-2xl shadow-card p-6 space-y-4">
              <h3 className="text-lg font-bold text-ink-primary">Quick actions</h3>
              <div className="space-y-3">
                <button className="w-full rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-white hover:bg-primary-hover transition-colors">
                  New Project
                </button>
                <button className="w-full rounded-2xl border border-border-subtle px-4 py-3 text-sm font-semibold text-ink-secondary hover:border-ink-primary hover:text-ink-primary transition-colors">
                  Import Data
                </button>
              </div>
            </article>
          </section>
        </>
      )}
    </main>
  );
};

export default Dashboard;
