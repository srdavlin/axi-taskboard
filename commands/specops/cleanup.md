---
name: specops:cleanup
description: 归档已完成里程碑的阶段目录
---
<objective>
将已完成里程碑的阶段目录归档到 `.planning/milestones/v{X.Y}-phases/` 中。

当 `.planning/phases/` 积累了过多历史里程碑的目录时使用。
</objective>

<execution_context>
@.opencode/workflows/cleanup.md
</execution_context>

<process>
遵循 @.opencode/workflows/cleanup.md 中的清理工作流。
识别已完成的里程碑，展示预演摘要，确认后执行归档。
</process>
