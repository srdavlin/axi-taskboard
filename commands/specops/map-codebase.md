---
name: specops:map-codebase
description: 使用并行映射代理分析代码库，生成 .planning/codebase/ 文档
argument-hint: "[optional: specific area to map, e.g., 'api' or 'auth']"
allowed-tools:
  - Read
  - Bash
  - Glob
  - Grep
  - Write
  - Task
---

<objective>
使用并行的 specops-codebase-mapper 代理分析现有代码库，生成结构化的代码库文档。

每个映射代理探索一个焦点领域并**直接将文档写入** `.planning/codebase/`。编排器只接收确认信息，保持上下文使用最小化。

输出：.planning/codebase/ 文件夹，包含 7 个关于代码库状态的结构化文档。
</objective>

<execution_context>
@.opencode/workflows/map-codebase.md
</execution_context>

<context>
焦点领域：$ARGUMENTS（可选 - 如果提供，告诉代理聚焦于特定子系统）

**如果存在则加载项目状态：**
检查 .planning/STATE.md - 如果项目已初始化则加载上下文

**此命令可以运行于：**
- `/specops:new-project` 之前（棕地代码库）- 先创建代码库映射
- `/specops:new-project` 之后（绿地代码库）- 随代码演进更新代码库映射
- 任何时候刷新代码库理解
</context>

<when_to_use>
**使用 map-codebase 的场景：**
- 初始化前的棕地项目（先理解现有代码）
- 重大变更后刷新代码库映射
- 入门不熟悉的代码库
- 重大重构前（理解当前状态）
- 当 STATE.md 引用过时的代码库信息时

**跳过 map-codebase 的场景：**
- 还没有代码的绿地项目（没什么可映射的）
- 简单的代码库（<5 个文件）
</when_to_use>

<process>
1. 检查 .planning/codebase/ 是否已存在（提供刷新或跳过选项）
2. 创建 .planning/codebase/ 目录结构
3. 生成 4 个并行的 specops-codebase-mapper 代理：
   - 代理 1：tech 焦点 → 写入 STACK.md、INTEGRATIONS.md
   - 代理 2：arch 焦点 → 写入 ARCHITECTURE.md、STRUCTURE.md
   - 代理 3：quality 焦点 → 写入 CONVENTIONS.md、TESTING.md
   - 代理 4：concerns 焦点 → 写入 CONCERNS.md
4. 等待代理完成，收集确认（不是文档内容）
5. 验证所有 7 个文档存在并统计行数
6. 提交代码库映射
7. 提供后续步骤（通常：/specops:new-project 或 /specops:plan-phase）
</process>

<success_criteria>
- [ ] .planning/codebase/ 目录已创建
- [ ] 所有 7 个代码库文档已由映射代理写入
- [ ] 文档遵循模板结构
- [ ] 并行代理无错误完成
- [ ] 用户知道后续步骤
</success_criteria>
