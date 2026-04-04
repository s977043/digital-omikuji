#!/usr/bin/env node
/**
 * Agent Skills Validation Script
 *
 * Validates:
 * 1. index.json schema and references (optional)
 * 2. SKILL.md file existence
 * 3. Front matter required fields
 * 4. last_updated date validity
 */

const fs = require('fs');
const path = require('path');

// Required fields for each skill in index.json
const REQUIRED_FIELDS = ['id', 'name', 'description', 'skill_path', 'contexts', 'tags', 'last_updated'];

// Base directory for skills (.agent/skills)
const SKILLS_ROOT = __dirname;
const OVERLAY_SKILLS_ROOT = path.resolve(SKILLS_ROOT, '..', 'ai-design-agents', 'skills');

/**
 * Safely resolve a path relative to skills root and validate it's within allowed directory
 * @param {string} relativePath - Path from index.json
 * @returns {string|null} - Resolved path if valid, null if path traversal detected
 */
function safeResolvePath(relativePath) {
  if (typeof relativePath !== 'string') {
    return null;
  }

  const resolvedPath = path.resolve(SKILLS_ROOT, relativePath);
  const normalizedRoot = path.resolve(SKILLS_ROOT);

  // Ensure the resolved path is within the skills directory
  if (!resolvedPath.startsWith(normalizedRoot + path.sep) && resolvedPath !== normalizedRoot) {
    return null;
  }

  return resolvedPath;
}

function loadIndexJson() {
  const indexPath = path.join(SKILLS_ROOT, 'index.json');

  if (!fs.existsSync(indexPath)) {
    return { index: null, errors: [], skipped: true };
  }

  try {
    const index = JSON.parse(fs.readFileSync(indexPath, 'utf-8'));
    return { index, errors: [], skipped: false };
  } catch (e) {
    return { index: null, errors: [`index.json のパースに失敗: ${e.message}`], skipped: false };
  }
}

// Validate index.json structure
function validateIndexJson(index) {
  const errors = [];

  if (!index || typeof index !== 'object') {
    errors.push('index.json: 期待される形式ではありません');
    return errors;
  }

  if (!index.skills || !Array.isArray(index.skills)) {
    errors.push('index.json: skills配列が存在しません');
    return errors;
  }

  // Validate each skill entry
  index.skills.forEach((skill, idx) => {
    const skillId = skill && typeof skill === 'object' ? skill.id : null;
    const prefix = `スキル[${idx}] (${skillId || 'unknown'})`;

    if (!skill || typeof skill !== 'object') {
      errors.push(`${prefix}: スキル定義が不正です`);
      return;
    }

    // Check required fields
    REQUIRED_FIELDS.forEach(field => {
      if (!skill[field]) {
        errors.push(`${prefix}: 必須フィールド "${field}" がありません`);
      }
    });

    if (skill.skill_path && typeof skill.skill_path !== 'string') {
      errors.push(`${prefix}: skill_path は文字列である必要があります`);
    }

    if (skill.script && typeof skill.script !== 'string') {
      errors.push(`${prefix}: script は文字列である必要があります`);
    }

    // Validate contexts array
    if (skill.contexts && !Array.isArray(skill.contexts)) {
      errors.push(`${prefix}: contexts は配列である必要があります`);
    } else if (skill.contexts && skill.contexts.length === 0) {
      errors.push(`${prefix}: contexts が空です`);
    }

    // Validate tags array
    if (skill.tags && !Array.isArray(skill.tags)) {
      errors.push(`${prefix}: tags は配列である必要があります`);
    }

    // Validate last_updated date format (YYYY-MM-DD)
    if (skill.last_updated) {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(skill.last_updated)) {
        errors.push(`${prefix}: last_updated の形式が不正です (期待: YYYY-MM-DD, 実際: ${skill.last_updated})`);
      }
    }

    // Validate priority if present
    if (skill.priority) {
      const validPriorities = ['highest', 'high', 'medium', 'low'];
      if (!validPriorities.includes(skill.priority)) {
        errors.push(`${prefix}: priority が不正です (期待: ${validPriorities.join(', ')}, 実際: ${skill.priority})`);
      }
    }
  });

  return errors;
}

// Validate that SKILL.md files exist
function validateSkillFiles(index) {
  const errors = [];

  if (!index || !Array.isArray(index.skills)) {
    return errors;
  }

  index.skills.forEach(skill => {
    const prefix = `スキル "${skill.id}"`;

    // Check SKILL.md existence
    if (typeof skill.skill_path === 'string') {
      const skillPath = safeResolvePath(skill.skill_path);
      if (!skillPath) {
        errors.push(`${prefix}: 不正なパスが検出されました (${skill.skill_path})`);
      } else if (!fs.existsSync(skillPath)) {
        errors.push(`${prefix}: SKILL.md が見つかりません (${skill.skill_path})`);
      }
    }

    // Check script existence if specified
    if (typeof skill.script === 'string') {
      const scriptPath = safeResolvePath(skill.script);
      if (!scriptPath) {
        errors.push(`${prefix}: スクリプトに不正なパスが検出されました (${skill.script})`);
      } else if (!fs.existsSync(scriptPath)) {
        errors.push(`${prefix}: スクリプトファイルが見つかりません (${skill.script})`);
      }
    }
  });

  return errors;
}

