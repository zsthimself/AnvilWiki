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
const leafSkills = [
  'anvil-new-article',
  'anvil-batch-articles',
  'anvil-update-codes',
  'anvil-refresh',
  'anvil-adsense-audit',
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

  test('maps every controller route to a real leaf skill with a matching name', () => {
    const operator = readRepoFile(...operatorSegments);

    for (const skill of leafSkills) {
      const leafSegments = ['.agent', 'skills', skill, 'SKILL.md'];
      expect(operator).toContain(`\`${skill}\``);
      expect(existsSync(repoPath(...leafSegments))).toBe(true);
      expect(frontmatterName(readRepoFile(...leafSegments))).toBe(skill);
    }
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
