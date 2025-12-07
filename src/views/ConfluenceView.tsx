import { BookOpen } from "lucide-react";
import React, { useState } from "react";
import { ConfluenceAuthProvider } from "../../components/confluence/ConfluenceAuthProvider";
import EmbeddedConfluencePage from "../../components/confluence/EmbeddedConfluencePage";
import { ConfluencePageConfig } from "../../types/confluence.types";

/**
 * Confluence Knowledge Base View
 * Displays embedded Confluence pages with authentication
 */
const ConfluenceView: React.FC = () => {
  // Confluence configuration from environment variables
  const [pageConfig] = useState<ConfluencePageConfig>({
    pageUrl: "https://studiodot.atlassian.net/wiki/home",
    siteUrl: "https://studiodot.atlassian.net",
  });

  return (
    <ConfluenceAuthProvider siteUrl={pageConfig.siteUrl}>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="px-12 pt-12 pb-6 border-b border-border-subtle">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <BookOpen size={24} className="text-white" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-ink-primary">
                Knowledge Base
              </h1>
              <p className="text-sm text-ink-secondary">
                Team documentation and resources
              </p>
            </div>
          </div>
        </div>

        {/* Embedded Confluence Page */}
        <div className="flex-1 px-12 py-8 overflow-hidden">
          <EmbeddedConfluencePage
            config={pageConfig}
            height="100%"
            onLoad={() => console.log("Confluence page loaded")}
            onError={(error) => console.error("Confluence error:", error)}
            className="h-full"
          />
        </div>

        {/* Footer Helper */}
        <div className="px-12 py-4 border-t border-border-subtle bg-subtle/50">
          <div className="flex items-center justify-between text-xs text-ink-tertiary">
            <div className="flex items-center gap-4">
              <span>📖 Powered by Atlassian Confluence</span>
              <span className="text-border-subtle">•</span>
              <a
                href={pageConfig.siteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-ink-secondary transition-colors"
              >
                View in Confluence →
              </a>
            </div>
            <div className="text-ink-tertiary/60">
              Studio OS v3.0 • Knowledge Integration
            </div>
          </div>
        </div>
      </div>
    </ConfluenceAuthProvider>
  );
};

export default ConfluenceView;
