---
name: specops:reapply-patches
description: 更新后重新应用本地修改
allowed-tools: Read, Write, Edit, Bash, Glob, Grep, AskUserQuestion
---

<purpose>
SpecOps 更新擦除并重新安装文件后，此命令将用户之前保存的本地修改合并回新版本。使用智能比较处理上游文件也发生变化的情况。
</purpose>

<process>

## 步骤 1：检测备份的补丁

检查本地补丁目录：

```bash
# 全局安装（路径在安装时模板化）
PATCHES_DIR=~/.config/opencode/specops-local-patches
# 本地安装回退
if [ ! -d "$PATCHES_DIR" ]; then
  PATCHES_DIR=./.opencode/specops-local-patches
fi
```

从补丁目录读取 `backup-meta.json`。

**如果未找到补丁：**
```
未找到本地补丁。无需重新应用。

本地补丁会在你运行 /specops:update 后自动保存
（如果你修改了任何 SpecOps 工作流、命令或 agent 文件）。
```
退出。

## 步骤 2：展示补丁摘要

```
## 待重新应用的本地补丁

**备份自：** v{from_version}
**当前版本：** {读取 VERSION 文件}
**修改文件数：** {count}

| # | 文件 | 状态 |
|---|------|------|
| 1 | {file_path} | 待处理 |
| 2 | {file_path} | 待处理 |
```

## 步骤 3：合并每个文件

对 `backup-meta.json` 中的每个文件：

1. **读取备份版本**（用户修改过的副本，来自 `specops-local-patches/`）
2. **读取新安装版本**（更新后的当前文件）
3. **比较并合并：**

   - 如果新文件与备份文件相同：跳过（修改已被上游合并）
   - 如果新文件不同：识别用户的修改并应用到新版本

   **合并策略：**
   - 完整读取两个版本
   - 识别用户添加或修改的部分（寻找新增内容，而非仅路径替换的差异）
   - 将用户的新增/修改应用到新版本
   - 如果用户修改的部分上游也发生了变化：标记为冲突，展示两个版本，询问用户保留哪个

4. **写入合并结果**到安装位置
5. **报告状态：**
   - `已合并` — 用户修改已干净应用
   - `已跳过` — 修改已存在于上游
   - `冲突` — 用户选择了解决方案

## 步骤 4：更新清单

重新应用后，重新生成文件清单以便未来更新正确检测这些用户修改：

```bash
# 清单将在下次 /specops:update 时重新生成
# 现在只记录哪些文件被修改
```

## 步骤 5：清理选项

询问用户：
- "保留补丁备份作为参考？" → 保留 `specops-local-patches/`
- "清理补丁备份？" → 删除 `specops-local-patches/` 目录

## 步骤 6：报告

```
## 补丁已重新应用

| # | 文件 | 状态 |
|---|------|------|
| 1 | {file_path} | ✓ 已合并 |
| 2 | {file_path} | ○ 已跳过（已在上游） |
| 3 | {file_path} | ⚠ 冲突已解决 |

{count} 个文件已更新。你的本地修改已重新激活。
```

</process>

<success_criteria>
- [ ] 所有备份的补丁已处理
- [ ] 用户修改已合并到新版本
- [ ] 冲突已通过用户输入解决
- [ ] 每个文件的状态已报告
</success_criteria>
