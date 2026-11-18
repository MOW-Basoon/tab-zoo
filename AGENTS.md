# Collaboration instructions

Read this file and `docs/decisions.md` before working. `CLAUDE.md` points to the same rules. Preserve other contributors' work, review the current branch and open PRs, and keep changes focused. Do not change the UI or product behavior without an instruction or an established decision.

Record significant product, security, privacy, architecture and release choices in `docs/decisions.md`. Use a dated level-two heading, status, the choice and its rationale. Each entry must include these five lines (CI checks the format):

    - Proposed by: unknown
    - Decided by: unknown
    - Approved by: unknown
    - Implemented by: unknown
    - Basis: Describe the evidence for the roles and its scope.

Use the agreed public aliases `DS` and `basoon` followed by the actor in parentheses, e.g. `DS (human)`, `DS (Claude)`, `basoon (human)` or `basoon (Codex)`. Either contributor may use either assistant. Use comma-separated actors for a joint role. Record who proposed the idea, chose the approach, approved it, and carried it out separately. Use `unknown` for missing evidence and `pending` for a step still open. Only name a human under approval when evidence supports approval of that particular choice.

Tab Zoo's core concept belongs to its original creator, `DS (human)`. According to `basoon`, the creator's Claude handled most initial implementation. This evidence applies to the original version as a whole. For each finer choice, look for specific evidence. Never assign a person or assistant by default, by elimination, or based on who owns a repo, uses a tool, filed a PR or merged it. Identify secondhand accounts as such. Use these same distinctions in summaries. Preserve older decisions and link corrections. Routine edits need no decision entry. Use only agreed public aliases in attribution and paraphrase confirmations. Omit real names and private personal context.

When you discover an existing product decision missing from the log, record the specific choice and its source yourself. For a retrospective, cite the version that already contained the behavior. When asked what the creator decided, include the original product decisions alongside subsequent changes. In each PR body, include one line beginning with `Decision record: ` followed by the relevant full dated heading, or `Routine change: ` followed by a rationale when no significant decision was made. The PR check validates this declaration. Reviewers verify the actual evidence and role assignments.

Before shipping, review permissions and privacy effects, run relevant tests, and distinguish completed checks from assumptions. Do not publish secrets, sensitive vulnerability details, or private conversations. For an uncertain or sensitive security issue, use a private channel agreed with the owner. Do not change repository settings or release without the appropriate authorization.
