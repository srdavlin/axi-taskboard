---
name: specops:competitor-analyze
description: 搜索竞品，分析功能，生成竞品报告
argument-hint: "[--query <关键词>]"
allowed-tools:
  - Read
  - Bash
  - Write
  - Task
  - AskUserQuestion
---

<context>
**标志：**
- `--query` — 指定搜索关键词

**输入：**
- 上游需求分析结果
- 或直接输入竞品关键词
</context>

<objective>
通过竞品分析流程：

**创建：**
- `.specops/competitor-report.md` — 竞品分析报告

**分析内容：**
- 关键词拆分（中文 + 英文）
- Web 搜索竞品
- GitHub 搜索相关项目
- 竞品功能对比

**此命令之后：** 运行 `/specops:feature-analyze` 进行功能分析。
</objective>

<execution_context>
@.opencode/skills/competitor-search/SKILL.md
</execution_context>

<process>
1. 接收需求分析结果
2. 调用 competitor-search skill 进行搜索
3. 分析竞品功能，生成报告
4. 更新状态文件
</process>
