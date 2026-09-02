<!--
[INPUT]: 依赖已批准的集成设计、AnvilWiki v2.7.0 五个叶子 Skill、外部总控运行时源文件与 Vitest
[OUTPUT]: 提供仓库级 anvil-site-operator 的 TDD 实施步骤、精确文件内容、提交和验收命令
[POS]: docs/superpowers/plans 的执行真相源，供 executing-plans 按检查点实现
[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
-->

# AnvilWiki Site Operator Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将已验证的 `anvil-site-operator` 作为仓库级 Codex Skill 接入 AnvilWiki，并用 Vitest 固定它与五个上游叶子 Skill 的路由和失败边界。

**Architecture:** fork 自有总控位于 `.agents/skills/anvil-site-operator/`，上游叶子继续留在 `.agent/skills/`，两个目录不复制同名叶子文件。测试读取真实 Markdown 与 YAML frontmatter，验证总控、references、五个路由及缺失叶子停止语义；GEB L1/L2/L3 与新增结构同一提交更新。

**Tech Stack:** Markdown Agent Skills + Vitest 4 + Node.js 22 `fs/path/url` + pnpm 11 + GEB CLAUDE.md maps

---

## Preconditions

- Worktree: `E:\AnvilWiki\.worktrees\anvil-site-operator-integration`
- Branch: `codex/anvil-site-operator-integration`
- Baseline commit: `ca3e5c4`
- Baseline verification: 11 Vitest files and 114 tests pass.
- On this Windows host, prepend `C:\Users\Administrator\.codex\tmp\anvil-corepack-bin` to `PATH` and invoke `pnpm.CMD`; this avoids the PowerShell execution-policy block on `pnpm.ps1` while preserving pnpm 11.1.1.
- Approved design: `docs/superpowers/specs/2026-09-02-anvil-site-operator-integration-design.md`

## File Map

- Create `tests/agent-skills.test.ts`: cross-directory runtime and routing contract.
- Create `tests/CLAUDE.md`: complete test-module map including the new contract.
- Create `.agents/CLAUDE.md`: fork-owned Agent extension boundary.
- Create `.agents/skills/CLAUDE.md`: repository Skill member map.
- Create `.agents/skills/anvil-site-operator/SKILL.md`: lifecycle controller entrypoint.
- Create `.agents/skills/anvil-site-operator/CLAUDE.md`: runtime-only controller map; deliberately excludes evals.
- Create `.agents/skills/anvil-site-operator/references/{stage-gates,evidence-policy,state-contract}.md`: on-demand decision contracts.
- Create `.agents/skills/anvil-site-operator/references/CLAUDE.md`: reference member map.
- Modify `CLAUDE.md`: register `.agents/` as a top-level module.

### Task 1: Add the failing repository Skill contract

**Files:**
- Create: `tests/agent-skills.test.ts`
- Create: `tests/CLAUDE.md`

- [ ] **Step 1: Add the complete failing Vitest contract**

Create `tests/agent-skills.test.ts` with exactly this content:

```typescript
/**
 * [INPUT]: 依赖仓库内 .agents 总控 Skill、.agent 五个叶子 Skill 与 Node.js fs/path/url
 * [OUTPUT]: 对外提供总控安装、叶子路由、reference 完整性和缺失叶子停止语义的 Vitest 契约
 * [POS]: tests 的 Agent Skills 跨目录回归门，防止上游改名或 fork 漏文件造成静默路由退化
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, test } from 'vitest';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const operatorSegments = ['.agents', 'skills', 'anvil-site-operator', 'SKILL.md'];
const leafRoutes = [
  ['One guide or article', 'anvil-new-article'],
  ['Keyword-list batch', 'anvil-batch-articles'],
  ['Codes', 'anvil-update-codes'],
  ['Freshness or stale content', 'anvil-refresh'],
  ['AdSense readiness or integration', 'anvil-adsense-audit'],
] as const;
const references = ['stage-gates.md', 'evidence-policy.md', 'state-contract.md'] as const;

const repoPath = (...segments: string[]): string => join(root, ...segments);
const readRepoFile = (...segments: string[]): string => readFileSync(repoPath(...segments), 'utf8');
const frontmatterName = (source: string): string | undefined => {
  const frontmatter = source.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/)?.[1];
  return frontmatter?.match(/^name:\s*([^\r\n]+)$/m)?.[1]?.trim();
};

describe('repository Agent Skills contract', () => {
  test('installs the lifecycle operator with the expected frontmatter name', () => {
    const operatorPath = repoPath(...operatorSegments);
    expect(existsSync(operatorPath)).toBe(true);
    expect(frontmatterName(readRepoFile(...operatorSegments))).toBe('anvil-site-operator');
  });

  test.each(leafRoutes)('routes %s to %s with a matching leaf skill', (request, skill) => {
    const operator = readRepoFile(...operatorSegments);
    const leafSegments = ['.agent', 'skills', skill, 'SKILL.md'];
    expect(operator).toContain(`| ${request} | \`${skill}\` |`);
    expect(existsSync(repoPath(...leafSegments))).toBe(true);
    expect(frontmatterName(readRepoFile(...leafSegments))).toBe(skill);
  });

  test('ships every reference named by the lifecycle operator', () => {
    const operator = readRepoFile(...operatorSegments);

    for (const reference of references) {
      expect(operator).toContain(`references/${reference}`);
      expect(
        existsSync(repoPath('.agents', 'skills', 'anvil-site-operator', 'references', reference)),
      ).toBe(true);
    }
  });

  test('stops a missing leaf task instead of simulating or expanding it', () => {
    const operator = readRepoFile(...operatorSegments);
    expect(operator).toContain('If the required leaf is missing');
    expect(operator).toContain('then stop that leaf task');
    expect(operator).toContain('Do not simulate its schema or output');
    expect(operator).toContain('or expand a lifecycle report');
  });
});
```

- [ ] **Step 2: Add the complete tests module map**

Create `tests/CLAUDE.md`:

```markdown
# /tests

