---
name: specops:verify-work
description: 通过对话式 UAT 验证已构建的功能
argument-hint: "[phase number, e.g., '4']"
allowed-tools:
  - Read
  - Bash
  - Glob
  - Grep
  - Edit
  - Write
  - Task
---
<objective>
通过带持久状态的对话式测试验证已构建的功能。

目的：从用户视角确认 Claude 构建的内容确实可以工作。一次一个测试，纯文本响应，不做审讯。当发现问题时，自动诊断、规划修复并准备执行。

输出：{phase_num}-UAT.md 追踪所有测试结果。如果发现问题：已诊断的缺口，已验证的修复计划准备好供 /specops:execute-phase 执行
</objective>

<execution_context>
@.opencode/workflows/verify-work.md
@.opencode/templates/UAT.md
</execution_context>

<context>
阶段：$ARGUMENTS（可选）
- 如果提供：测试特定阶段（例如 "4"）
- 如果未提供：检查活跃会话或提示输入阶段

上下文文件在工作流内部解析（`init verify-work`），并通过 `<files_to_read>` 块委托。
</context>

<process>
端到端执行 @.opencode/workflows/verify-work.md 中的 verify-work 工作流。
保留所有工作流门控（会话管理、测试展示、诊断、修复规划、路由）。
</process>
