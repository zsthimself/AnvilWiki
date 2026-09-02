<!--
[INPUT]: 依赖已判定阶段、证据记录、决策与复审条件。
[OUTPUT]: 对外提供 Project、Current snapshot、Evidence、Completed gates、Blockers 与 Next actions 的逐区段合并合同；仅 Decision history 严格 append-only，并保留无关用户内容与授权边界。
[POS]: 生命周期持久化的合并边界，约束总控仅在授权写入时更新相关状态，而非替换整份文件。
[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
-->

# State Contract

Before any local state write, re-read the existing `requirements/anvil-site-state.md`, preserve unrelated or unknown user content, and merge the relevant sections instead of replacing the whole file. Create it only when an actual AnvilWiki repository exists, the user or task explicitly authorizes repository writes, and persistence is needed. External writes remain separately authorized.

```markdown
# AnvilWiki Site State

## Project
| Field | Value |
| --- | --- |
| Game | |
| Locale | |
| Repository | |
| Canonical domain | |

## Current snapshot
| Field | Value |
| --- | --- |
| Stage | S0-S8 |
| Decision | Go / Hold / No-Go |
| Confidence | High / Medium / Low |
| Observed at | YYYY-MM-DD |
| Review by | YYYY-MM-DD or event |

## Evidence
| Claim | Source | Source class | Observed at | Confidence | Recheck by |
| --- | --- | --- | --- | --- | --- |

## Completed gates
| Gate | Completed at | Evidence reference |
| --- | --- | --- |
| S0 | | |
| S1 | | |
| S2 | | |
| S3 | | |
| S4 | | |
| S5 | | |
| S6 | | |
| S7 | | |
| S8 | | |

## Blockers
-

## Next actions
1. [Owner] action
2. [Owner] action
3. [Owner] action

## Decision history
| Date | Stage | Decision | Evidence | Reason | Next review |
| --- | --- | --- | --- | --- | --- |
```

## Merge Rules

- **Project:** update only fields the task explicitly changes.
- **Current snapshot:** update the current stage, decision, confidence, observed date, and review date.
- **Evidence:** merge new or updated evidence by claim; keep still-relevant prior evidence, and mark or recheck expired evidence rather than silently deleting it.
- **Completed gates:** check a gate only when its evidence is satisfied. If a completed gate becomes invalid, explicitly uncheck it and record why in decision history.
- **Blockers:** remove resolved blockers, retain unresolved blockers, and append new blockers.
- **Next actions:** replace with the current <=3 actions.
- **Decision history:** this is the only strictly append-only section. Append a new record and never change an older record.

For advice-only work, report the proposed state change without writing this file.
