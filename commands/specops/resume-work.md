---
name: specops:resume-work
description: 从上一个会话恢复工作，完整恢复上下文
allowed-tools:
  - Read
  - Bash
  - Write
  - AskUserQuestion
  - SlashCommand
---

<objective>
恢复完整的项目上下文，从上一个会话无缝继续工作。

路由到 resume-project 工作流，该工作流处理：

- STATE.md 加载（或缺失时重建）
- 检查点检测（.continue-here 文件）
- 未完成工作检测（有 PLAN 但无 SUMMARY）
- 状态展示
- 上下文感知的下一步操作路由
  </objective>

<execution_context>
@.opencode/workflows/resume-project.md
</execution_context>

<process>
**遵循 resume-project 工作流**，来自 `@.opencode/workflows/resume-project.md`。

该工作流处理所有恢复逻辑，包括：

1. 项目存在性验证
2. STATE.md 加载或重建
3. 检查点和未完成工作检测
4. 可视化状态展示
5. 上下文感知的选项提供（在建议 plan 还是 discuss 之前检查 CONTEXT.md）
6. 路由到适当的下一个命令
7. 会话连续性更新
   </process>
