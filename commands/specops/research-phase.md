---
name: specops:research-phase
description: 研究如何实现某个阶段（独立命令——通常使用 /specops:plan-phase 代替）
argument-hint: "[phase]"
allowed-tools:
  - Read
  - Bash
  - Task
---

<objective>
研究如何实现某个阶段。生成带有阶段上下文的 specops-phase-researcher 代理。

**注意：** 这是一个独立的研究命令。对于大多数工作流，使用 `/specops:plan-phase` 会自动集成研究。

**使用此命令的场景：**
- 你想在不规划的情况下先研究
- 你想在规划完成后重新研究
- 你需要在决定阶段是否可行之前进行调查

**编排器角色：** 解析阶段，对照路线图验证，检查现有研究，收集上下文，生成研究代理，展示结果。

**为什么用子代理：** 研究会快速消耗上下文（WebSearch、Context7 查询、源验证）。调查使用全新的 200k 上下文。主上下文保持精简以便用户交互。
</objective>

<context>
阶段编号：$ARGUMENTS（必需）

在步骤 1 中标准化阶段输入，然后再进行任何目录查找。
</context>

<process>

## 0. 初始化上下文

```bash
INIT=$(node .opencode/bin/specops-tools.cjs init phase-op "$ARGUMENTS")
```

从初始化 JSON 中提取：`phase_dir`、`phase_number`、`phase_name`、`phase_found`、`commit_docs`、`has_research`、`state_path`、`requirements_path`、`context_path`、`research_path`。

解析研究员模型：
```bash
RESEARCHER_MODEL=$(node .opencode/bin/specops-tools.cjs resolve-model specops-phase-researcher --raw)
```

## 1. 验证阶段

```bash
PHASE_INFO=$(node .opencode/bin/specops-tools.cjs roadmap get-phase "${phase_number}")
```

**如果 `found` 为 false：** 报错并退出。**如果 `found` 为 true：** 从 JSON 中提取 `phase_number`、`phase_name`、`goal`。

## 2. 检查现有研究

```bash
ls .planning/phases/${PHASE}-*/RESEARCH.md 2>/dev/null
```

**如果存在：** 提供选项：1) 更新研究，2) 查看现有，3) 跳过。等待响应。

**如果不存在：** 继续。

## 3. 收集阶段上下文

使用 INIT 中的路径（不要在编排器上下文中内联文件内容）：
- `requirements_path`
- `context_path`
- `state_path`

展示摘要，包含阶段描述和研究员将加载的文件。

## 4. 生成 specops-phase-researcher 代理

研究模式：ecosystem（默认）、feasibility、implementation、comparison。

```markdown
<research_type>
Phase Research — investigating HOW to implement a specific phase well.
</research_type>

<key_insight>
The question is NOT "which library should I use?"

The question is: "What do I not know that I don't know?"

For this phase, discover:
- What's the established architecture pattern?
- What libraries form the standard stack?
- What problems do people commonly hit?
- What's SOTA vs what Claude's training thinks is SOTA?
- What should NOT be hand-rolled?
</key_insight>

<objective>
Research implementation approach for Phase {phase_number}: {phase_name}
Mode: ecosystem
</objective>

<files_to_read>
- {requirements_path} (Requirements)
- {context_path} (Phase context from discuss-phase, if exists)
- {state_path} (Prior project decisions and blockers)
</files_to_read>

<additional_context>
**Phase description:** {phase_description}
</additional_context>

<downstream_consumer>
Your RESEARCH.md will be loaded by `/specops:plan-phase` which uses specific sections:
- `## Standard Stack` → Plans use these libraries
- `## Architecture Patterns` → Task structure follows these
- `## Don't Hand-Roll` → Tasks NEVER build custom solutions for listed problems
- `## Common Pitfalls` → Verification steps check for these
- `## Code Examples` → Task actions reference these patterns

Be prescriptive, not exploratory. "Use X" not "Consider X or Y."
</downstream_consumer>

<quality_gate>
Before declaring complete, verify:
- [ ] All domains investigated (not just some)
- [ ] Negative claims verified with official docs
- [ ] Multiple sources for critical claims
- [ ] Confidence levels assigned honestly
- [ ] Section names match what plan-phase expects
</quality_gate>

<output>
Write to: .planning/phases/${PHASE}-{slug}/${PHASE}-RESEARCH.md
</output>
```

```
Task(
  prompt="First, read ~/.claude/agents/specops-phase-researcher.md for your role and instructions.\n\n" + filled_prompt,
  subagent_type="general-purpose",
  model="{researcher_model}",
  description="Research Phase {phase}"
)
```

## 5. 处理代理返回

**`## RESEARCH COMPLETE`：** 显示摘要，提供选项：规划阶段、深入研究、查看完整内容、完成。

**`## CHECKPOINT REACHED`：** 向用户展示，获取响应，生成后续代理。

**`## RESEARCH INCONCLUSIVE`：** 显示已尝试的内容，提供选项：添加上下文、尝试不同模式、手动。

## 6. 生成后续代理

```markdown
<objective>
Continue research for Phase {phase_number}: {phase_name}
</objective>

<prior_state>
<files_to_read>
- .planning/phases/${PHASE}-{slug}/${PHASE}-RESEARCH.md (Existing research)
</files_to_read>
</prior_state>

<checkpoint_response>
**Type:** {checkpoint_type}
**Response:** {user_response}
</checkpoint_response>
```

```
Task(
  prompt="First, read ~/.claude/agents/specops-phase-researcher.md for your role and instructions.\n\n" + continuation_prompt,
  subagent_type="general-purpose",
  model="{researcher_model}",
  description="Continue research Phase {phase}"
)
```

</process>

<success_criteria>
- [ ] 阶段已对照路线图验证
- [ ] 已检查现有研究
- [ ] 已生成带上下文的 specops-phase-researcher
- [ ] 正确处理检查点
- [ ] 用户知道后续步骤
</success_criteria>
