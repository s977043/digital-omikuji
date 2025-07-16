#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

/**
 * GitHub Copilot ファイル指示実行ツール
 * 指示ファイルを読み込んで、Copilot用のプロンプトを生成し、実行支援を行います
 */
class CopilotCLIExecutor {
  constructor() {
    this.projectRoot = process.cwd();
    this.configPath = path.join(this.projectRoot, '.copilotrc.json');
    this.config = this.loadConfig();
  }

  /**
   * 設定ファイルを読み込み
   */
  loadConfig() {
    try {
      if (fs.existsSync(this.configPath)) {
        const content = fs.readFileSync(this.configPath, 'utf8');
        return JSON.parse(content);
      }
      return {};
    } catch (error) {
      console.warn('Warning: Failed to load .copilotrc.json:', error.message);
      return {};
    }
  }

  /**
   * 指示ファイルを読み込んで解析
   */
  async loadInstructionFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const ext = path.extname(filePath);
      
      if (ext === '.json') {
        return JSON.parse(content);
      } else if (ext === '.yaml' || ext === '.yml') {
        // 簡易的なYAML対応（基本的なJSON形式のみ）
        return JSON.parse(content);
      } else {
        throw new Error(`Unsupported file format: ${ext}`);
      }
    } catch (error) {
      throw new Error(`Failed to load instruction file ${filePath}: ${error.message}`);
    }
  }

  /**
   * テンプレート変数を置換
   */
  replaceTemplateVariables(text, variables = {}) {
    return text.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return variables[key] || match;
    });
  }

  /**
   * プロジェクトコンテキストを生成
   */
  generateProjectContext() {
    const context = [];
    
    // プロジェクト情報
    if (this.config.project) {
      context.push('## プロジェクト情報');
      context.push(`- **名前**: ${this.config.project.name || 'Unknown'}`);
      context.push(`- **説明**: ${this.config.project.description || 'No description'}`);
      context.push(`- **言語**: ${this.config.project.language || 'Unknown'}`);
      context.push(`- **フレームワーク**: ${this.config.project.framework || 'Unknown'}`);
      context.push('');
    }

    // コーディング規約
    if (this.config.generation) {
      context.push('## コーディング規約');
      context.push(`- **スタイル**: ${this.config.generation.codeStyle || 'functional'}`);
      context.push(`- **命名規則**: ${this.config.generation.naming || 'camelCase'}`);
      context.push(`- **インポート**: ${this.config.generation.imports || 'es6'}`);
      if (this.config.generation.typescript) {
        context.push(`- **TypeScript**: strict=${this.config.generation.typescript.strict}`);
      }
      context.push('');
    }

    return context.join('\n');
  }

  /**
   * Copilot用プロンプトを生成
   */
  generateCopilotPrompt(instruction, context = '') {
    const prompt = [];
    
    // ヘッダー
    prompt.push(`# ${instruction.title || 'GitHub Copilot タスク'}`);
    prompt.push('');
    
    // プロジェクトコンテキスト
    if (context) {
      prompt.push(context);
    }
    
    // 指示内容
    if (instruction.prompt) {
      prompt.push('## 指示内容');
      const processedPrompt = this.replaceTemplateVariables(
        instruction.prompt, 
        instruction.variables || {}
      );
      prompt.push(processedPrompt);
      prompt.push('');
    }

    // 変数情報
    if (instruction.variables && Object.keys(instruction.variables).length > 0) {
      prompt.push('## 変数');
      for (const [key, value] of Object.entries(instruction.variables)) {
        prompt.push(`- **${key}**: ${value}`);
      }
      prompt.push('');
    }

    // 優先度
    if (instruction.priority) {
      prompt.push(`**優先度**: ${instruction.priority}`);
      prompt.push('');
    }

    return prompt.join('\n');
  }

  /**
   * プロンプトをファイルに保存
   */
  savePromptToFile(prompt, filename) {
    const outputDir = path.join(this.projectRoot, 'tmp', 'copilot-prompts');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    const outputPath = path.join(outputDir, filename);
    fs.writeFileSync(outputPath, prompt, 'utf8');
    return outputPath;
  }

  /**
   * ブラウザでGitHub Copilot Chatを開く
   */
  async openCopilotChat(repoUrl = null) {
    if (!repoUrl) {
      try {
        const { stdout } = await execAsync('git remote get-url origin');
        repoUrl = stdout.trim().replace('.git', '').replace('git@github.com:', 'https://github.com/');
      } catch (error) {
        console.warn('Could not determine repository URL');
        return false;
      }
    }

    const chatUrl = `${repoUrl}?tab=copilot-chat`;
    
    try {
      // プラットフォームに応じてブラウザを開く
      const platform = process.platform;
      const command = platform === 'darwin' ? 'open' : platform === 'win32' ? 'start' : 'xdg-open';
      await execAsync(`${command} "${chatUrl}"`);
      console.log(`GitHub Copilot Chat opened: ${chatUrl}`);
      return true;
    } catch (error) {
      console.error('Failed to open browser:', error.message);
      console.log(`Please manually open: ${chatUrl}`);
      return false;
    }
  }

  /**
   * 指示ファイルの内容を実行
   */
  async executeInstructions(instructions) {
    const { metadata = {}, context = {}, instructions: instructionList = [] } = instructions;
    
    console.log(`Executing Copilot instruction set: ${metadata.name || 'Unnamed'}`);
    if (metadata.description) {
      console.log(`Description: ${metadata.description}`);
    }
    console.log('');

    const projectContext = this.generateProjectContext();
    const results = [];
    
    for (const [index, instruction] of instructionList.entries()) {
      const { type, title = `Task ${index + 1}` } = instruction;
      
      console.log(`--- ${index + 1}. ${title} ---`);
      
      // プロンプト生成
      const prompt = this.generateCopilotPrompt(instruction, projectContext);
      
      // プロンプトをファイルに保存
      const filename = `${type}_${index + 1}.md`;
      const promptPath = this.savePromptToFile(prompt, filename);
      
      console.log(`Generated prompt: ${promptPath}`);
      console.log('');
      console.log('=== COPILOT PROMPT ===');
      console.log(prompt);
      console.log('=== END PROMPT ===');
      console.log('');
      
      results.push({
        type,
        title,
        promptPath,
        instruction
      });
      
      // 依存関係のチェック
      if (instruction.dependsOn && instruction.dependsOn.length > 0) {
        console.log(`Dependencies: ${instruction.dependsOn.join(', ')}`);
        console.log('Make sure to complete dependent tasks first.');
        console.log('');
      }
    }
    
    return results;
  }

  /**
   * 使用方法を表示
   */
  showUsage() {
    console.log('GitHub Copilot CLI Executor');
    console.log('=========================');
    console.log('');
    console.log('Usage:');
    console.log('  node copilot-cli.js <instruction-file> [options]');
    console.log('');
    console.log('Options:');
    console.log('  --open-chat    Open GitHub Copilot Chat in browser');
    console.log('  --help         Show this help message');
    console.log('');
    console.log('Examples:');
    console.log('  node copilot-cli.js copilot-instructions/generate-component.json');
    console.log('  node copilot-cli.js copilot-instructions/project-review.json --open-chat');
    console.log('');
    console.log('Available instruction files:');
    
    const instructionsDir = path.join(this.projectRoot, 'copilot-instructions');
    if (fs.existsSync(instructionsDir)) {
      const files = fs.readdirSync(instructionsDir)
        .filter(file => file.endsWith('.json'))
        .map(file => `  - ${file}`);
      console.log(files.join('\n'));
    } else {
      console.log('  No instruction files found in copilot-instructions/');
    }
  }

  /**
   * メインの実行関数
   */
  async run(instructionFilePath, options = {}) {
    try {
      if (!instructionFilePath || options.help) {
        this.showUsage();
        return;
      }
      
      const fullPath = path.isAbsolute(instructionFilePath) 
        ? instructionFilePath 
        : path.join(this.projectRoot, instructionFilePath);
      
      if (!fs.existsSync(fullPath)) {
        throw new Error(`Instruction file not found: ${fullPath}`);
      }
      
      const instructions = await this.loadInstructionFile(fullPath);
      const results = await this.executeInstructions(instructions);
      
      console.log('=== Execution Summary ===');
      console.log(`Generated ${results.length} prompts`);
      console.log('');
      
      // GitHub Copilot Chatを開く
      if (options.openChat) {
        console.log('Opening GitHub Copilot Chat...');
        await this.openCopilotChat();
      } else {
        console.log('Tips:');
        console.log('- Copy the generated prompts to GitHub Copilot Chat');
        console.log('- Use --open-chat option to automatically open Copilot Chat');
        console.log('- Keep relevant files open in your editor for better context');
      }
      
    } catch (error) {
      console.error('Error:', error.message);
      process.exit(1);
    }
  }
}

// CLI実行部分
if (require.main === module) {
  const args = process.argv.slice(2);
  const instructionFile = args.find(arg => !arg.startsWith('--'));
  const options = {
    openChat: args.includes('--open-chat'),
    help: args.includes('--help')
  };
  
  const executor = new CopilotCLIExecutor();
  executor.run(instructionFile, options);
}

module.exports = CopilotCLIExecutor;