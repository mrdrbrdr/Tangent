TLDR: LLM Service Architecture Proposal

Currently: Single `llm.js` with `getLLMResponseWithSummaries()`.

Proposal: Split LLM interactions into organized services:
1. `services/llm/`
   - `config.ts`: Shared OpenAI setup, types, utilities
   - `chat.ts`: Basic chat interactions (current getLLMResponseWithSummaries)
   - `summaries.ts`: Summary-specific operations (tangent summaries, branch summaries)
   - `tangents.ts`: Tangent operations (suggest topics, reintegrate tangents)
   - `index.ts`: Export all services

Key Benefits:
- Separation of concerns
- Better maintainability
- Easier testing
- Clear organization for different LLM use cases
- Shared configuration

Future Use Cases:
- Summarizing entire tangent branches
- Suggesting potential tangent topics
- Reintegrating tangent summaries into main thread
- Branch analysis and meta-summaries

Example new functions:
- generateTangentSummary(nodes[])
- suggestTangentTopics(currentNode)
- reintegrateTangent(summary, mainThread)
- generateBranchSummary(branchNodes[])