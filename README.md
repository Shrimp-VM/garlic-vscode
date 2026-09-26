# garlic-vscode

## **这个文档是AI写的！！！**
 
[Garlic](https://github.com/Shrimp-VM/garlic-language) DSL 的 VSCode 扩展，为 ShrimpVM 的 `.srk` 脚本提供语言支持。

## 功能

- **语法高亮**：TextMate 语法定义（`source.garlic`）
- **智能补全**：节点名、属性键、值、数组槽位按上下文精准补全
- **Hover 文档**：节点与属性的说明
- **实时诊断**：基于 Godot 侧 structuredErrors 的语法错误提示

## 前置条件

语言服务器运行在 Godot 编辑器进程内（由 ShrimpVM 插件自动启动），因此使用本扩展前需要：

1. 用 Godot 4.6 打开启用了 ShrimpVM 插件的项目
2. 确认 LSP 监听 `127.0.0.1:6009`（可在 ProjectSettings `shrimpvm/garlic/lsp_port` 修改）

扩展与服务器之间是 LSP base protocol 经 TCP 的字节透传，无需额外进程。

## 使用

### 开发调试

```bash
npm install
npm run compile
```

用 VSCode 打开本文件夹，按 `F5` 启动扩展开发宿主，打开任意 `.srk` 文件即可。

### 打包安装

```bash
npx @vscode/vsce package
```

安装生成的 `.vsix`，打开 `.srk` 文件即生效。

## 设置

| 配置项           | 默认值      | 说明                               |
|------------------|-------------|------------------------------------|
| `garlicLsp.host` | `127.0.0.1` | LSP 服务器所在主机（Godot 编辑器） |
| `garlicLsp.port` | `6009`      | LSP 服务器 TCP 端口                |

修改配置后扩展会自动重启语言客户端；连接失败时按 1 秒间隔重试 5 次，适配 Godot 编辑器启动慢于 VSCode 的场景。

## 目录结构

```plain
src/extension.ts            客户端入口：TCP 连接、重试、配置变更自动重启
syntaxes/garlic.tmLanguage.json  TextMate 语法
language-configuration.json 括号配对、注释、自动缩进规则
examples/add.srk            示例脚本
```
