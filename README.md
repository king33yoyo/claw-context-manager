# Claw Context Manager

> OpenClaw 会话上下文管理工具 - 自动分析、压缩和同步会话记录

## 🎯 功能特性

- ✅ **智能分析** - 自动提取会话摘要、关键点、用户偏好和决策
- ✅ **会话压缩** - 智能压缩长会话，保留核心信息
- ✅ **记忆同步** - 将分析结果同步到记忆系统（MEMORY.md）
- ✅ **模式识别** - 识别使用模式，帮助更好地理解用户习惯
- ✅ **CLI 工具** - 提供命令行接口，方便集成到工作流

## 📦 安装

```bash
npm install -g claw-context-manager
```

或本地安装：

```bash
git clone https://github.com/king33yoyo/claw-context-manager.git
cd claw-context-manager
npm install
npm run build
npm link
```

## 🚀 使用方法

### 分析会话

```bash
claw-context analyze -f session.json
```

### 压缩会话

```bash
claw-context compress -i session.json -o compressed.json --max 50
```

### 同步到记忆系统

```bash
claw-context sync -f session.json --memory ~/clawd/MEMORY.md
```

## 📊 输出示例

```
🔍 分析会话记录...

📊 分析结果:

摘要:
  用户要求安装 Everything Claude Code，已经成功安装所有组件，包括11个专业代理、15+个命令、20+个技能等。随后要求创建一个新项目，选择了会话上下文管理工具。

关键点:
  1. 安装了 11 个专业代理
  2. 配置了 15+ 个斜杠命令
  3. 设置了 20+ 个技能
  4. 创建了 claw-context-manager 项目

用户偏好:
  - 喜欢使用中文交流
  - 优先使用自动化工具

重要决策:
  - 决定使用 Everything Claude Code
  - 采用手动安装方式
  - 创建会话管理工具

使用模式:
  - 频繁执行: 安装 (3次)
  - 频繁执行: 创建 (2次)
  - 频繁执行: GitHub (2次)
```

## 📝 会话文件格式

```json
[
  {
    "role": "system",
    "content": "系统提示内容",
    "timestamp": "2026-01-31T21:30:00Z"
  },
  {
    "role": "user",
    "content": "用户消息",
    "timestamp": "2026-01-31T21:30:15Z"
  },
  {
    "role": "assistant",
    "content": "助手回复",
    "timestamp": "2026-01-31T21:30:20Z"
  }
]
```

## 🔧 开发

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 构建
npm run build

# 测试
npm run test
```

## 📝 API 使用

```typescript
import { SessionAnalyzer, MemorySync } from 'claw-context-manager';

// 分析会话
const analyzer = new SessionAnalyzer();
const context = analyzer.analyze(messages);

console.log('摘要:', context.summary);
console.log('关键点:', context.keyPoints);
console.log('用户偏好:', context.userPreferences);
console.log('决策:', context.decisions);

// 压缩会话
const compressed = analyzer.compress(messages, 50);

// 同步到记忆系统
const sync = new MemorySync();
const entry = sync.contextToMemory(context);
const markdown = sync.toMarkdown(entry);
```

## 🎯 为什么这个工具有用？

### 对 AI 助理的帮助

1. **理解用户习惯** - 通过分析历史会话，提取用户的偏好和习惯
2. **维护记忆系统** - 自动同步重要信息到 MEMORY.md
3. **优化 token 使用** - 压缩长会话，保留核心信息
4. **模式识别** - 识别重复任务和使用模式，优化工作流

### 对用户的帮助

1. **会话归档** - 自动归档重要会话内容
2. **快速检索** - 通过标签和摘要快速查找历史内容
3. **决策追踪** - 记录重要的决策和变更
4. **持续改进** - 帮助 AI 助理更好地理解用户，提供更个性化的服务

## 🤝 贡献

欢迎贡献！请提交 Issue 或 Pull Request。

## 📄 许可证

MIT License

## 🙏 致谢

- 感谢 [Everything Claude Code](https://github.com/affaan-m/everything-claude-code) 项目提供灵感和最佳实践
- 感谢 OpenClaw 社区

## 🔗 相关项目

- [Everything Claude Code](https://github.com/affaan-m/everything-claude-code) - Claude Code 配置集合
- [OpenClaw](https://github.com/openclaw/openclaw) - AI 助理框架

---

**作者:** Happy AI Assistant
**项目:** https://github.com/king33yoyo/claw-context-manager
**Star:** ⭐ 如果这个工具有用，请给个星！
