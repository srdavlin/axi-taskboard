---
name: specops:new-project
description: 通过深度上下文收集和 PROJECT.md 初始化新项目
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
- `--auto` — 自动模式。配置问题之后，无需进一步交互即运行研究 → 需求 → 路线图。期望通过 @ 引用提供想法文档。
</context>

<objective>
通过统一流程初始化新项目：提问 → 研究（可选）→ 需求 → 路线图。

**创建：**
- `.planning/PROJECT.md` — 项目上下文
- `.planning/config.json` — 工作流偏好
- `.planning/research/` — 领域研究（可选）
- `.planning/REQUIREMENTS.md` — 范围化需求
- `.planning/ROADMAP.md` — 阶段结构
- `.planning/STATE.md` — 项目记忆

**此命令之后：** 运行 `/specops:plan-phase 1` 开始执行。
</objective>

<execution_context>
@.opencode/workflows/new-project.md
@.opencode/references/questioning.md
@.opencode/references/ui-brand.md
@.opencode/templates/project.md
@.opencode/templates/requirements.md
</execution_context>

<process>
端到端执行 @.opencode/workflows/new-project.md 中的 new-project 工作流。
保留所有工作流门控（验证、审批、提交、路由）。
</process>
