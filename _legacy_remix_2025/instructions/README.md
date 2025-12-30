# Gemini CLI 指示ファイル

このディレクトリには、Gemini CLI ファイル指示システムで使用する指示ファイルが格納されています。

## 提供される指示ファイル

### 1. generate-component.json
新しいReactコンポーネントの生成を行います。
```bash
npm run gemini:component
```

### 2. project-review.json
プロジェクト全体のコードレビューとドキュメント生成を行います。
```bash
npm run gemini:review
```

### 3. enhance-omikuji.json
おみくじアプリの機能拡張に関連するコード生成を行います。
```bash
npm run gemini:enhance
```

### 4. test.json
システムのテスト用の簡単な指示ファイルです。
```bash
npm run gemini:run -- instructions/test.json
```

## カスタム指示ファイルの作成

新しい指示ファイルを作成する場合は、以下の形式に従ってください：

```json
{
  "metadata": {
    "name": "指示セット名",
    "description": "説明",
    "version": "1.0.0",
    "author": "作成者"
  },
  "commands": [
    {
      "type": "コマンドタイプ",
      "command": "gemini コマンド",
      "variables": {
        "変数名": "値"
      },
      "options": {
        "cwd": "."
      },
      "required": true,
      "description": "コマンドの説明",
      "delay": 1000
    }
  ]
}
```

詳細については、[Gemini CLI ファイル指示システム](../documents/Gemini_CLI_ファイル指示システム.md) のドキュメントを参照してください。