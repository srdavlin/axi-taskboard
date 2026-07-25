---
name: specops:full-pipeline
description: 完整流程：需求分析 → 竞品分析 → 功能分析 → 技术选型
argument-hint: "<输入类型> [输入内容]"
allowed-tools:
  - Read
  - Bash
  - Write
  - Task
  - AskUserQuestion
---

<context>
**输入类型：**
- `requirement` — 需求文本
- `repository` — GitHub 仓库地址
- `website` — 网站 URL

**示例：**
- `/specops:full-pipeline requirement 我想做一个博客系统`
- `/specops:full-pipeline repository https://github.com/facebook/react`
- `/specops:full-pipeline website https://notion.so`
</context>

<objective>
执行完整的 4 阶段流程：

**阶段：**
1. 需求分析 → 生成 REQUIREMENTS.md
2. 竞品分析 → 生成 COMPETITOR_REPORT.md
3. 功能分析 → 生成 FEATURE_MAP.md
4. 技术选型 → 生成 TECH_SELECTION.md + ROADMAP.md

**最终产出：**
- 完整的需求分析报告
- 竞品分析报告
- 功能地图
- 技术选型报告
- 实施路线图
</objective>

<execution_context>
@.opencode/skills/demand-analysis/SKILL.md
@.opencode/skills/competitor-search/SKILL.md
@.opencode/skills/feature-search/SKILL.md
@.opencode/skills/tech-selection/SKILL.md
</execution_context>

<process>
1. 接收输入，判断类型
2. 阶段 1：需求分析
3. 阶段 2：竞品分析
4. 阶段 3：功能分析
5. 阶段 4：技术选型
6. 生成所有产出文档

每个阶段更新状态文件 `.specops/state.json`
</process>
