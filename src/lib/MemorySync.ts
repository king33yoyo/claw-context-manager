/**
 * 记忆同步器 - 将分析结果同步到记忆系统
 */
import { SessionContext } from './SessionAnalyzer.js';

export interface MemoryEntry {
  date: string;
  summary: string;
  keyPoints: string[];
  tags: string[];
}

export interface SyncOptions {
  memoryPath?: string;
  dateFormat?: string;
}

export class MemorySync {
  private options: SyncOptions;

  constructor(options: SyncOptions = {}) {
    this.options = {
      memoryPath: '~/clawd/memory',
      dateFormat: 'YYYY-MM-DD',
      ...options
    };
  }

  /**
   * 将分析结果转换为记忆条目
   */
  contextToMemory(context: SessionContext): MemoryEntry {
    const today = new Date().toISOString().split('T')[0];
    const tags = this.generateTags(context);

    return {
      date: today,
      summary: context.summary,
      keyPoints: context.keyPoints,
      tags
    };
  }

  /**
   * 生成标签
   */
  private generateTags(context: SessionContext): string[] {
    const tags: string[] = [];

    // 根据内容生成标签
    const content = context.summary.toLowerCase();

    if (content.includes('github') || content.includes('git')) {
      tags.push('github', 'git');
    }
    if (content.includes('安装') || content.includes('install')) {
      tags.push('install');
    }
    if (content.includes('删除') || content.includes('delete')) {
      tags.push('delete');
    }
    if (content.includes('搜索') || content.includes('search')) {
      tags.push('search');
    }
    if (content.includes('创建') || content.includes('create')) {
      tags.push('create');
    }

    return tags;
  }

  /**
   * 生成 Markdown 格式的记忆条目
   */
  toMarkdown(entry: MemoryEntry): string {
    let md = `## ${entry.date} - 会话记录\n\n`;
    md += `**标签**: ${entry.tags.join(', ') || '无'}\n\n`;
    md += `### 摘要\n\n${entry.summary}\n\n`;

    if (entry.keyPoints.length > 0) {
      md += `### 关键点\n\n`;
      entry.keyPoints.forEach(point => {
        md += `- ${point}\n`;
      });
      md += '\n';
    }

    md += `---\n\n`;

    return md;
  }

  /**
   * 保存到记忆文件
   */
  async saveToMemory(entry: MemoryEntry): Promise<string> {
    const filename = `${entry.date}.md`;
    const content = this.toMarkdown(entry);

    // 这里需要实际的文件系统操作
    // 为了演示，返回文件路径
    return `${this.options.memoryPath}/${filename}`;
  }

  /**
   * 追加到 MEMORY.md
   */
  async appendToMemoryMd(context: SessionContext): Promise<string> {
    let md = '\n## 最新会话\n\n';
    md += `### 摘要\n${context.summary}\n\n`;

    if (context.userPreferences.length > 0) {
      md += `### 用户偏好\n`;
      context.userPreferences.forEach(pref => {
        md += `- ${pref}\n`;
      });
      md += '\n';
    }

    if (context.decisions.length > 0) {
      md += `### 重要决策\n`;
      context.decisions.forEach(dec => {
        md += `- ${dec}\n`;
      });
      md += '\n';
    }

    md += '---\n';

    return md;
  }
}
