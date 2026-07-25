---
name: specops:remove-phase
description: 从路线图中移除未来阶段并重新编号后续阶段
argument-hint: <phase-number>
allowed-tools:
  - Read
  - Write
  - Bash
  - Glob
---
<objective>
从路线图中移除一个未开始的未来阶段，并重新编号所有后续阶段以保持干净的线性序列。

目的：干净地移除你决定不做的工作，不会用取消/延迟标记污染上下文。
输出：阶段已删除，所有后续阶段已重新编号，git 提交作为历史记录。
</objective>

<execution_context>
@.opencode/workflows/remove-phase.md
</execution_context>

<context>
阶段：$ARGUMENTS

路线图和状态在工作流中通过 `init phase-op` 和定向读取解析。
</context>

<process>
端到端执行 @.opencode/workflows/remove-phase.md 中的 remove-phase 工作流。
保留所有验证门控（未来阶段检查、工作检查）、重新编号逻辑和提交。
</process>
