#!/usr/bin/env node
/**
 * Claw Context Manager CLI
 */
import { Command } from 'commander';
import chalk from 'chalk';
import { SessionAnalyzer, SessionMessage } from '../lib/SessionAnalyzer.js';
import { MemorySync } from '../lib/MemorySync.js';

const program = new Command();

program
  .name('claw-context')
  .description('OpenClaw 会话上下文管理工具')
  .version('1.0.0');

// 分析命令
program
  .command('analyze')
  .description('分析会话记录')
  .option('-f, --file <path>', '会话文件路径')
  .option('--compress', '压缩会话')
  .option('--max <number>', '压缩后最大消息数', '50')
  .action(async (options) => {
    console.log(chalk.blue('🔍 分析会话记录...\n'));

    if (options.file) {
      // 从文件读取会话
      const messages = await loadSessionFile(options.file);
      const analyzer = new SessionAnalyzer();

      console.log(chalk.yellow('📊 分析结果:\n'));
      const context = analyzer.analyze(messages);

      console.log(chalk.bold('摘要:'));
      console.log(`  ${context.summary}\n`);

      console.log(chalk.bold('关键点:'));
      context.keyPoints.forEach((point, i) => {
        console.log(`  ${i + 1}. ${point}`);
      });

      if (context.userPreferences.length > 0) {
        console.log(chalk.bold('\n用户偏好:'));
        context.userPreferences.forEach(pref => {
          console.log(`  - ${pref}`);
        });
      }

      if (context.decisions.length > 0) {
        console.log(chalk.bold('\n重要决策:'));
        context.decisions.forEach(dec => {
          console.log(`  - ${dec}`);
        });
      }

      if (context.patterns.length > 0) {
        console.log(chalk.bold('\n使用模式:'));
        context.patterns.forEach(pattern => {
          console.log(`  - ${pattern}`);
        });
      }

      if (options.compress) {
        const maxMessages = parseInt(options.max);
        const compressed = analyzer.compress(messages, maxMessages);
        console.log(chalk.green(`\n✅ 会话已压缩: ${messages.length} → ${compressed.length} 条消息`));
      }
    } else {
      console.log(chalk.red('❌ 请使用 -f 指定会话文件路径'));
    }
  });

// 同步命令
program
  .command('sync')
  .description('同步分析结果到记忆系统')
  .option('-f, --file <path>', '会话文件路径')
  .option('--memory <path>', '记忆文件路径', '~/clawd/MEMORY.md')
  .action(async (options) => {
    console.log(chalk.blue('🔄 同步到记忆系统...\n'));

    if (options.file) {
      const messages = await loadSessionFile(options.file);
      const analyzer = new SessionAnalyzer();
      const sync = new MemorySync();

      const context = analyzer.analyze(messages);
      const entry = sync.contextToMemory(context);

      console.log(chalk.yellow('📝 记忆条目:\n'));
      console.log(entry.summary);
      console.log(chalk.green('\n✅ 准备同步到记忆系统'));
      console.log(chalk.gray(`   标签: ${entry.tags.join(', ') || '无'}`));
    } else {
      console.log(chalk.red('❌ 请使用 -f 指定会话文件路径'));
    }
  });

// 压缩命令
program
  .command('compress')
  .description('压缩会话记录')
  .option('-i, --input <path>', '输入会话文件路径')
  .option('-o, --output <path>', '输出文件路径')
  .option('--max <number>', '压缩后最大消息数', '50')
  .action(async (options) => {
    console.log(chalk.blue('🗜️  压缩会话记录...\n'));

    if (options.input) {
      const messages = await loadSessionFile(options.input);
      const analyzer = new SessionAnalyzer();
      const maxMessages = parseInt(options.max);

      const compressed = analyzer.compress(messages, maxMessages);

      console.log(chalk.green(`✅ 压缩完成: ${messages.length} → ${compressed.length} 条消息`));

      if (options.output) {
        // 保存到文件
        console.log(chalk.gray(`   输出文件: ${options.output}`));
      }
    } else {
      console.log(chalk.red('❌ 请使用 -i 指定输入文件路径'));
    }
  });

/**
 * 加载会话文件（模拟）
 */
async function loadSessionFile(path: string): Promise<SessionMessage[]> {
  // 这里应该是实际的文件读取逻辑
  // 为了演示，返回示例会话
  return [
    {
      role: 'system',
      content: '你是一个AI助手，帮助用户完成各种任务。'
    },
    {
      role: 'user',
      content: '好的主人，帮我安装 Everything Claude Code'
    },
    {
      role: 'assistant',
      content: '好的主人！让我先检查你的系统上是否安装了 Claude Code。'
    }
  ];
}

program.parse();
