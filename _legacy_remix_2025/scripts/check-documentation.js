#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * ドキュメント検証スクリプト
 * プロジェクトのドキュメントが最新かどうかをチェックします
 */
class DocumentationChecker {
  constructor() {
    this.projectRoot = process.cwd();
    this.errors = [];
    this.warnings = [];
    this.suggestions = [];
  }

  /**
   * README.mdの内容をチェック
   */
  checkReadme() {
    console.log('📖 README.md をチェック中...');
    
    const readmePath = path.join(this.projectRoot, 'README.md');
    if (!fs.existsSync(readmePath)) {
      this.errors.push('README.md が見つかりません');
      return;
    }

    const readmeContent = fs.readFileSync(readmePath, 'utf8');
    
    // package.jsonと比較してスクリプトが最新かチェック
    const packageJsonPath = path.join(this.projectRoot, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      const scripts = Object.keys(packageJson.scripts || {});
      
      // 新しいスクリプトがREADMEに記載されているかチェック
      const geminiScripts = scripts.filter(script => script.startsWith('gemini:'));
      for (const script of geminiScripts) {
        if (!readmeContent.includes(script)) {
          this.warnings.push(`新しいGeminiスクリプト "${script}" がREADMEに記載されていません`);
        }
      }
    }

    // 基本的なセクションの存在チェック
    const requiredSections = [
      '概要',
      '使用技術', 
      '機能',
      '使い方',
      '開発方法'
    ];
    
    for (const section of requiredSections) {
      if (!readmeContent.includes(section)) {
        this.warnings.push(`README.mdに "${section}" セクションが見つかりません`);
      }
    }

    console.log('✅ README.md チェック完了');
  }

  /**
   * documents/ フォルダの内容をチェック
   */
  checkDocuments() {
    console.log('📚 documents/ フォルダをチェック中...');
    
    const documentsPath = path.join(this.projectRoot, 'documents');
    if (!fs.existsSync(documentsPath)) {
      this.warnings.push('documents/ フォルダが見つかりません');
      return;
    }

    const files = fs.readdirSync(documentsPath).filter(file => file.endsWith('.md'));
    
    // 必要なドキュメントファイルの存在チェック
    const requiredDocs = [
      'プロジェクト構成.md',
      '開発環境構築ガイド.md',
      'VibeCoding設定ガイド.md',
      'Gemini_CLI使用方法.md'
    ];
    
    for (const doc of requiredDocs) {
      if (!files.includes(doc)) {
        this.warnings.push(`必要なドキュメント "${doc}" が見つかりません`);
      }
    }

    // 各ドキュメントファイルの更新日をチェック
    const packageJsonPath = path.join(this.projectRoot, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      const packageJsonStat = fs.statSync(packageJsonPath);
      
      for (const file of files) {
        const filePath = path.join(documentsPath, file);
        const fileStat = fs.statSync(filePath);
        
        // package.jsonより古いドキュメントがあれば警告
        if (fileStat.mtime < packageJsonStat.mtime) {
          this.suggestions.push(`${file} がpackage.jsonより古い可能性があります。依存関係やスクリプトの変更に対応しているか確認してください。`);
        }
      }
    }

    console.log('✅ documents/ フォルダチェック完了');
  }

  /**
   * Gemini設定ファイルとドキュメントの整合性をチェック
   */
  checkGeminiIntegration() {
    console.log('🤖 Gemini設定とドキュメントの整合性をチェック中...');
    
    const geminircPath = path.join(this.projectRoot, '.geminirc.json');
    if (!fs.existsSync(geminircPath)) {
      this.warnings.push('.geminirc.json が見つかりません');
      return;
    }

    const geminiConfig = JSON.parse(fs.readFileSync(geminircPath, 'utf8'));
    
    // ドキュメント設定がされているかチェック
    if (!geminiConfig.documentation) {
      this.warnings.push('.geminirc.json にドキュメント設定がありません');
    } else {
      if (geminiConfig.documentation.language !== 'japanese') {
        this.suggestions.push('Gemini設定の言語が日本語になっていません');
      }
      if (geminiConfig.documentation.format !== 'markdown') {
        this.suggestions.push('Gemini設定のフォーマットがMarkdownになっていません');
      }
    }

    // instructions/ フォルダの存在チェック
    const instructionsPath = path.join(this.projectRoot, 'instructions');
    if (fs.existsSync(instructionsPath)) {
      const instructionFiles = fs.readdirSync(instructionsPath).filter(file => file.endsWith('.json'));
      
      // ドキュメント関連の指示ファイルがあるかチェック
      const docInstructions = instructionFiles.filter(file => 
        file.includes('doc') || file.includes('readme') || file.includes('review')
      );
      
      if (docInstructions.length === 0) {
        this.suggestions.push('ドキュメント更新用のGemini指示ファイルを作成することを推奨します');
      }
    }

    console.log('✅ Gemini設定チェック完了');
  }

  /**
   * メインのチェック実行
   */
  async run() {
    console.log('🔍 ドキュメント検証を開始します...');
    console.log('=================================');
    
    this.checkReadme();
    this.checkDocuments();
    this.checkGeminiIntegration();
    
    console.log('\n📊 検証結果サマリー');
    console.log('===================');
    
    if (this.errors.length > 0) {
      console.log(`\n❌ エラー (${this.errors.length}件):`);
      this.errors.forEach(error => console.log(`  - ${error}`));
    }
    
    if (this.warnings.length > 0) {
      console.log(`\n⚠️ 警告 (${this.warnings.length}件):`);
      this.warnings.forEach(warning => console.log(`  - ${warning}`));
    }
    
    if (this.suggestions.length > 0) {
      console.log(`\n💡 提案 (${this.suggestions.length}件):`);
      this.suggestions.forEach(suggestion => console.log(`  - ${suggestion}`));
    }
    
    if (this.errors.length === 0 && this.warnings.length === 0 && this.suggestions.length === 0) {
      console.log('\n✅ すべてのドキュメントが適切に維持されています！');
    }
    
    // エラーがある場合は終了コード1で終了
    if (this.errors.length > 0) {
      console.log('\n❌ エラーが見つかりました。修正が必要です。');
      process.exit(1);
    }
    
    // 警告がある場合は注意喚起のみ
    if (this.warnings.length > 0) {
      console.log('\n⚠️ 警告があります。確認をお願いします。');
    }
    
    console.log('\n✅ ドキュメント検証が完了しました。');
  }
}

// CLI実行部分
if (require.main === module) {
  const checker = new DocumentationChecker();
  checker.run().catch(error => {
    console.error('検証中にエラーが発生しました:', error);
    process.exit(1);
  });
}

module.exports = DocumentationChecker;