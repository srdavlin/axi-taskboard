---
name: specops:plan-milestone-gaps
description: 创建阶段以关闭里程碑审计中识别的所有缺口
allowed-tools:
  - Read
  - Write
  - Bash
  - Glob
  - Grep
  - AskUserQuestion
---
<objective>
创建关闭 `/specops:audit-milestone` 识别的缺口所需的所有阶段。

读取 MILESTONE-AUDIT.md，将缺口分组为逻辑阶段，在 ROADMAP.md 中创建阶段条目，并提供规划每个阶段的选项。

一个命令创建所有修复阶段——无需为每个缺口手动执行 `/specops:add-phase`。
</objective>

<execution_context>
@.opencode/workflows/plan-milestone-gaps.md
</execution_context>

<context>
**审计结果：**
Glob: .planning/v*-MILESTONE-AUDIT.md（使用最新的）

原始意图和当前规划状态在工作流内部按需加载。
</context>

<process>
端到端执行 @.opencode/workflows/plan-milestone-gaps.md 中的 plan-milestone-gaps 工作流。
保留所有工作流门控（审计加载、优先级排序、阶段分组、用户确认、路线图更新）。
</process>
