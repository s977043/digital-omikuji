#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const targetDir = path.resolve(process.cwd(), 'artifacts/screenshots');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const placeholder = path.join(targetDir, 'README.txt');
fs.writeFileSync(
  placeholder,
  'Agent Skills: Chrome DevTools UI 調査\n' +
    '1. Chrome を開き、対象ページを Chrome DevTools で検査する。\n' +
    '2. 拡張パネル (Elements / Performance など) のスクリーンショットをこのフォルダに配置する。\n' +
    '3. スクリーンショットファイル名に要点 (セクション名、要素 ID) を含める。\n'
);

console.log('Chrome DevTools Skill prepared. Place screenshots under', targetDir);
