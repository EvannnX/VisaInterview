# 贡献指南

感谢你对签证面试模拟系统的兴趣！本文档将帮助你了解如何为项目做出贡献。

## 开发流程

1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启一个 Pull Request

## 代码规范

### TypeScript

- 使用 TypeScript 进行类型检查
- 避免使用 `any` 类型
- 为函数添加适当的类型注解

### React

- 使用函数组件和 Hooks
- 组件文件使用 PascalCase 命名
- 保持组件简洁，单一职责

### 样式

- 使用 TailwindCSS
- 遵循项目现有的样式模式
- 避免内联样式（除非必要）

## 提交信息

使用语义化提交信息：

- `feat:` 新功能
- `fix:` 修复 bug
- `docs:` 文档更新
- `style:` 代码格式调整
- `refactor:` 代码重构
- `test:` 测试相关
- `chore:` 构建/工具相关

示例：
```
feat: 添加PDF导出功能
fix: 修复录音按钮在Safari中的问题
docs: 更新部署文档
```

## 测试

在提交 PR 前，请确保：

- [ ] 代码可以正常编译
- [ ] 没有 TypeScript 错误
- [ ] 在本地测试了所有修改的功能
- [ ] 更新了相关文档

## 问题报告

报告 bug 时，请包含：

- 问题描述
- 复现步骤
- 预期行为
- 实际行为
- 环境信息（浏览器、操作系统等）
- 截图（如果适用）

## 功能建议

提出新功能时，请说明：

- 功能描述
- 使用场景
- 实现思路（可选）
- 是否愿意实现

## 许可证

贡献代码即表示你同意将代码以 MIT 许可证发布。
