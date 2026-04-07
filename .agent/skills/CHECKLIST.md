# Agent Skills チェックリスト

新しいスキルを追加する際は、以下を確認してください。

`.agent/ai-design-agents/skills/` 配下の overlay スキルを追加・更新する場合は、あわせて `.agent/ai-design-agents/skills/CHECKLIST.md` も参照してください。

## 必須項目

### 1. ディレクトリとファイルの作成

- [ ] `<skill-name>/` ディレクトリを作成
- [ ] `SKILL.md` ファイルを作成
- [ ] スクリプトがある場合は `run.js` または適切なファイル名で作成

### 2. SKILL.md の Front Matter

- [ ] Front Matter を記載（`---` で囲む）
- [ ] 必須フィールド:
  - [ ] `name`: スキル名
  - [ ] `description`: スキルの説明
  - [ ] `version`: バージョン（任意）
  - [ ] `priority`: 優先度（任意: `highest`, `high`, `medium`, `low`）

### 3. SKILL.md の内容

- [ ] スキルの目的を明記
- [ ] 使用方法を記載
- [ ] サンプルコード・使用例を含める（該当する場合）
- [ ] 関連ドキュメントへのリンク（該当する場合）

## 任意項目

- [ ] `priority` フィールド（優先度が `highest` または `high` の場合のみ）
- [ ] `script` フィールド（実行可能スクリプトがある場合）
- [ ] サンプルコード・テンプレート
- [ ] トラブルシューティングセクション

## バリデーション

スキルを追加したら、バリデーションスクリプトを実行してください。現在の validator は `.agent/skills/` と `.agent/ai-design-agents/skills/` の両方を確認します:

```bash
pnpm validate:skills
```

または直接実行:

```bash
node .agent/skills/validate-skills.js
```

## 動作確認

実際にエージェントでスキルを呼び出し、期待通りに動作するか確認してください。

### Codex での確認例

```bash
codex --skill <skill-id>
```

### Gemini での確認例

```bash
gemini --skill <skill-id>
```

### Claude での確認例

スキルを参照するプロンプトを送信して動作確認。

## index.jsonの更新

スキルの追加・削除・メタデータ変更後は`index.json`を更新してください。

```bash
# 全スキルからindex.jsonを再生成
node -e "
const fs = require('fs');
const path = require('path');
const dir = '.agent/skills';
const dirs = fs.readdirSync(dir, {withFileTypes:true}).filter(d=>d.isDirectory()).map(d=>d.name).sort();
const skills = [];
for (const d of dirs) {
  const p = path.join(dir, d, 'SKILL.md');
  if (!fs.existsSync(p)) continue;
  const c = fs.readFileSync(p,'utf-8');
  const fm = c.match(/^---\n([\s\S]*?)\n---/);
  if (!fm) continue;
  const g = k => { const m = fm[1].match(new RegExp('^'+k+':\\\\s*[\"\\']?(.+?)[\"\\']?\\\\s*$','m')); return m?m[1].trim():''; };
  const a = k => { const m = fm[1].match(new RegExp('^'+k+':\\\\s*\\\\[(.*)\\\\]','m')); return m?m[1].split(',').map(s=>s.trim().replace(/^\"|\"$/g,'')).filter(Boolean):[]; };
  const pri = g('priority'); const lu = g('last_updated');
  skills.push({id:d, name:g('name')||d, description:g('description')||'', skill_path:d+'/SKILL.md', version:g('version')||'1.0', priority:['highest','high','medium','low'].includes(pri)?pri:'medium', contexts:a('contexts').length?a('contexts'):['development'], tags:a('tags').length?a('tags'):[d], last_updated:/^\d{4}-\d{2}-\d{2}$/.test(lu)?lu:new Date().toISOString().split('T')[0]});
}
fs.writeFileSync(path.join(dir,'index.json'), JSON.stringify({'\$schema':'agent-skills-index-v1', description:'Digital Omikuji エージェントスキルインデックス', generated:new Date().toISOString().split('T')[0], skills}, null, 2)+'\n');
console.log('Generated: '+skills.length+' skills');
"

# バリデーション実行
pnpm validate:skills
```

## チェックリスト完了後

- [ ] バリデーションスクリプトが成功することを確認
- [ ] `index.json`が更新されていることを確認
- [ ] 動作確認が完了
- [ ] PR を作成してレビューを依頼
- [ ] マージ後、他のエージェントでも動作することを確認

## 参考

- [AGENTS.md](../../AGENTS.md) - エージェント統合開発ガイド
- [.agent/ARCHITECTURE.md](../ARCHITECTURE.md) - エージェント/スキル構成の概要
