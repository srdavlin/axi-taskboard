---
name: specops:debug
description: 跨上下文重置的系统化调试，带持久状态
argument-hint: [issue description]
allowed-tools:
  - Read
  - Bash
  - Task
  - AskUserQuestion
---

<objective>
使用科学方法和子代理隔离来调试问题。

**编排器角色：** 收集症状，生成 specops-debugger 代理，处理检查点，生成后续代理。

**为什么用子代理：** 调查会快速消耗上下文（读取文件、形成假设、测试）。每次调查都有全新的 200k 上下文。主上下文保持精简以便用户交互。
</objective>

<context>
用户的问题：$ARGUMENTS

检查活跃会话：
```bash
ls .planning/debug/*.md 2>/dev/null | grep -v resolved | head -5
```
</context>

<process>

## 0. 初始化上下文

```bash
INIT=$(node .opencode/bin/specops-tools.cjs state load)
```

从初始化 JSON 中提取 `commit_docs`。解析调试器模型：
```bash
DEBUGGER_MODEL=$(node .opencode/bin/specops-tools.cjs resolve-model specops-debugger --raw)
```

## 1. 检查活跃会话

如果存在活跃会话且没有 $ARGUMENTS：
- 列出会话及状态、假设、下一步操作
- 用户选择编号恢复或描述新问题

如果提供了 $ARGUMENTS 或用户描述了新问题：
- 继续到症状收集

## 2. 收集症状（如果是新问题）

使用 AskUserQuestion 逐一询问：

1. **预期行为** - 应该发生什么？
2. **实际行为** - 实际发生了什么？
3. **错误消息** - 有错误吗？（粘贴或描述）
4. **时间线** - 什么时候开始的？之前正常过吗？
5. **复现方式** - 如何触发？

全部收集后，确认准备开始调查。

## 3. 生成 specops-debugger 代理

填充提示并生成：

```markdown
<objective>
Investigate issue: {slug}

**Summary:** {trigger}
</objective>

<symptoms>
expected: {expected}
actual: {actual}
errors: {errors}
reproduction: {reproduction}
timeline: {timeline}
</symptoms>

<mode>
symptoms_prefilled: true
goal: find_and_fix
</mode>

<debug_file>
Create: .planning/debug/{slug}.md
</debug_file>
```

```
Task(
  prompt=filled_prompt,
  subagent_type="specops-debugger",
  model="{debugger_model}",
  description="Debug {slug}"
)
```

## 4. 处理代理返回

**如果 `## ROOT CAUSE FOUND`：**
- 显示根本原因和证据摘要
- 提供选项：
  - "立即修复" - 生成修复子代理
  - "计划修复" - 建议 /specops:plan-phase --gaps
  - "手动修复" - 完成

**如果 `## CHECKPOINT REACHED`：**
- 向用户展示检查点详情
- 获取用户响应
- 如果检查点类型是 `human-verify`：
  - 如果用户确认已修复：继续让代理完成/解决/归档
  - 如果用户报告问题：继续让代理返回调查/修复
- 生成后续代理（见步骤 5）

**如果 `## INVESTIGATION INCONCLUSIVE`：**
- 显示已检查和排除的内容
- 提供选项：
  - "继续调查" - 生成带额外上下文的新代理
  - "手动调查" - 完成
  - "添加更多上下文" - 收集更多症状，再次生成

## 5. 生成后续代理（检查点之后）

当用户响应检查点时，生成新代理：

```markdown
<objective>
Continue debugging {slug}. Evidence is in the debug file.
</objective>

<prior_state>
<files_to_read>
- .planning/debug/{slug}.md (Debug session state)
</files_to_read>
</prior_state>

<checkpoint_response>
**Type:** {checkpoint_type}
**Response:** {user_response}
</checkpoint_response>

<mode>
goal: find_and_fix
</mode>
```

```
Task(
  prompt=continuation_prompt,
  subagent_type="specops-debugger",
  model="{debugger_model}",
  description="Continue debug {slug}"
)
```

</process>

<success_criteria>
- [ ] 已检查活跃会话
- [ ] 已收集症状（如果是新问题）
- [ ] 已生成带上下文的 specops-debugger
- [ ] 正确处理检查点
- [ ] 修复前确认根本原因
</success_criteria>
