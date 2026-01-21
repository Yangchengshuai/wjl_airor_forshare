# Supabase MCP 安装和配置指南

## ✅ 已完成的步骤

我已经在你的 Cursor MCP 配置文件中添加了 Supabase MCP 服务器配置。

配置文件位置：`~/.cursor/mcp.json`

## 📋 下一步：获取认证信息

Supabase MCP 需要认证才能使用。有两种方式：

### 方式 1：使用 Personal Access Token (PAT) - 推荐

1. 访问 [Supabase Dashboard](https://supabase.com/dashboard)
2. 登录你的账户
3. 进入 **Settings** → **Access Tokens**
4. 点击 **Generate new token**
5. 复制生成的 Personal Access Token

### 方式 2：使用 OAuth 授权

首次使用时，Cursor 会提示你进行 OAuth 授权，按照提示操作即可。

## 🔧 配置认证（如果需要）

如果你选择使用 PAT，可以更新配置文件添加认证头：

```json
{
  "supabase": {
    "url": "https://mcp.supabase.com/mcp",
    "headers": {
      "Authorization": "Bearer YOUR_PERSONAL_ACCESS_TOKEN"
    }
  }
}
```

**注意**：将 `YOUR_PERSONAL_ACCESS_TOKEN` 替换为你的实际 token。

## 🚀 使用方式

配置完成后，重启 Cursor，然后你就可以：

- 查询 Supabase 数据库表结构
- 执行数据库查询
- 管理数据库模式（schema）
- 读取项目日志
- 管理存储桶和文件

## 🔄 自托管选项（可选）

如果你需要自托管版本，可以使用以下配置：

```json
{
  "supabase": {
    "command": "npx",
    "args": [
      "-y",
      "@supabase/mcp-server-supabase"
    ],
    "env": {
      "SUPABASE_PROJECT_REF": "your-project-ref",
      "SUPABASE_ACCESS_TOKEN": "your-access-token"
    }
  }
}
```

## ⚠️ 安全提示

- 不要在生产环境中使用 MCP 进行写操作
- 建议使用只读权限的 token
- 启用 Row Level Security (RLS)
- 不要将 token 提交到版本控制系统

## 📚 更多信息

- [Supabase MCP 官方文档](https://supabase.com/features/mcp-server)
- [Supabase MCP GitHub](https://github.com/supabase-community/supabase-mcp)
