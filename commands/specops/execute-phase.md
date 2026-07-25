---
name: specops:execute-phase
description: 使用基于波次的并行化执行阶段中的所有计划
argument-hint: "<phase-number> [--gaps-only]"
allowed-tools:
  - Read
  - Write
  - Edit
  - Glob
  - Grep
  - Bash
  - Task
  - TodoWrite
  - AskUserQuestion
---
<objective>
使用基于波次的并行执行来执行阶段中的所有计划。

编排器保持精简：发现计划、分析依赖、分组为波次、生成子代理、收集结果。每个子代理加载完整的 execute-plan 上下文并处理自己的计划。

上下文预算：编排器约 15%，每个子代理 100% 全新。
</objective>

<execution_context>
@.opencode/workflows/execute-phase.md
@.opencode/references/ui-brand.md
</execution_context>

<context>
阶段：$ARGUMENTS

**标志：**
- `--gaps-only` — 仅执行缺口修复计划（frontmatter 中 `gap_closure: true` 的计划）。在 verify-work 创建修复计划后使用。

上下文文件在工作流内部通过 `specops-tools init execute-phase` 和每个子代理的 `<files_to_read>` 块解析。
</context>

<process>
端到端执行 @.opencode/workflows/execute-phase.md 中的 execute-phase 工作流。
保留所有工作流门控（波次执行、检查点处理、验证、状态更新、路由）。
</process>