function parseFrontMatter(content) {
  const frontMatterMatch = content.match(/^---\s*\r?\n([\s\S]*?)\r?\n---/);
  if (!frontMatterMatch) {
    return null;
  }

  const frontMatter = frontMatterMatch[1];
  const data = {};

  frontMatter.split(/\r?\n/).forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) {
      return;
    }

    const fieldMatch = trimmed.match(/^([A-Za-z0-9_-]+)\s*:\s*(.*)$/);
    if (fieldMatch) {
      data[fieldMatch[1]] = fieldMatch[2];
    }
  });

  return data;
}

function walkSkillFiles(rootDir) {
  if (!fs.existsSync(rootDir)) {
    return [];
  }

  const entries = fs.readdirSync(rootDir, { withFileTypes: true });
  const files = [];

  entries.forEach(entry => {
    const fullPath = path.join(rootDir, entry.name);

    if (entry.isDirectory()) {
      files.push(...walkSkillFiles(fullPath));
      return;
    }

    if (entry.isFile() && entry.name === 'SKILL.md') {
      files.push(fullPath);
    }
  });

  return files;
}

function relativeToRoot(rootDir, filePath) {
  return path.relative(rootDir, filePath).replace(/\\/g, '/');
}

function getIndexedSkillPathSet(index) {
  const indexedPaths = new Set();

  if (!index || !Array.isArray(index.skills)) {
    return indexedPaths;
  }

  index.skills.forEach(skill => {
    if (!skill || typeof skill.skill_path !== 'string') {
      return;
    }

    const resolvedPath = safeResolvePath(skill.skill_path);
    if (resolvedPath) {
      indexedPaths.add(path.resolve(resolvedPath));
    }
  });

  return indexedPaths;
}

function validateFrontMatterContent(content, prefix, suffix = '') {
  const errors = [];
  const detailSuffix = suffix ? ` ${suffix}` : '';

  if (!content.startsWith('---')) {
    errors.push(`${prefix}: Front Matter がありません${detailSuffix}`);
    return errors;
  }

  const frontMatterData = parseFrontMatter(content);
  if (!frontMatterData) {
    errors.push(`${prefix}: Front Matter の形式が不正です${detailSuffix}`);
    return errors;
  }

  if (Object.keys(frontMatterData).length === 0) {
    errors.push(`${prefix}: Front Matter が空です${detailSuffix}`);
    return errors;
  }

  ['name', 'description'].forEach(field => {
    if (!Object.prototype.hasOwnProperty.call(frontMatterData, field)) {
      errors.push(`${prefix}: Front Matter に "${field}" フィールドがありません${detailSuffix}`);
    }
  });

  return errors;
}

function validateDiscoveredSkillFiles(rootDir, skillPaths, label) {
  const errors = [];

  skillPaths.forEach(skillPath => {
    const relPath = relativeToRoot(rootDir, skillPath) || skillPath;
    const prefix = `${label} "${relPath}"`;
    const content = fs.readFileSync(skillPath, 'utf-8');

    errors.push(...validateFrontMatterContent(content, prefix));
  });

  return errors;
}
// Validate Front Matter in SKILL.md files
function validateFrontMatter(index) {
  const errors = [];

  if (!index || !Array.isArray(index.skills)) {
    return errors;
  }

  index.skills.forEach(skill => {
    if (!skill || typeof skill !== 'object' || typeof skill.skill_path !== 'string') {
      return;
    }

    const prefix = `スキル "${skill.id || 'unknown'}"`;
    const skillPath = safeResolvePath(skill.skill_path);

    if (!skillPath) {
      return; // Path traversal detected, already reported in validateSkillFiles
    }

    if (!fs.existsSync(skillPath)) {
      return; // Already reported in validateSkillFiles
    }

    const content = fs.readFileSync(skillPath, 'utf-8');
    errors.push(...validateFrontMatterContent(content, prefix, `(${skill.skill_path})`));
  });

  return errors;
}

// Main execution
function main() {
  console.log('🔍 Agent Skills をバリデーション中...\n');

  const { index, errors: loadErrors, skipped } = loadIndexJson();
  const errors = [...loadErrors];
  const indexedSkillPaths = getIndexedSkillPathSet(index);
  const discoveredCoreSkillFiles = walkSkillFiles(SKILLS_ROOT).filter(skillPath => {
    return !indexedSkillPaths.has(path.resolve(skillPath));
  });
  const discoveredOverlaySkillFiles = walkSkillFiles(OVERLAY_SKILLS_ROOT);

  if (index) {
    errors.push(...validateIndexJson(index));
    errors.push(...validateSkillFiles(index));
    errors.push(...validateFrontMatter(index));
  }

  errors.push(...validateDiscoveredSkillFiles(SKILLS_ROOT, discoveredCoreSkillFiles, 'core skill'));
  errors.push(...validateDiscoveredSkillFiles(OVERLAY_SKILLS_ROOT, discoveredOverlaySkillFiles, 'overlay skill'));

  const skillCount = Array.isArray(index?.skills) ? index.skills.length : 0;
  const discoveredSkillCount = discoveredCoreSkillFiles.length + discoveredOverlaySkillFiles.length;

  if (errors.length === 0) {
    console.log('✅ 全てのスキルが有効です!');
    if (skipped) {
      console.log('ℹ️ index.json は未検出のため、SKILL.md の自動検出ベースで検証しました。');
    }
    console.log(`\nindex.json 登録スキル数: ${skillCount}`);
    console.log(`自動検出スキル数: ${discoveredSkillCount}`);
    process.exit(0);
  } else {
    console.error('❌ バリデーション失敗:\n');
    errors.forEach(err => console.error(`  - ${err}`));
    console.error(`\nエラー数: ${errors.length}`);
    process.exit(1);
  }
}

main();
