/**
 * [INPUT]: 依赖仓库内 .agents 总控 Skill、.agent 五个叶子 Skill、Node.js fs/path/url、yaml 的 parse 与 vitest
 * [OUTPUT]: 对外提供总控安装、叶子路由、reference 完整性和缺失叶子停止语义的 Vitest 契约
 * [POS]: tests 的 Agent Skills 跨目录回归门，防止上游改名或 fork 漏文件造成静默路由退化
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, test } from 'vitest';
import { parse } from 'yaml';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const operatorSegments = ['.agents', 'skills', 'anvil-site-operator', 'SKILL.md'];
const leafRoutes = [
  ['One guide or article', 'anvil-new-article'],
  ['Keyword-list batch', 'anvil-batch-articles'],
  ['Codes', 'anvil-update-codes'],
  ['Freshness or stale content', 'anvil-refresh'],
  ['AdSense readiness or integration', 'anvil-adsense-audit'],
] as const;
const referenceRoutes = [
  ['Stage entry, Go, Hold, No-Go, or routing', '`references/stage-gates.md`', 'stage-gates.md'],
  ['S1, S2, S6, S7, or any volatile fact', '`references/evidence-policy.md`', 'evidence-policy.md'],
  ['Creating or updating site state', '`references/state-contract.md`', 'state-contract.md'],
] as const;
const missingLeafBoundary =
  'If the required leaf is missing, name that leaf and its expected path, then stop that leaf task. Do not simulate its schema or output, falsely claim it was invoked, or expand a lifecycle report.';

const repoPath = (...segments: string[]): string => join(root, ...segments);
const readRepoFile = (...segments: string[]): string => readFileSync(repoPath(...segments), 'utf8');
type SkillFrontmatter = { name: string; description: string };

const parseSkillFrontmatter = (source: string): SkillFrontmatter => {
  const frontmatter = source.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/)?.[1];
  if (frontmatter === undefined) {
    throw new Error('Expected YAML frontmatter as the first file block.');
  }

  const parsed = parse(frontmatter, { uniqueKeys: true });
  if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error('Expected YAML frontmatter to be an object.');
  }

  const { name, description } = parsed as Record<string, unknown>;
  if (typeof name !== 'string' || name.trim().length === 0) {
    throw new Error('Expected YAML frontmatter name to be a non-empty string.');
  }
  if (typeof description !== 'string' || description.trim().length === 0) {
    throw new Error('Expected YAML frontmatter description to be a non-empty string.');
  }

  return { name: name.trim(), description: description.trim() };
};

const extractMarkdownSection = (source: string, heading: string): string => {
  const lines = source.split(/\r?\n/);
  const sectionStart = lines.indexOf(`## ${heading}`);
  if (sectionStart === -1) {
    throw new Error(`Missing ## ${heading} section.`);
  }

  const followingLines = lines.slice(sectionStart + 1);
  const nextSection = followingLines.findIndex((line) => line.startsWith('## '));
  return followingLines.slice(0, nextSection === -1 ? undefined : nextSection).join('\n');
};

const parseMarkdownTableRow = (line: string): string[] =>
  line
    .trim()
    .slice(1, -1)
    .split('|')
    .map((cell) => cell.trim());

const extractMarkdownTableRows = (source: string, heading: string): string[][] => {
  const sectionLines = extractMarkdownSection(source, heading).split('\n');
  const tableStart = sectionLines.findIndex((line) => line.trim().startsWith('|'));
  if (tableStart === -1) {
    throw new Error(`Missing Markdown table in ## ${heading} section.`);
  }

  const tableLines: string[] = [];
  for (const line of sectionLines.slice(tableStart)) {
    if (!line.trim().startsWith('|')) {
      break;
    }
    tableLines.push(line);
  }

  const separatorCells = tableLines.length < 2 ? [] : parseMarkdownTableRow(tableLines[1]);
  if (separatorCells.length === 0 || !separatorCells.every((cell) => /^:?-{3,}:?$/.test(cell))) {
    throw new Error(`Expected a Markdown table header and separator in ## ${heading} section.`);
  }

  return tableLines.slice(2).map(parseMarkdownTableRow);
};

describe('repository Agent Skills contract', () => {
  test('installs the lifecycle operator with the expected frontmatter name', () => {
    const operatorPath = repoPath(...operatorSegments);
    expect(existsSync(operatorPath)).toBe(true);
    const operator = readRepoFile(...operatorSegments);
    expect(parseSkillFrontmatter(operator).name).toBe('anvil-site-operator');
    expect(extractMarkdownTableRows(operator, 'First Route The Request')).toEqual(
      leafRoutes.map(([request, skill]) => [request, `\`${skill}\``]),
    );
  });

  test.each(leafRoutes)('routes %s to %s with a matching leaf skill', (request, skill) => {
    const leafSegments = ['.agent', 'skills', skill, 'SKILL.md'];
    expect(existsSync(repoPath(...leafSegments))).toBe(true);
    expect(parseSkillFrontmatter(readRepoFile(...leafSegments)).name).toBe(skill);
  });

  test('ships every reference named by the lifecycle operator', () => {
    const operator = readRepoFile(...operatorSegments);
    expect(extractMarkdownTableRows(operator, 'Recover Before Diagnosing')).toEqual(
      referenceRoutes.map(([need, route]) => [need, route]),
    );

    for (const [, , reference] of referenceRoutes) {
      expect(
        existsSync(repoPath('.agents', 'skills', 'anvil-site-operator', 'references', reference)),
      ).toBe(true);
    }
  });

  test('stops a missing leaf task instead of simulating or expanding it', () => {
    const operator = readRepoFile(...operatorSegments);
    expect(operator.split(missingLeafBoundary).length - 1).toBe(1);
  });
});
