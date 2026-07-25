---
name: specops:help
description: 显示可用的 SpecOps 命令和使用指南
---
<objective>
显示完整的 SpecOps 命令参考。

仅输出以下参考内容。不要添加：
- 项目特定的分析
- Git 状态或文件上下文
- 后续步骤建议
- 参考之外的任何评论
</objective>

<execution_context>
@.opencode/workflows/help.md
</execution_context>

<process>
输出来自 @.opencode/workflows/help.md 的完整 SpecOps 命令参考。
直接显示参考内容——不做任何添加或修改。
</process>
