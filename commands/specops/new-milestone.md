---
name: specops:new-milestone
description: 开始新的里程碑周期——更新 PROJECT.md 并路由到需求定义
argument-hint: "[milestone name, e.g., 'v1.1 Notifications']"
allowed-tools:
  - Read
  - Write
  - Bash
  - Task
  - AskUserQuestion
---
<objective>
开始新的里程碑：提问 → 研究（可选）→ 需求 → 路线图。

new-project 的棕地等价物。项目已存在，PROJECT.md 有历史记录。收集"下一步做什么"，更新 PROJECT.md，然后运行需求 → 路线图周期。

**创建/更新：**
- `.planning/PROJECT.md` — 更新为新里程碑目标
- `.planning/research/` — 领域研究（可选，仅新功能）
- `.planning/REQUIREMENTS.md` — 此里程碑的范围化需求
- `.planning/ROADMAP.md` — 阶段结构（继续编号）
- `.planning/STATE.md` — 为新里程碑重置

**之后：** `/specops:plan-phase [N]` 开始执行。
</objective>

<execution_context>
@.opencode/workflows/new-milestone.md
@.opencode/references/questioning.md
@.opencode/references/ui-brand.md
@.opencode/templates/project.md
@.opencode/templates/requirements.md
</execution_context>

<context>
里程碑名称：$ARGUMENTS（可选 - 未提供时会提示）

项目和里程碑上下文文件在工作流内部解析（`init new-milestone`），并通过 `<files_to_read>` 块委托给子代理。
</context>

<process>
端到端执行 @.opencode/workflows/new-milestone.md 中的 new-milestone 工作流。
保留所有工作流门控（验证、提问、研究、需求、路线图审批、提交）。
</process>
