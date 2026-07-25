---
name: specops:quick
description: 使用 SpecOps 保障执行快速任务（原子提交、状态追踪）但跳过可选 agent
argument-hint: "[--full]"
allowed-tools:
  - Read
  - Write
  - Edit
  - Glob
  - Grep
  - Bash
  - Task
  - AskUserQuestion
---
<objective>
执行小型临时任务，带有 SpecOps 保障（原子提交、STATE.md 追踪）。

快速模式是相同系统的简短路径：
- 生成 specops-planner（快速模式）+ specops-executor
- 快速任务存放在 `.planning/quick/` 中，与规划阶段分开
- 更新 STATE.md "快速任务完成" 表格（不是 ROADMAP.md）

**默认：** 跳过研究、计划检查器、验证器。适用于你明确知道要做什么的场景。

**`--full` 标志：** 启用计划检查（最多 2 次迭代）和执行后验证。适用于想要质量保障但不需要完整里程碑流程的场景。
</objective>

<execution_context>
@.opencode/workflows/quick.md
</execution_context>

<context>
$ARGUMENTS

上下文文件在工作流内部通过 `init quick` 解析，并通过 `<files_to_read>` 块委托。
</context>

<process>
端到端执行 @.opencode/workflows/quick.md 中的快速工作流。
保留所有工作流门控（验证、任务描述、规划、执行、状态更新、提交）。
</process>
