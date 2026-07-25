---
name: specops:demand-analyze
description: 分析用户需求，拆分功能点，生成需求文档
argument-hint: "[--auto]"
allowed-tools:
  - Read
  - Bash
  - Write
  - Task
  - AskUserQuestion
---

<context>
**标志：**
- `--auto` — 自动模式。直接根据输入的需求进行分析，无需交互。

**输入类型：**
- 需求文本：直接输入需求描述
- GitHub 仓库：提供仓库地址，克隆后分析功能
- 网站：提供网址，抓取并分析功能
</context>

<objective>
通过需求分析流程处理用户输入：

**创建：**
- `.specops/requirements.md` — 需求分析报告
- `.specops/demand-analysis.json` — 结构化需求数据

**分析内容：**
- 需求理解与拆分
- 功能点提取
- 优先级排序
- 依赖关系

**此命令之后：** 运行 `/specops:competitor-analyze` 进行竞品分析。
</objective>

<execution_context>
@.opencode/skills/demand-analysis/SKILL.md
@.opencode/skills/brainstorming/SKILL.md
</execution_context>

<process>
1. 接收用户输入（需求/仓库/网站）
2. 调用 demand-analysis skill 进行分析
3. 拆分功能点，生成需求文档
4. 更新状态文件 `.specops/state.json`
</process>
