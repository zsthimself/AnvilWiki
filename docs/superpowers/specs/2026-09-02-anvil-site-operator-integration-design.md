<!--
[INPUT]: 依赖现有 .agent/skills 五个叶子 Skill、Vitest 测试框架与外部总控 Skill 的已验证运行时文件
[OUTPUT]: 提供仓库级 anvil-site-operator 接入、路由契约、GEB 文档和验收设计
[POS]: docs/superpowers/specs 的集成决策记录，约束后续实现计划而不直接承担运行时行为
[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
-->

# AnvilWiki Site Operator 仓库级接入设计

日期：2026-09-02

## 背景

AnvilWiki v2.7.0 已在 `.agent/skills/` 随模板分发五个叶子 Skill，分别负责单篇文章、批量文章、兑换码、内容刷新和 AdSense 审计。现有 `anvil-site-operator` 是独立开发并通过对照评测的生命周期总控，负责在 S0-S8 阶段门内恢复当前状态、约束证据、作出单一 Go/Hold/No-Go 决策，并将单一执行请求路由到叶子 Skill。

本设计把总控固化到 fork 的仓库级 `.agents/skills/`，让仓库在其他机器和其他 Agent 会话中仍携带同一总控能力，同时保持上游 `.agent/skills/` 原样，避免污染模板维护边界。

## 目标

1. 在 `.agents/skills/anvil-site-operator/` 提供可被 Codex 仓库扫描发现的总控运行时文件。
2. 保持总控与五个上游叶子 Skill 的精确名称映射，路由前必须验证目标存在。
3. 用 Vitest 固定总控、references 与叶子 Skill 的跨目录契约，阻止上游改名或漏文件造成静默退化。
4. 为新增 `.agents` 模块建立 GEB L1/L2/L3 地图，并在结构变化时同步维护。

## 非目标

- 不修改 `.agent/skills/` 中任何上游叶子 Skill。
- 不复制总控的 `evals/`、评测工作区或打包产物。
- 不变更依赖清单；若本地依赖缺失，允许执行 `pnpm install --frozen-lockfile` 作为测试前置，但不提交生成物。
- 不初始化游戏、不选择语言或域名。
- 不创建 `requirements/anvil-site-state.md`，直到用户提供目标游戏、主语言和经营目标。
- 不改变现有 CI 工作流或发布版本号。

## 方案选择

采用仓库级复制，而非用户级安装或机器路径符号链接。

- 仓库级复制可审阅、可追踪、可在新机器复现，并能由测试验证。
- 用户级安装不会随 fork 分发，团队和未来会话无法从仓库重建能力。
- 符号链接依赖 `E:\游戏站项目` 的本机绝对路径，不适合作为长期资产。

总控与叶子采用双目录分工：

```text
.agents/skills/anvil-site-operator/   # fork 自有生命周期总控
.agent/skills/anvil-*/                # 上游模板维护的五个叶子执行 Skill
```

不建立第二份叶子 Skill，不在两个目录间同步同名文件。

## 运行时结构

只接入以下运行时集合：

```text
.agents/
  CLAUDE.md
  skills/
    CLAUDE.md
    anvil-site-operator/
      CLAUDE.md
      SKILL.md
      references/
        CLAUDE.md
        stage-gates.md
        evidence-policy.md
        state-contract.md
```

`SKILL.md` 是入口与路由表；三份 reference 分别承载阶段门、证据新鲜度和持久状态写入契约。总控只在相应决策需要时加载 reference，避免无关上下文进入每次请求。

## 数据流与权限

1. 用户在 AnvilWiki 仓库提出经营或执行请求。
2. 总控先确认 AnvilWiki 仓库信号，并读取已有 `requirements/anvil-site-state.md`（若存在）。
3. 单一文章、批量文章、Codes、刷新或 AdSense 请求先匹配叶子路由。
4. 总控验证 `.agent/skills/<name>/SKILL.md` 存在且 frontmatter 名称匹配，再加载并执行叶子契约。
5. 跨阶段请求进入 S0-S8 决策循环，只输出一个 Go/Hold/No-Go、最多三项行动和可观察的复查条件。
6. 未得到显式授权时，总控只提出状态变更，不写仓库、不发布、不购买、不提交广告申请。

## 错误处理

- 叶子缺失或改名：报告精确名称与预期路径并停止，不伪造叶子输出，也不展开通用生命周期报告。
- reference 缺失：契约测试失败，阻止集成被视为完整。
- frontmatter 名称与目录不一致：契约测试失败，避免 Codex 选择器和路由名漂移。
- 用户事实不足或陈旧：返回 Hold，不用紧迫性替代证据。
- fork 与 upstream 发生结构变化：先更新契约测试和文档地图，再接受新目录结构。

## 测试设计

新增 `tests/agent-skills.test.ts`，使用现有 Vitest 和 Node.js `fs` 读取真实仓库文件，不引入 mock 或新依赖。

测试固定四类行为：

1. `.agents/skills/anvil-site-operator/SKILL.md` 存在，且 frontmatter `name` 为 `anvil-site-operator`。
2. 总控声明的五个精确路由全部映射到 `.agent/skills/<name>/SKILL.md`。
3. 每个叶子 Skill 的 frontmatter `name` 与目录名一致。
4. 总控索引的 `stage-gates.md`、`evidence-policy.md`、`state-contract.md` 全部存在。
5. 总控保留“叶子缺失即停止、不得伪造调用或展开生命周期报告”的失败边界。

执行严格 RED-GREEN：先只加入测试，运行 targeted Vitest，确认因总控路径不存在而失败；随后加入最小运行时文件，确认 targeted test 通过；最后运行完整 `pnpm test` 验证无回归。

## GEB 文档同构

实施时同步以下地图：

- 根 `CLAUDE.md` 新增 `.agents/` 顶级模块。
- `.agents/CLAUDE.md` 声明自有 Agent 扩展边界。
- `.agents/skills/CLAUDE.md` 登记总控成员。
- `.agents/skills/anvil-site-operator/CLAUDE.md` 和 references 地图保持与运行时文件一致。
- `tests/CLAUDE.md` 完整登记现有测试与新增契约测试。
- 新测试使用 L3 INPUT/OUTPUT/POS/PROTOCOL 文件头。

## 验收条件

1. targeted RED 失败原因是总控尚未接入，而非测试语法或环境错误。
2. 接入后 targeted test 全绿，完整 `pnpm test` 无回归。
3. `git status` 只包含设计批准的运行时、测试和 GEB 文档变更。
4. 五个上游叶子 Skill 文件哈希未因本次接入改变。
5. 总控目录不包含 `evals/`、workspace 或 artifact。
6. 用户复核差异后再决定是否提交实现 commit；不自动推送或发布。
