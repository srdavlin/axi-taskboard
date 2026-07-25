---
name: specops:set-profile
description: 切换 SpecOps 代理的模型配置（quality/balanced/budget）
argument-hint: <profile>
allowed-tools:
  - Read
  - Write
  - Bash
---

<objective>
切换 SpecOps 代理使用的模型配置。控制每个代理使用哪个 Claude 模型，平衡质量与 token 消耗。

路由到 set-profile 工作流，该工作流处理：
- 参数验证（quality/balanced/budget）
- 配置文件缺失时创建
- 在 config.json 中更新配置
- 显示模型表格确认
</objective>

<execution_context>
@.opencode/workflows/set-profile.md
</execution_context>

<process>
**遵循 set-profile 工作流**，来自 `@.opencode/workflows/set-profile.md`。

该工作流处理所有逻辑，包括：
1. 配置参数验证
2. 配置文件确保
3. 配置读取和更新
4. 从 MODEL_PROFILES 生成模型表格
5. 确认显示
</process>
