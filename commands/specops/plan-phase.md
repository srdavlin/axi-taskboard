---
name: specops:plan-phase
description: 创建带验证循环的详细阶段计划（PLAN.md）
argument-hint: "[phase] [--auto] [--research] [--skip-research] [--gaps] [--skip-verify] [--prd <file>]"
agent: specops-planner
allowed-tools:
  - Read
  - Write
  - Bash
  - Glob
  - Grep
  - Task
  - WebFetch
  - mcp__context7__*
---
<objective>
为路线图阶段创建可执行的阶段提示（PLAN.md 文件），集成研究和验证。

**默认流程：** 研究（如需要）→ 规划 → 验证 → 完成

**编排器角色：** 解析参数，验证阶段，研究领域（除非跳过），生成 specops-planner，使用 specops-plan-checker 验证，迭代直到通过或达到最大迭代次数，展示结果。
</objective>

<execution_context>
@.opencode/workflows/plan-phase.md
@.opencode/references/ui-brand.md
</execution_context>

<context>
阶段编号：$ARGUMENTS（可选——如果省略则自动检测下一个未规划的阶段）

**标志：**
- `--research` — 即使 RESEARCH.md 已存在也强制重新研究
- `--skip-research` — 跳过研究，直接进入规划
- `--gaps` — 缺口修复模式（读取 VERIFICATION.md，跳过研究）
- `--skip-verify` — 跳过验证循环
- `--prd <file>` — 使用 PRD/验收标准文件代替 discuss-phase。自动将需求解析为 CONTEXT.md。完全跳过 discuss-phase。

在步骤 2 中标准化阶段输入，然后再进行任何目录查找。
</context>

<process>
端到端执行 @.opencode/workflows/plan-phase.md 中的 plan-phase 工作流。
保留所有工作流门控（验证、研究、规划、验证循环、路由）。
</process>
