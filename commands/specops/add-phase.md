---
name: specops:add-phase
description: 在路线图中当前里程碑的末尾添加阶段
argument-hint: <description>
allowed-tools:
  - Read
  - Write
  - Bash
---

<objective>
在路线图中当前里程碑的末尾添加一个新的整数阶段。

路由到 add-phase 工作流，该工作流处理：
- 阶段编号计算（下一个顺序整数）
- 目录创建及 slug 生成
- 路线图结构更新
- STATE.md 路线图演进追踪
</objective>

<execution_context>
@.opencode/workflows/add-phase.md
</execution_context>

<context>
参数：$ARGUMENTS（阶段描述）

路线图和状态在工作流中通过 `init phase-op` 和定向工具调用解析。
</context>

<process>
**遵循 add-phase 工作流**，来自 `@.opencode/workflows/add-phase.md`。

该工作流处理所有逻辑，包括：
1. 参数解析和验证
2. 路线图存在性检查
3. 当前里程碑识别
4. 下一个阶段编号计算（忽略小数）
5. 从描述生成 slug
6. 阶段目录创建
7. 路线图条目插入
8. STATE.md 更新
</process>
