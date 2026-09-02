---
name: anvil-site-operator
description: Use when working in or preparing an AnvilWiki repository and the user asks which game to target, whether to launch or stop, what stage the site is in, what to do next, how to diagnose post-launch data, when to monetize, or how to operate the site across its lifecycle. Do not use for non-AnvilWiki sites, generic game development, or a single article, codes, refresh, or AdSense task already covered by an AnvilWiki leaf skill.
---
<!--
[INPUT]: 依赖 AnvilWiki 仓库信号、用户提供的业务事实与按需 references。
[OUTPUT]: 提供阶段判定、单一 Go/Hold/No-Go 决策、受限行动与状态变更说明。
[POS]: AnvilWiki 生命周期总控入口；先路由叶子 Skill，再处理跨阶段经营决策。
[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
-->

# AnvilWiki Site Operator

## Core Principle

**Evidence opens a gate; urgency never does.** Treat supplied claims as claims until verified. A Hold is an explicit decision, not a failure.

## First Route The Request

Before any S0-S8 analysis, decide whether the request is one leaf task. Before claiming a leaf is loaded or routed, confirm that it is discoverable in the available skill catalog or at `.agent/skills/<name>/SKILL.md` or `.agents/skills/<name>/SKILL.md` in the repository. Only then fully load and directly execute the named leaf skill.

| Single request | Required route |
| --- | --- |
| One guide or article | `anvil-new-article` |
| Keyword-list batch | `anvil-batch-articles` |
| Codes | `anvil-update-codes` |
| Freshness or stale content | `anvil-refresh` |
| AdSense readiness or integration | `anvil-adsense-audit` |

If the required leaf is missing, name that leaf and its expected path, then stop that leaf task. Do not simulate its schema or output, falsely claim it was invoked, or expand a lifecycle report. When a route matches, do not draft the article, invent article sections, or substitute a generic workflow. A mixed request may use this skill for its cross-stage decision and route each leaf deliverable separately.

## Confirm AnvilWiki

Confirm from a combination of repository signals: package scripts, `.agent/skills`, `src/config`, `requirements`, and `docs/PRD`. An Astro repository alone is not AnvilWiki.

If the user is only preparing to use AnvilWiki and no repository is available, enter S0 bootstrap. Say that the repository is not yet identified; do not pretend it was inspected.

## Recover Before Diagnosing

1. Read `requirements/anvil-site-state.md` when it exists.
2. Combine its current snapshot with repository and live-data evidence to identify the current stage.
3. Resume from the current gate. Do not replay S0 or any passed gate merely because the lifecycle begins there.

Load references only when needed:

| Need | Load |
| --- | --- |
| Stage entry, Go, Hold, No-Go, or routing | `references/stage-gates.md` |
| S1, S2, S6, S7, or any volatile fact | `references/evidence-policy.md` |
| Creating or updating site state | `references/state-contract.md` |

## Decision Loop

Observe facts -> verify their source and freshness -> make **exactly one** of **Go**, **Hold**, or **No-Go** -> give <=3 prioritized actions -> set a dated review or stop condition. Persist an append-only decision record only when the user requests it or the task explicitly authorizes repository writes. For read-only or advice-only work, state the exact **proposed** state change and do not create or update a file.

- **Go:** the active gate's evidence is sufficient.
- **Hold:** evidence is missing, stale, weak, or conflicting.
- **No-Go:** explicit counter-evidence or a defined stop-loss rejects the path.

Do not turn creator statements, tutorials, heuristics, or urgency into verification. Do not recommend a domain, spend, launch, ranking, traffic, or revenue outcome before the relevant evidence opens its gate.

## Permission Boundary

Read-only inspection is allowed. Require explicit authorization before repository state writes, paid research or purchases, public publishing, ad submission, account actions, tax or payout configuration, or another irreversible operation. Evidence can recommend a next authorized action; it cannot grant permission.

## Output Contract

For lifecycle work, provide:

1. **Current stage and basis**
2. **Evidence table:** source, observed date, confidence
3. **One decision:** Go, Hold, or No-Go
4. **Next actions:** <=3, prioritized, each with an owner
5. **Stop or review condition:** dated and observable
6. **Exact state change:** what is proposed for `requirements/anvil-site-state.md`, or what was updated only under explicit write authorization

Single leaf tasks use their leaf skill's output contract instead.

## Common Mistakes

- Filling evidence gaps with search volume, trends, SERP difficulty, domain availability, revenue, RPM, rankings, or policy claims.
- Treating tutorial heuristics as law instead of a testable assumption.
- Restarting every stage instead of recovering the active one.
- Copying a leaf skill's article or audit schema into this controller.
- Rewriting old decision history instead of appending it.
- Using urgency to bypass a gate, or promising rankings, traffic, or earnings.

## Reference Index

- `references/stage-gates.md`: S0-S8 gates and routes.
- `references/evidence-policy.md`: evidence quality, freshness, and conflict handling.
- `references/state-contract.md`: persistent site-state template and append-only rules.
