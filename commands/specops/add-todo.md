---
name: specops:add-todo
description: 从当前对话上下文中捕获想法或任务作为待办事项
argument-hint: [optional description]
allowed-tools:
  - Read
  - Write
  - Bash
  - AskUserQuestion
---

<objective>
将 SpecOps 会话中浮现的想法、任务或问题捕获为结构化的待办事项，供后续处理。

路由到 add-todo 工作流，该工作流处理：
- 目录结构创建
- 从参数或对话中提取内容
- 从文件路径推断领域
- 重复检测和解决
- 创建带 frontmatter 的待办文件
- STATE.md 更新
- Git 提交
</objective>

<execution_context>
@.opencode/workflows/add-todo.md
</execution_context>

<context>
参数：$ARGUMENTS（可选的待办描述）

状态在工作流中通过 `init todos` 和定向读取解析。
</context>

<process>
**遵循 add-todo 工作流**，来自 `@.opencode/workflows/add-todo.md`。

该工作流处理所有逻辑，包括：
1. 目录确保
2. 现有领域检查
3. 内容提取（参数或对话）
4. 领域推断
5. 重复检查
6. 文件创建及 slug 生成
7. STATE.md 更新
8. Git 提交
</process>
