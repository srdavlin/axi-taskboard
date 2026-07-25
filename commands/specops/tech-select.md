---
name: specops:tech-select
description: 技术选型，推荐技术栈，生成选型报告
argument-hint: "[--auto]"
allowed-tools:
  - Read
  - Bash
  - Write
  - Task
  - AskUserQuestion
---

<context>
**标志：**
- `--auto` — 自动模式。基于分析结果直接推荐技术栈

**输入：**
- 上游需求分析、竞品分析、功能分析结果
</context>

<objective>
通过技术选型流程：

**创建：**
- `.specops/tech-selection.md` — 技术选型报告
- `.specops/roadmap.md` — 实施路线图

**分析内容：**
- 技术栈推荐
- 方案对比
- 风险评估
- 实施计划

**此命令之后：** 可运行 `/specops:plan-phase` 开始执行。
</objective>

<execution_context>
@.opencode/skills/tech-selection/SKILL.md
</execution_context>

<process>
1. 接收所有上游分析结果
2. 调用 tech-selection skill 进行选型
3. 生成技术选型报告和路线图
4. 更新状态文件
</process>
