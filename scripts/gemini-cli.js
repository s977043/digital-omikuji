#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

/**
 * Gemini CLI ファイル指示実行ツール
 * 指示ファイルを読み込んで、Gemini CLI コマンドを自動実行します
 */
class GeminiCLIExecutor {
  constructor() {
    this.projectRoot = process.cwd();
    this.configPath = path.join(this.projectRoot, '.geminirc.json');
    this.config = this.loadConfig();
  }

  /**
   * 設定ファイルを読み込み
   */
  loadConfig() {
    try {
      if (fs.existsSync(this.configPath)) {
        return JSON.parse(fs.readFileSync(this.configPath, 'utf8'));
      }
    } catch (error) {
      console.warn('Warning: Could not load .geminirc.json:', error.message);
    }
    return {};
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
   * Gemini CLI コマンドを実行
   */
  async executeGeminiCommand(command, options = {}) {
    try {
      console.log(`Executing: gemini ${command}`);
      const { stdout, stderr } = await execAsync(`gemini ${command}`, options);
      
      if (stderr) {
        console.warn('Warning:', stderr);
      }
      
      if (stdout) {
        console.log(stdout);
      }
      
      return { success: true, stdout, stderr };
    } catch (error) {
      console.error(`Failed to execute command: gemini ${command}`);
      console.error('Error:', error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * 指示ファイルの内容を実行
   */
  async executeInstructions(instructions) {
    const { metadata = {}, commands = [] } = instructions;
    
    console.log(`Executing instruction set: ${metadata.name || 'Unnamed'}`);
    if (metadata.description) {
      console.log(`Description: ${metadata.description}`);
    }

    const results = [];
    
    for (const instruction of commands) {
      const { type, command, variables = {}, options = {} } = instruction;
      
      // 変数置換
      const processedCommand = this.replaceTemplateVariables(command, variables);
      
      console.log(`\n--- Executing instruction: ${type} ---`);
      
      const result = await this.executeGeminiCommand(processedCommand, options);
      results.push({
        type,
        command: processedCommand,
        result
      });
      
      // エラーハンドリング
      if (!result.success && instruction.required !== false) {
        console.error('Required command failed. Stopping execution.');
        break;
      }
      
      // 待機時間
      if (instruction.delay) {
        console.log(`Waiting ${instruction.delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, instruction.delay));
      }
    }
    
    return results;
  }

  /**
   * メインの実行関数
   */
  async run(instructionFilePath) {
    try {
      console.log('Gemini CLI File Instruction Executor');
      console.log('===================================');
      
      if (!instructionFilePath) {
        throw new Error('Instruction file path is required');
      }
      
      const fullPath = path.isAbsolute(instructionFilePath) 
        ? instructionFilePath 
        : path.join(this.projectRoot, instructionFilePath);
      
      if (!fs.existsSync(fullPath)) {
        throw new Error(`Instruction file not found: ${fullPath}`);
      }
      
      const instructions = await this.loadInstructionFile(fullPath);
      const results = await this.executeInstructions(instructions);
      
      console.log('\n=== Execution Summary ===');
      const successful = results.filter(r => r.result.success).length;
      const failed = results.filter(r => !r.result.success).length;
      
      console.log(`Total commands: ${results.length}`);
      console.log(`Successful: ${successful}`);
      console.log(`Failed: ${failed}`);
      
      if (failed > 0) {
        process.exit(1);
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
  const instructionFile = args[0];
  
  if (!instructionFile) {
    console.log('Usage: node gemini-cli.js <instruction-file>');
    console.log('');
    console.log('Example:');
    console.log('  node gemini-cli.js instructions/generate-component.json');
    process.exit(1);
  }
  
  const executor = new GeminiCLIExecutor();
  executor.run(instructionFile);
}

module.exports = GeminiCLIExecutor;