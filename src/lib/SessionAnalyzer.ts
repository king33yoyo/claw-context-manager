/**
 * 会话分析器 - 分析会话内容并提取关键信息
 */
export interface SessionMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: string;
}

export interface SessionContext {
  summary: string;
  keyPoints: string[];
  userPreferences: string[];
  decisions: string[];
  patterns: string[];
}

export interface AnalysisOptions {
  maxSummaryLength?: number;
  includeTimestamps?: boolean;
}

export class SessionAnalyzer {
  private options: AnalysisOptions;

  constructor(options: AnalysisOptions = {}) {
    this.options = {
      maxSummaryLength: 500,
      includeTimestamps: false,
      ...options
    };
  }

  /**
   * 分析整个会话
   */
  analyze(messages: SessionMessage[]): SessionContext {
    const assistantMessages = messages.filter(m => m.role === 'assistant');
    const userMessages = messages.filter(m => m.role === 'user');

    return {
      summary: this.generateSummary(messages),
      keyPoints: this.extractKeyPoints(assistantMessages),
      userPreferences: this.extractUserPreferences(userMessages),
      decisions: this.extractDecisions(messages),
      patterns: this.extractPatterns(messages)
    };
  }

  /**
   * 生成会话摘要
   */
  private generateSummary(messages: SessionMessage[]): string {
    const allContent = messages.map(m => m.content).join(' ');
    const sentences = allContent.match(/[^.!?。！？]+[.!?。！？]*/g) || [];
    const summarySentences = sentences.slice(0, 3).join(' ');

    return summarySentences.substring(0, this.options.maxSummaryLength || 500);
  }

  /**
   * 提取关键点
   */
  private extractKeyPoints(messages: SessionMessage[]): string[] {
    const keyPoints: string[] = [];

    messages.forEach(msg => {
      // 提取列表项
      const bullets = msg.content.match(/[-•*]\s+(.+)/g);
      if (bullets) {
        keyPoints.push(...bullets.map(b => b.replace(/[-•*]\s+/, '')));
      }

      // 提取重要标记
      const important = msg.content.match(/[✓✅✓️❗❕](.+)/g);
      if (important) {
        keyPoints.push(...important.map(i => i.replace(/[✓✅✓️❗❕]/, '').trim()));
      }
    });

    return keyPoints.slice(0, 10);
  }

  /**
   * 提取用户偏好
   */
  private extractUserPreferences(messages: SessionMessage[]): string[] {
    const preferences: string[] = [];
    const patterns = [
      /我喜欢|I like|我偏好|I prefer|我喜欢用|prefer/gi,
      /习惯用|usually|normally|typically/gi,
      /最好用|better to|prefer to use/gi
    ];

    messages.forEach(msg => {
      patterns.forEach(pattern => {
        const matches = msg.content.match(pattern);
        if (matches) {
          preferences.push(...matches);
        }
      });
    });

    return preferences;
  }

  /**
   * 提取决策
   */
  private extractDecisions(messages: SessionMessage[]): string[] {
    const decisions: string[] = [];
    const patterns = [
      /决定|decided|决定用|decided to use|选择|chose/gi,
      /最终|finally|最终选择|finally chose/gi,
      /采用|adopted|使用|using/gi
    ];

    messages.forEach(msg => {
      patterns.forEach(pattern => {
        const matches = msg.content.match(pattern);
        if (matches) {
          decisions.push(...matches);
        }
      });
    });

    return decisions;
  }

  /**
   * 提取模式
   */
  private extractPatterns(messages: SessionMessage[]): string[] {
    const patterns: string[] = [];

    // 检测重复任务
    const taskKeywords = ['下载', '创建', '删除', '安装', '更新', 'search', 'download', 'create', 'delete'];
    const taskFrequency = new Map<string, number>();

    messages.forEach(msg => {
      taskKeywords.forEach(keyword => {
        const regex = new RegExp(keyword, 'gi');
        const matches = msg.content.match(regex);
        if (matches) {
          taskFrequency.set(keyword, (taskFrequency.get(keyword) || 0) + matches.length);
        }
      });
    });

    // 提取高频任务
    taskFrequency.forEach((count, task) => {
      if (count > 2) {
        patterns.push(`频繁执行: ${task} (${count}次)`);
      }
    });

    return patterns;
  }

  /**
   * 压缩会话 - 返回精简版本
   */
  compress(messages: SessionMessage[], maxMessages = 50): SessionMessage[] {
    // 保留系统消息
    const systemMessages = messages.filter(m => m.role === 'system');

    // 压缩用户和助手消息
    const otherMessages = messages.filter(m => m.role !== 'system');

    // 智能采样：保留首尾，中间均匀采样
    if (otherMessages.length <= maxMessages) {
      return messages;
    }

    const keepFirst = 10;
    const keepLast = 10;
    const middleSample = maxMessages - keepFirst - keepLast;

    const firstPart = otherMessages.slice(0, keepFirst);
    const lastPart = otherMessages.slice(-keepLast);
    const middlePart = this.sampleMiddle(otherMessages.slice(keepFirst, -keepLast), middleSample);

    return [...systemMessages, ...firstPart, ...middlePart, ...lastPart];
  }

  private sampleMiddle(messages: SessionMessage[], sampleSize: number): SessionMessage[] {
    if (sampleSize <= 0 || messages.length === 0) return [];

    const step = Math.max(1, Math.floor(messages.length / sampleSize));
    const sampled: SessionMessage[] = [];

    for (let i = 0; i < messages.length && sampled.length < sampleSize; i += step) {
      sampled.push(messages[i]);
    }

    return sampled;
  }
}
