# AnvilWiki - 游戏 Wiki 模板

Astro 5 + TypeScript + Tailwind CSS 3 + MDX 4 + pnpm 11 + Cloudflare Pages

<directory>.agent/ - 随上游模板分发的叶子 Agent Skills（1 子目录：skills）</directory>
<directory>.agents/ - fork 自有的生命周期总控 Agent Skills（1 子目录：skills）</directory>
<directory>.github/ - GitHub Actions、共享质量门与仓库自动化（2 子目录：actions、workflows）</directory>
<directory>docs/ - 架构真相源、操作手册与设计决策（2 子目录：handbook、superpowers）</directory>
<directory>public/ - 静态公开资源、站点清单与广告占位文件</directory>
<directory>requirements/ - 建站前事实来源、对标与素材准备模板</directory>
<directory>scripts/ - 初始化、内容校验、资产生成和站点维护命令</directory>
<directory>src/ - Astro 页面、组件、配置、内容与本地化实现</directory>
<directory>tests/ - Vitest 确定性契约与回归测试</directory>
<directory>tools/ - 独立的 anvilwiki-ops CLI 与 MCP 工具包（1 子目录：anvil-ops）</directory>
<config>AGENTS.md - 项目目的、架构边界、命令与 Agent 行为真相源</config>
<config>.gitignore - 排除依赖、构建产物、凭据与本地隔离 worktree</config>
<config>package.json - 根工作区脚本、依赖与 v2.7.0 版本声明</config>
<config>astro.config.ts - Astro 静态输出、路由、i18n 与 sitemap 配置</config>
<config>pnpm-workspace.yaml - pnpm 11 构建依赖许可边界</config>
<config>wrangler.toml - Cloudflare Pages 构建时环境变量真相源</config>

法则：极简、稳定、导航、版本精确。代码与文档必须保持同构；新增顶级模块或改变职责边界时同步更新本文件。
