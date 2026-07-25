# specops:brainstorm

> 头脑风暴：在做任何创意工作之前探索用户意图、需求和设计

## 触发条件

当用户想要：
- 创建新功能
- 构建新组件
- 添加新功能
- 修改现有行为

## 执行流程

1. **探索项目上下文** — 检查文件、文档、最近的提交
2. **提出澄清问题** — 一次一个，理解目的/约束/成功标准
3. **提出 2-3 种方案** — 包含权衡和你推荐的方案
4. **展示设计** — 按复杂性缩放的章节，在每个章节后获得用户批准
5. **编写设计文档** — 保存到 `docs/plans/YYYY-MM-DD-<主题>-design.md` 并提交
6. **过渡到实现** — 调用 writing-plans skill 创建实施计划

## 约束

<HARD-GATE>
在展示设计并获得用户批准之前，请勿调用任何实现 skill、编写任何代码、搭建任何项目或采取任何实现操作。适用于每个项目，无论其复杂性如何。
</HARD-GATE>

## 使用示例

```
/specops:brainstorm 设计一个用户登录功能
/specops:brainstorm 构建一个实时聊天组件
/specops:brainstorm 实现支付流程
```

## 输出

- 设计文档：`docs/plans/YYYY-MM-DD-<主题>-design.md`
- 实施计划：通过 writing-plans skill 创建
