<!--
[INPUT]: 依赖仓库、状态快照与可验证的现场证据。
[OUTPUT]: 提供 S0-S8 的进入、放行、暂停与叶子路由边界。
[POS]: 生命周期阶段参考，不代替任何叶子 Skill 的执行契约。
[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
-->

# Stage Gates

Stages are recoverable and need not run in numeric order. Resume the active unmet gate. **Hold is not failure.** Use No-Go only when a recorded stop-loss condition triggers or first-party evidence directly negates a necessary premise. A No-Go output must cite that specific condition and evidence; otherwise Hold.

| Stage | Enter when | Go when | Hold when | Route |
| --- | --- | --- | --- | --- |
| S0 Context | Repo is absent or scope is unclear | Repository, game, locale, and user goal are known | Any of those are unknown | Bootstrap only |
| S1 Candidate facts | A game or niche is proposed | Candidate facts are sourced and separable from assumptions | Facts are unsupported or stale | Evidence policy |
| S2 Demand and competition | Opportunity is being considered | Two independent lanes support demand, intent, and competition | One lane is missing, duplicated, or conflicts | Evidence policy |
| S3 Build readiness | A repo and target are chosen | Target config builds successfully AND no Demo residue remains | Build fails, target config is unverified, or Demo residue remains | Repository work |
| S4 Content launch | Verified intents and quality gates exist | Intents and quality gates are met | Intents or quality gates are unverified | `anvil-new-article`, `anvil-batch-articles` |
| S5 Discoverability | Content is deployed | Live, canonical, sitemap, and GSC evidence agree | Any required live/discovery signal is missing | Deployment diagnosis |
| S6 Measurement | Live data is available | Real measurements support the next bounded test | Data is insufficient, stale, or ambiguous | Evidence policy |
| S7 Monetization | Monetization is under consideration | Current policy, experience, and authorization support the path | Policy, experience, or authorization is missing | `anvil-adsense-audit` |
| S8 Maintenance | Site is operating | Required updates, a dated review, and a feedback-to-template loop are recorded | Any required update, dated review, or feedback-to-template loop is absent | `anvil-refresh`, `anvil-update-codes` |
