---
name: specops:list-phase-assumptions
description: 在规划之前展示 Claude 对阶段方法的假设
argument-hint: "[phase]"
allowed-tools:
  - Read
  - Bash
  - Grep
  - Glob
---

<objective>
分析一个阶段并展示 Claude 关于技术方法、实现顺序、范围边界、风险领域和依赖关系的假设。

目的：帮助用户在规划开始之前看到 Claude 的想法——在假设错误时尽早纠正。
输出：仅对话输出（不创建文件）——以"你觉得怎么样？"提示结束
</objective>

<execution_context>
@.opencode/workflows/list-phase-assumptions.md
</execution_context>

<context>
阶段编号：$ARGUMENTS（必需）

项目状态和路线图在工作流中通过定向读取加载。
</context>

<process>
1. 验证阶段编号参数（缺失或无效时报错）
2. 检查阶段是否存在于路线图中
3. 遵循 list-phase-assumptions.md 工作流：
   - 分析路线图描述
   - 展示关于以下方面的假设：技术方法、实现顺序、范围、风险、依赖关系
   - 清晰展示假设
   - 提示"你觉得怎么样？"
4. 收集反馈并提供后续步骤
</process>

<success_criteria>

- 阶段已对照路线图验证
- 在五个领域展示了假设
- 已提示用户反馈
- 用户知道后续步骤（讨论上下文、规划阶段或纠正假设）
  </success_criteria>
