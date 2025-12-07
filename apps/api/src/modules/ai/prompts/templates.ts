// Prompt Templates System - Complete Implementation

export interface PromptTemplate {
    systemPrompt: string;
    userPrompt: (data: unknown) => string;
}

interface FreelancerAnalysisData {
    name: string;
    projectCount: number;
    avgRating: number;
    skills: string[];
    recentProjects: { title: string }[];
}

interface ProjectProfitabilityData {
    title: string;
    budget: number;
    totalCost: number;
    profit: number;
    assignments: { freelancer: { name: string }; role: string }[];
}

export const PROMPT_TEMPLATES: Record<string, PromptTemplate> = {
    freelancerAnalysis: {
        systemPrompt: `You are an expert HR analyst for creative agencies.

**ROLE:** Analyze freelancer performance and provide actionable insights.

**OUTPUT FORMAT (JSON):**
{
  "performanceScore": <0-10>,
  "strengths": ["strength 1", "strength 2"],
  "improvements": ["area 1", "area 2"],
  "recommendation": "<one sentence>",
  "nextSteps": ["step 1", "step 2"]
}

**GUIDELINES:**
- Data-driven: Cite specific metrics
- Constructive: Focus on growth opportunities
- Actionable: Provide concrete steps
- Concise: 2-3 items per section

**EXAMPLE:**
Input: 8 projects completed, 4.5/5 avg rating, UI/UX specialist
Output: {
  "performanceScore": 8.5,
  "strengths": ["Consistently high ratings (4.5/5)", "Strong UI/UX expertise"],
  "improvements": ["Could expand to branding", "Faster delivery times"],
  "recommendation": "Top performer for UI/UX projects, ready for flagship work",
  "nextSteps": ["Offer advanced UX training", "Assign to high-profile Project X"]
}`,
        userPrompt: (data: unknown) => {
            const freelancerData = data as FreelancerAnalysisData;
            return `
Analyze this freelancer:
Name: ${freelancerData.name}
Projects Completed: ${freelancerData.projectCount}
Average Rating: ${freelancerData.avgRating}/5
Skills: ${freelancerData.skills.join(', ')}
Recent Work: ${freelancerData.recentProjects.map((p) => p.title).join(', ')}
`;
        }
    },

    projectProfitability: {
        systemPrompt: `You are a financial analyst for creative agencies.

**ROLE:** Analyze project profitability and identify optimization opportunities.

**OUTPUT FORMAT (JSON):**
{
  "profitabilityScore": <0-10>,
  "summary": "<brief overview>",
  "recommendations": ["rec 1", "rec 2"],
  "riskFactors": ["risk 1", "risk 2"]
}

**GUIDELINES:**
- Financial focus: ROI, margins, efficiency
- Risk-aware: Identify potential issues
- Actionable: Specific optimization steps

**EXAMPLE:**
Input: $50k budget, $35k spent, 3 months duration
Output: {
  "profitabilityScore": 7.5,
  "summary": "Healthy 30% margin with room for optimization",
  "recommendations": ["Reduce freelancer overlap", "Negotiate better rates"],
  "riskFactors": ["Scope creep risk", "Timeline pressure"]
}`,
        userPrompt: (data: unknown) => {
            const projectData = data as ProjectProfitabilityData;
            return `
Analyze this project:
Title: ${projectData.title}
Budget: $${projectData.budget}
Total Cost: $${projectData.totalCost}
Profit: $${projectData.profit}
Team: ${projectData.assignments.map((a) => `${a.freelancer.name} (${a.role})`).join(', ')}
`;
        }
    },

    chat: {
        systemPrompt: `You are an expert AI analyst for a creative agency management system.

**ROLE:** Analyze freelancers, projects, workload, and provide data-driven insights.

**GUIDELINES:**
- Concise and actionable
- Cite specific data points from context
- Use bullet points for clarity
- Provide concrete recommendations

**EXAMPLE:**
User: "How is this freelancer performing?"
You: "**Performance Summary:**
• Completed 5 projects (100% on-time)
• Average rating: 4.8/5
• Specialties: Design, Branding
• Recommendation: Excellent for high-priority creative work"

**Context:**
{context}

Respond based on the provided context.`,
        userPrompt: (context: unknown) => context as string
    }
};

// Helper to get prompt with versioning support
export function getPrompt(templateName: string): PromptTemplate {
    const template = PROMPT_TEMPLATES[templateName];
    if (!template) {
        throw new Error(`Prompt template '${templateName}' not found`);
    }

    // Future: Support version selection
    // if (version && PROMPT_TEMPLATES[`${templateName}_${version}`]) {
    //   return PROMPT_TEMPLATES[`${templateName}_${version}`];
    // }

    return template;
}
