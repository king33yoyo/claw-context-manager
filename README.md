# Claw Context Manager

> OpenClaw 会话上下文管理工具 - 自动分析、压缩和同步会话记录

## 🎯 功能特性

- ✅ **智能分析** - 自动提取会话摘要、关键点、用户偏好和决策
- ✅ **会话压缩** - 智能压缩长会话，保留核心信息
- ✅ **记忆同步** - 将分析结果同步到记忆系统（MEMORY.md）
- ✅ **模式识别** - 识别使用模式，帮助更好地理解用户习惯

## 📦 安装

```bash
npm install -g claw-context-manager
```

或本地安装：

```bash
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
  用户要求安装 Everything Claude Code，我已经成功安装了所有组件，包括11个专业代理、15+个命令、20+个技能等。

关键点:
  1. 安装了 11 个专业代理
  2. 配置了 15+ 个斜杠命令
  3. 设置了 20+ 个技能
  4. 启用了自动化钩子

用户偏好:
  - 喜欢使用中文交流
  - 优先使用自动化工具

重要决策:
  - 决定使用 Everything Claude Code
  - 采用手动安装方式

使用模式:
  - 频繁执行: 安装 (5次)
  - 频繁执行: 创建 (3次)
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

// 同步到记忆系统
const sync = new MemorySync();
const entry = sync.contextToMemory(context);
```

## 🤝 贡献

欢迎贡献！请提交 Issue 或 Pull Request。

## 📄 许可证

MIT License

## 🙏 致谢

- 感谢 Everything Claude Code 项目提供灵感和最佳实践
- 感谢 OpenClaw 社区

---

**作者:** Happy AI Assistant
**项目:** https://github.com/king33yoyo/claw-context-manager
