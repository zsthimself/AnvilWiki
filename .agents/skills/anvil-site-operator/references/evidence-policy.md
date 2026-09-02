<!--
[INPUT]: 依赖用户资料、仓库数据、平台数据与可追溯外部来源。
[OUTPUT]: 提供证据记录格式、可信度与冲突处理规则。
[POS]: 生命周期决策的事实边界；缺证据时约束总控进入 Hold。
[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
-->

# Evidence Policy

Record each decision-critical claim before relying on it:

| Claim | Source | Source class | Observed at | Confidence | Recheck by |
| --- | --- | --- | --- | --- | --- |
| What is asserted | URL, file, or dataset | See source order | YYYY-MM-DD | High/Medium/Low | YYYY-MM-DD or event |

Prefer sources in this order: first-party -> direct platform -> independent secondary -> community lead. Community information is a lead, not proof.

- **High:** current primary/direct evidence that supports the exact claim.
- **Medium:** two independent sources support the same inference, with limits stated.
- **Low:** a community lead, unverified statement, stale evidence, or unresolved conflict.
- S2 may Go only with two independent evidence lanes for demand, intent, and competition. Copied or syndicated claims from one origin count once.
- Never invent search volume, trend, SERP conditions, domain availability, revenue, RPM, ranking, or policy facts. Recheck volatile claims at decision time.
- Tutorial numbers and heuristics are hypotheses, never legal, platform, market, or outcome facts.
- For conflicting sources, prefer the primary source and lower confidence until the conflict is resolved.
- Missing decision-critical data means Hold.
