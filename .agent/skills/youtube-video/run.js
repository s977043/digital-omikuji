#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const targetDir = path.resolve(process.cwd(), 'artifacts/videos');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const url = process.argv[2] || 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
const notePath = path.join(targetDir, 'README.txt');
fs.writeFileSync(
  notePath,
  `Agent Skills: YouTube 動画ダウンロード\n` +
    `想定 URL: ${url}\n` +
    `推奨コマンド: yt-dlp -o \"${path.join(
      targetDir,
      '%(title)s.%(ext)s'
    )}\" ${url}\n`
);

console.log('YouTube Skill note created, run yt-dlp manually or integrate with Codex.');
