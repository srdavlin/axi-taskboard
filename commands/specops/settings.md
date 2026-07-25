---
name: specops:settings
description: 配置 SpecOps 工作流开关和模型配置
allowed-tools:
  - Read
  - Write
  - Bash
  - AskUserQuestion
---

<objective>
通过多问题提示交互式配置 SpecOps 工作流代理和模型配置。

路由到 settings 工作流，该工作流处理：
- 配置存在性确保
- 当前设置读取和解析
- 交互式 5 问提示（模型、研究、计划检查、验证器、分支策略）
- 配置合并和写入
- 确认显示及快速命令参考
</objective>

<execution_context>
@.opencode/workflows/settings.md
</execution_context>

<process>
**遵循 settings 工作流**，来自 `@.opencode/workflows/settings.md`。

该工作流处理所有逻辑，包括：
1. 配置文件缺失时使用默认值创建
2. 当前配置读取
3. 交互式设置展示及预选
4. 答案解析和配置合并
5. 文件写入
6. 确认显示
</process>
