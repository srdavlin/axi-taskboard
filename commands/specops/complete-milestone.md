---
type: prompt
name: specops:complete-milestone
description: 归档已完成的里程碑并为下一个版本做准备
argument-hint: <version>
allowed-tools:
  - Read
  - Write
  - Bash
---

<objective>
将里程碑 {{version}} 标记为完成，归档到 milestones/，并更新 ROADMAP.md 和 REQUIREMENTS.md。

目的：创建已发布版本的历史记录，归档里程碑产物（路线图 + 需求），并为下一个里程碑做准备。
输出：里程碑已归档（路线图 + 需求），PROJECT.md 已演进，git 已打标签。
</objective>

<execution_context>
**立即加载这些文件（在继续之前）：**

- @.opencode/workflows/complete-milestone.md（主工作流）
- @.opencode/templates/milestone-archive.md（归档模板）
  </execution_context>

<context>
**项目文件：**
- `.planning/ROADMAP.md`
- `.planning/REQUIREMENTS.md`
- `.planning/STATE.md`
- `.planning/PROJECT.md`

**用户输入：**

- 版本：{{version}}（例如 "1.0"、"1.1"、"2.0"）
  </context>

<process>

**遵循 complete-milestone.md 工作流：**

0. **检查审计：**

   - 查找 `.planning/v{{version}}-MILESTONE-AUDIT.md`
   - 如果缺失或过期：建议先运行 `/specops:audit-milestone`
   - 如果审计状态为 `gaps_found`：建议先运行 `/specops:plan-milestone-gaps`
   - 如果审计状态为 `passed`：继续步骤 1

   ```markdown
   ## Pre-flight Check

   {If no v{{version}}-MILESTONE-AUDIT.md:}
   ⚠ No milestone audit found. Run `/specops:audit-milestone` first to verify
   requirements coverage, cross-phase integration, and E2E flows.

   {If audit has gaps:}
   ⚠ Milestone audit found gaps. Run `/specops:plan-milestone-gaps` to create
   phases that close the gaps, or proceed anyway to accept as tech debt.

   {If audit passed:}
   ✓ Milestone audit passed. Proceeding with completion.
   ```

1. **验证就绪状态：**

   - 检查里程碑中所有阶段是否有已完成的计划（SUMMARY.md 存在）
   - 展示里程碑范围和统计数据
   - 等待确认

2. **收集统计数据：**

   - 统计阶段、计划、任务数量
   - 计算 git 范围、文件变更、代码行数
   - 从 git log 提取时间线
   - 展示摘要，确认

3. **提取成就：**

   - 读取里程碑范围内所有阶段的 SUMMARY.md 文件
   - 提取 4-6 个关键成就
   - 提交审批

4. **归档里程碑：**

   - 创建 `.planning/milestones/v{{version}}-ROADMAP.md`
   - 从 ROADMAP.md 提取完整阶段详情
   - 填充 milestone-archive.md 模板
   - 将 ROADMAP.md 更新为带链接的单行摘要

5. **归档需求：**

   - 创建 `.planning/milestones/v{{version}}-REQUIREMENTS.md`
   - 将所有 v1 需求标记为完成（复选框已勾选）
   - 记录需求结果（已验证、已调整、已放弃）
   - 删除 `.planning/REQUIREMENTS.md`（为下一个里程碑创建新的）

6. **更新 PROJECT.md：**

   - 添加"当前状态"章节，包含已发布版本
   - 添加"下一里程碑目标"章节
   - 将之前的内容归档到 `<details>` 中（如果是 v1.1+）

7. **提交并打标签：**

   - 暂存：MILESTONES.md、PROJECT.md、ROADMAP.md、STATE.md、归档文件
   - 提交：`chore: archive v{{version}} milestone`
   - 标签：`git tag -a v{{version}} -m "[milestone summary]"`
   - 询问是否推送标签

8. **提供后续步骤：**
   - `/specops:new-milestone` — 开始下一个里程碑（提问 → 研究 → 需求 → 路线图）

</process>

<success_criteria>

- 里程碑已归档到 `.planning/milestones/v{{version}}-ROADMAP.md`
- 需求已归档到 `.planning/milestones/v{{version}}-REQUIREMENTS.md`
- `.planning/REQUIREMENTS.md` 已删除（为下一个里程碑准备新的）
- ROADMAP.md 已折叠为单行条目
- PROJECT.md 已更新为当前状态
- Git 标签 v{{version}} 已创建
- 提交成功
- 用户知道后续步骤（包括需要新的需求定义）
  </success_criteria>

<critical_rules>

- **先加载工作流：** 在执行前读取 complete-milestone.md
- **验证完成度：** 所有阶段必须有 SUMMARY.md 文件
- **用户确认：** 在验证门控处等待批准
- **先归档再删除：** 在更新/删除原始文件之前始终创建归档文件
- **单行摘要：** ROADMAP.md 中折叠的里程碑应为带链接的单行
- **上下文效率：** 归档使 ROADMAP.md 和 REQUIREMENTS.md 每个里程碑保持恒定大小
- **新需求：** 下一个里程碑从 `/specops:new-milestone` 开始，其中包含需求定义
  </critical_rules>
