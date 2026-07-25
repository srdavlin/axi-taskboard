---
name: specops:feature-analyze
description: 功能点搜索，分析开源实现，生成功能地图
argument-hint: "[--query <功能点>]"
allowed-tools:
  - Read
  - Bash
  - Write
  - Task
  - AskUserQuestion
---

<context>
**标志：**
- `--query` — 指定功能点搜索关键词

**输入：**
- 上游竞品分析结果
- 或直接输入功能点描述
</context>

<objective>
通过功能分析流程：

**创建：**
- `.specops/feature-map.md` — 功能地图

**分析内容：**
- 调用功能搜索 API
- 分析搜索结果
- 匹配开源实现
- 评估可行性

**此命令之后：** 运行 `/specops:tech-select` 进行技术选型。
</objective>

<execution_context>
@.opencode/skills/feature-search/SKILL.md
</execution_context>

<process>
1. 接收竞品分析结果
2. 调用 feature-search skill 进行功能搜索
3. 分析开源实现，生成功能地图
4. 更新状态文件
</process>
