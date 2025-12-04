// Prompt Templates System - Complete Implementation

export interface PromptTemplate {
    version: string;
    systemPrompt: string;
    userPrompt: (data: any) => string;
}

export const PROMPT_TEMPLATES: Record<string, PromptTemplate> = {
    freelancerAnalysis: {
        version: 'v2.0',
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
        userPrompt: (data: any) => `
Analyze this freelancer:
Name: ${data.name}
Projects Completed: ${data.projectCount}
Average Rating: ${data.avgRating}/5
Skills: ${data.skills.join(', ')}
Recent Work: ${data.recentProjects.map((p: any) => p.title).join(', ')}
`
    },

    projectProfitability: {
        version: 'v2.0',
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
        userPrompt: (data: any) => `
Analyze this project:
Title: ${data.title}
Budget: $${data.budget}
Total Cost: $${data.totalCost}
Profit: $${data.profit}
Team: ${data.assignments.map((a: any) => `${a.freelancer.name} (${a.role})`).join(', ')}
`
    },

    chat: {
        version: 'v3.0',
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
        userPrompt: (context: string) => context
    }
};

// Helper to get prompt with versioning support
export function getPrompt(templateName: string, version?: string): PromptTemplate {
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
