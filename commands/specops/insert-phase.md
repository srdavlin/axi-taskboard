---
name: specops:insert-phase
description: 将紧急工作作为小数阶段（如 72.1）插入到现有阶段之间
argument-hint: <after> <description>
allowed-tools:
  - Read
  - Write
  - Bash
---

<objective>
为里程碑中期发现的紧急工作插入一个小数阶段，该工作必须在现有整数阶段之间完成。

使用小数编号（72.1、72.2 等）来保留计划阶段的逻辑顺序，同时容纳紧急插入。

目的：处理执行期间发现的紧急工作，无需重新编号整个路线图。
</objective>

<execution_context>
@.opencode/workflows/insert-phase.md
</execution_context>

<context>
参数：$ARGUMENTS（格式：<after-phase-number> <description>）

路线图和状态在工作流中通过 `init phase-op` 和定向工具调用解析。
</context>

<process>
端到端执行 @.opencode/workflows/insert-phase.md 中的 insert-phase 工作流。
保留所有验证门控（参数解析、阶段验证、小数计算、路线图更新）。
</process>