> L2 | 父级: ../CLAUDE.md
> 成员清单
> affiliates.test.ts: 联盟建议配置与默认关闭契约。
> agent-skills.test.ts: 总控 Skill、五个叶子路由、references 和停止语义契约。
> apply-template.test.ts: 模板初始化重写、保留与重跑幂等契约。
> content-utils.test.ts: 内容选择、相关文章与集合纯函数契约。
> covers.test.ts: 封面生成尺寸、字体和缓存契约。
> handbook.test.ts: 中英手册结构、章节与导航一致性契约。
> i18n-smoke.test.ts: locale JSON 基础键和跨语言覆盖契约。
> prompt.test.ts: LinePrompt 队列、EOF 和三个交互 CLI 接线契约。
> seo.test.ts: canonical、hreflang、sitemap 与 noindex SEO 契约。
> tags.test.ts: 标签聚合、slug 与跨文章词汇契约。
> url.test.ts: trailing slash、本地化路径和 URL 归一化契约。
> workflows.test.ts: GitHub Actions 八道门、权限和 SHA 固定契约。
> [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
```

- [ ] **Step 3: Run the targeted test and verify RED**

```powershell
$env:PATH = 'C:\Users\Administrator\.codex\tmp\anvil-corepack-bin;' + $env:PATH
& 'C:\Users\Administrator\.codex\tmp\anvil-corepack-bin\pnpm.CMD' exec vitest run tests/agent-skills.test.ts
```

Expected: FAIL. The first failing assertion reports `expected false to be true` for `.agents/skills/anvil-site-operator/SKILL.md`; later tests may report `ENOENT` for the same missing file. A syntax error, missing Vitest dependency, or failure under `.agent/skills` is not the intended RED and must be fixed before proceeding.

### Task 2: Vendor the minimal controller runtime and GEB maps

**Files:**
- Create: `.agents/CLAUDE.md`
- Create: `.agents/skills/CLAUDE.md`
- Create: `.agents/skills/anvil-site-operator/CLAUDE.md`
- Create: `.agents/skills/anvil-site-operator/SKILL.md`
- Create: `.agents/skills/anvil-site-operator/references/CLAUDE.md`
- Create: `.agents/skills/anvil-site-operator/references/stage-gates.md`
- Create: `.agents/skills/anvil-site-operator/references/evidence-policy.md`
- Create: `.agents/skills/anvil-site-operator/references/state-contract.md`
- Modify: `CLAUDE.md`
- Test: `tests/agent-skills.test.ts`

- [ ] **Step 1: Verify the approved source runtime before copying**

Read these four files completely, then calculate SHA-256:

```powershell
Get-FileHash -Algorithm SHA256 'E:\游戏站项目\.agents\skills\anvil-site-operator\SKILL.md'
Get-FileHash -Algorithm SHA256 'E:\游戏站项目\.agents\skills\anvil-site-operator\references\stage-gates.md'
Get-FileHash -Algorithm SHA256 'E:\游戏站项目\.agents\skills\anvil-site-operator\references\evidence-policy.md'
Get-FileHash -Algorithm SHA256 'E:\游戏站项目\.agents\skills\anvil-site-operator\references\state-contract.md'
```

Expected hashes, in the same order:

```text
A05E9713E251ED1F2BEC6F8EB0AD6D8C9494E9539BFB7505016509D4CE0F1236
266DE69A4C68A98A37A9D0E1E7E4FC935BF93BB5F7C58E96DC5196CD6E57F2D9
51271ED6935E394AC78DA8D1825968C6F90B8878EF60CB8EB87D3AF48C0BC17B
E4461CCFD7BFDB53ECAC7734D09E8F0B27C531596C779F0B7894823F3D42AE17
```

Stop if any hash differs; update the approved design before vendoring a new controller revision.

- [ ] **Step 2: Add the four approved runtime files with apply_patch**

Use `apply_patch` to add exact byte-for-byte content from the four verified source files to:

```text
.agents/skills/anvil-site-operator/SKILL.md
.agents/skills/anvil-site-operator/references/stage-gates.md
.agents/skills/anvil-site-operator/references/evidence-policy.md
.agents/skills/anvil-site-operator/references/state-contract.md
```

Do not copy the source `evals/`, workspace, artifacts, or source `CLAUDE.md`; the target map is runtime-only and is defined in the next step.

- [ ] **Step 3: Add exact runtime-only GEB module maps**

Create `.agents/CLAUDE.md`:

```markdown
# /.agents

> L2 | 父级: ../CLAUDE.md
> 成员清单
> skills/: fork 自有的仓库级 Agent Skills；与上游 `.agent/skills` 叶子能力分离维护。
> [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
```

Create `.agents/skills/CLAUDE.md`:

```markdown
# /.agents/skills

> L2 | 父级: ../CLAUDE.md
> 成员清单
> anvil-site-operator/: AnvilWiki 生命周期总控，先路由上游叶子 Skill，再进行证据约束的阶段决策。
> [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
```

Create `.agents/skills/anvil-site-operator/CLAUDE.md`:

```markdown
# /.agents/skills/anvil-site-operator

> L2 | 父级: ../CLAUDE.md
> 成员清单
> SKILL.md: 生命周期总控入口；验证仓库和叶子可发现性后，输出单一阶段决策或移交叶子契约。
> references/: 按需加载的阶段门、证据和持久状态规则，避免总控入口承担全部政策细节。
> [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
```

Create `.agents/skills/anvil-site-operator/references/CLAUDE.md`:

```markdown
# /.agents/skills/anvil-site-operator/references

> L2 | 父级: ../CLAUDE.md
> 成员清单
> evidence-policy.md: S1/S2/S6/S7 的来源层级、新鲜度与冲突处理规则。
> stage-gates.md: 可恢复的 S0-S8 进入、放行、暂停和叶子路由边界。
> state-contract.md: 获授权后按章节合并站点状态、保留无关内容和追加历史的写入契约。
> [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
```

- [ ] **Step 4: Register the new top-level module in L1**

Insert this line in root `CLAUDE.md` immediately after the existing `.agent/` entry:

```text
<directory>.agents/ - fork 自有的生命周期总控 Agent Skills（1 子目录：skills）</directory>
```

- [ ] **Step 5: Run the targeted test and verify GREEN**

```powershell
$env:PATH = 'C:\Users\Administrator\.codex\tmp\anvil-corepack-bin;' + $env:PATH
& 'C:\Users\Administrator\.codex\tmp\anvil-corepack-bin\pnpm.CMD' exec vitest run tests/agent-skills.test.ts
```

Expected: `1 passed` test file and `8 passed` tests, with no failures.

- [ ] **Step 6: Verify vendored bytes and excluded development content**

```powershell
Get-FileHash -Algorithm SHA256 '.agents\skills\anvil-site-operator\SKILL.md'
Get-FileHash -Algorithm SHA256 '.agents\skills\anvil-site-operator\references\stage-gates.md'
Get-FileHash -Algorithm SHA256 '.agents\skills\anvil-site-operator\references\evidence-policy.md'
Get-FileHash -Algorithm SHA256 '.agents\skills\anvil-site-operator\references\state-contract.md'
Test-Path '.agents\skills\anvil-site-operator\evals'
```

Expected: the same four hashes from Step 1 and `False` for the evals path.

- [ ] **Step 7: Commit the runtime, tests, and GEB maps together**

```powershell
git add CLAUDE.md tests/CLAUDE.md tests/agent-skills.test.ts .agents docs/superpowers/plans/2026-09-02-anvil-site-operator-integration.md
git diff --cached --check
git commit -m 'feat: add AnvilWiki site operator skill'
```

Expected: staged diff check exits 0 and the commit contains only the listed runtime, test, and map files.

### Task 3: Run full regression and integrity verification

**Files:**
- Verify only; no planned file changes.

- [ ] **Step 1: Run the full Vitest suite**

```powershell
$env:PATH = 'C:\Users\Administrator\.codex\tmp\anvil-corepack-bin;' + $env:PATH
& 'C:\Users\Administrator\.codex\tmp\anvil-corepack-bin\pnpm.CMD' test
```

Expected: 12 test files and 122 tests pass. The previously observed nested-worktree warning about parent `tsconfig.json` may appear; no test failure or new warning is acceptable.

- [ ] **Step 2: Prove the five upstream leaf Skills were not modified**

```powershell
git diff ca3e5c4..HEAD -- .agent/skills
```

Expected: no output.

- [ ] **Step 3: Prove runtime scope and GEB protocol completeness**

```powershell
rg --files .agents
rg -n '\[PROTOCOL\]: 变更时更新此头部，然后检查 CLAUDE.md' CLAUDE.md .agents tests/CLAUDE.md
```

Expected runtime files: four module maps, `SKILL.md`, and the three policy references; no `evals`, workspace, or artifact path. Every L2/L3 file contains the fixed protocol string; root L1 is the only map not required to contain it.

- [ ] **Step 4: Verify final branch state**

```powershell
git status --short
git log --oneline --decorate -3
git diff --check ca3e5c4..HEAD
```

Expected: clean working tree, feature commit above `ca3e5c4`, and no whitespace errors.

- [ ] **Step 5: Open the branch review without pushing**

Open the Codex review for branch `codex/anvil-site-operator-integration` against `main`. Do not push, merge, or modify `requirements/anvil-site-state.md` until the user reviews the implementation.
