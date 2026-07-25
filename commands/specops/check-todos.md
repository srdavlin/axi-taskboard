---
name: specops:check-todos
description: 列出待处理的待办事项并选择一个来处理
argument-hint: [area filter]
allowed-tools:
  - Read
  - Write
  - Bash
  - AskUserQuestion
---

<objective>
列出所有待处理的待办事项，允许选择，加载所选待办的完整上下文，并路由到适当的操作。

路由到 check-todos 工作流，该工作流处理：
- 待办计数和列表（带领域过滤）
- 交互式选择及完整上下文加载
- 路线图关联检查
- 操作路由（立即处理、添加到阶段、头脑风暴、创建阶段）
- STATE.md 更新和 git 提交
</objective>

<execution_context>
@.opencode/workflows/check-todos.md
</execution_context>

<context>
参数：$ARGUMENTS（可选的领域过滤器）

待办状态和路线图关联在工作流中通过 `init todos` 和定向读取加载。
</context>

<process>
**遵循 check-todos 工作流**，来自 `@.opencode/workflows/check-todos.md`。

该工作流处理所有逻辑，包括：
1. 待办存在性检查
2. 领域过滤
3. 交互式列表和选择
4. 完整上下文加载及文件摘要
5. 路线图关联检查
6. 操作提供和执行
7. STATE.md 更新
8. Git 提交
</process>
