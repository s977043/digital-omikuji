#!/usr/bin/env node
/**
 * Agent Skills Validation Script
 *
 * Validates:
 * 1. index.json schema and references
 * 2. SKILL.md file existence
 * 3. Front matter required fields
 * 4. last_updated date validity
 */

const fs = require('fs');
const path = require('path');

// Required fields for each skill in index.json
const REQUIRED_FIELDS = ['id', 'name', 'description', 'skill_path', 'contexts', 'tags', 'last_updated'];

// Base directory for skills (project root)
const PROJECT_ROOT = path.join(__dirname, '..', '..');

/**
 * Safely resolve a path relative to project root and validate it's within allowed directory
 * @param {string} relativePath - Path from index.json
 * @returns {string|null} - Resolved path if valid, null if path traversal detected
 */
function safeResolvePath(relativePath) {
  // Resolve and normalize the path
  const resolvedPath = path.resolve(PROJECT_ROOT, relativePath);
  const normalizedPath = path.normalize(resolvedPath);
  const normalizedRoot = path.normalize(PROJECT_ROOT);

  // Ensure the resolved path is within project root
  if (!normalizedPath.startsWith(normalizedRoot + path.sep) && normalizedPath !== normalizedRoot) {
    return null; // Path traversal attempt detected
  }

  return normalizedPath;
}

// Validate index.json structure
function validateIndexJson() {
  const errors = [];
  const indexPath = path.join(__dirname, 'index.json');

  if (!fs.existsSync(indexPath)) {
    errors.push('index.json が見つかりません');
    return errors;
  }

  let index;
  try {
    index = JSON.parse(fs.readFileSync(indexPath, 'utf-8'));
  } catch (e) {
    errors.push(`index.json のパースに失敗: ${e.message}`);
    return errors;
  }

  if (!index.skills || !Array.isArray(index.skills)) {
    errors.push('index.json: skills配列が存在しません');
    return errors;
  }

  // Validate each skill entry
  index.skills.forEach((skill, idx) => {
    const prefix = `スキル[${idx}] (${skill.id || 'unknown'})`;

    // Check required fields
    REQUIRED_FIELDS.forEach(field => {
      if (!skill[field]) {
        errors.push(`${prefix}: 必須フィールド "${field}" がありません`);
      }
    });

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
function validateSkillFiles() {
  const errors = [];
  const indexPath = path.join(__dirname, 'index.json');

  if (!fs.existsSync(indexPath)) {
    return errors; // Already reported in validateIndexJson
  }

  let index;
  try {
    index = JSON.parse(fs.readFileSync(indexPath, 'utf-8'));
  } catch (e) {
    return errors; // Already reported in validateIndexJson
  }

  if (!index.skills) {
    return errors;
  }

  index.skills.forEach(skill => {
    const prefix = `スキル "${skill.id}"`;

    // Check SKILL.md existence
    if (skill.skill_path) {
      const skillPath = safeResolvePath(skill.skill_path);
      if (!skillPath) {
        errors.push(`${prefix}: 不正なパスが検出されました (${skill.skill_path})`);
      } else if (!fs.existsSync(skillPath)) {
        errors.push(`${prefix}: SKILL.md が見つかりません (${skill.skill_path})`);
      }
    }

    // Check script existence if specified
    if (skill.script) {
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

// Validate Front Matter in SKILL.md files
function validateFrontMatter() {
  const errors = [];
  const indexPath = path.join(__dirname, 'index.json');

  if (!fs.existsSync(indexPath)) {
    return errors;
  }

  let index;
  try {
    index = JSON.parse(fs.readFileSync(indexPath, 'utf-8'));
  } catch (e) {
    return errors;
  }

  if (!index.skills) {
    return errors;
  }

  index.skills.forEach(skill => {
    if (!skill.skill_path) {
      return;
    }

    const prefix = `スキル "${skill.id}"`;
    const skillPath = safeResolvePath(skill.skill_path);

    if (!skillPath) {
      return; // Path traversal detected, already reported in validateSkillFiles
    }

    if (!fs.existsSync(skillPath)) {
      return; // Already reported in validateSkillFiles
    }

    const content = fs.readFileSync(skillPath, 'utf-8');

    // Check for Front Matter (basic check - starts with ---)
    if (!content.startsWith('---')) {
      errors.push(`${prefix}: Front Matter がありません (${skill.skill_path})`);
      return;
    }

    // Extract Front Matter
    const frontMatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
    if (!frontMatterMatch) {
      errors.push(`${prefix}: Front Matter の形式が不正です (${skill.skill_path})`);
      return;
    }

    const frontMatter = frontMatterMatch[1];

    // Check for required Front Matter fields (basic check)
    const requiredFMFields = ['name', 'description'];
    requiredFMFields.forEach(field => {
      if (!frontMatter.includes(`${field}:`)) {
        errors.push(`${prefix}: Front Matter に "${field}" フィールドがありません (${skill.skill_path})`);
      }
    });
  });

  return errors;
}

// Main execution
function main() {
  console.log('🔍 Agent Skills をバリデーション中...\n');

  const errors = [
    ...validateIndexJson(),
    ...validateSkillFiles(),
    ...validateFrontMatter()
  ];

  if (errors.length === 0) {
    console.log('✅ 全てのスキルが有効です!');
    console.log(`\n検証済みスキル数: ${getSkillCount()}`);
    process.exit(0);
  } else {
    console.error('❌ バリデーション失敗:\n');
    errors.forEach(err => console.error(`  - ${err}`));
    console.error(`\nエラー数: ${errors.length}`);
    process.exit(1);
  }
}

// Helper: Get skill count
function getSkillCount() {
  const indexPath = path.join(__dirname, 'index.json');
  if (!fs.existsSync(indexPath)) {
    return 0;
  }
  try {
    const index = JSON.parse(fs.readFileSync(indexPath, 'utf-8'));
    return index.skills ? index.skills.length : 0;
  } catch (e) {
    return 0;
  }
}

main();
