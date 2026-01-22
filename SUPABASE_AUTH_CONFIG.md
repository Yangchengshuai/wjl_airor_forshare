# Supabase 邮件确认配置指南

## 问题现象

注册后收到的邮件链接：
```
http://localhost:3000/#error=access_denied&error_code=otp_expired&error_description=Email+link+is+invalid+or+has+expired
```

**原因**：Supabase 项目的 Site URL 配置为 `localhost:3000`，而不是生产环境域名。

---

## 🔧 方案 A：修复邮件确认（推荐用于生产）

### 步骤 1：修改 Site URL

1. 访问 Supabase Dashboard → Settings → Authentication
   ```
   https://supabase.com/dashboard/project/olcnoazqarscpwtrwlhm/settings/auth
   ```

2. 找到 **"Site URL"** 配置项

3. 修改为：
   ```
   https://airoiforshare.vercel.app
   ```

4. 点击保存

### 步骤 2：配置重定向 URL

在同一页面，找到 **"Redirect URLs"** 或 **"Allowed Redirect URLs"**，添加：

```
https://airoiforshare.vercel.app/**
https://airoiforshare.vercel.app/auth/callback
```

### 步骤 3：配置邮件模板（可选）

1. 访问 Auth → Templates
   ```
   https://supabase.com/dashboard/project/olcnoazqarscpwtrwlhm/auth/templates
   ```

2. 找到 **"Confirm signup"** 模板

3. 自定义邮件内容（可选）

### 步骤 4：保存并测试

- 保存所有更改
- 重新注册一个测试账号
- 检查收到的邮件链接
- 链接应该指向 `https://airoiforshare.vercel.app` 而不是 `localhost:3000`

---

## ⚡ 方案 B：禁用邮件确认（推荐用于测试）

### 为什么要禁用邮件确认？

**优点**：
- ✅ 用户注册后立即可以登录
- ✅ 不需要配置邮件服务器
- ✅ 测试更快速方便

**缺点**：
- ⚠️ 安全性稍低（任何人都可以注册）
- ⚠️ 不适合生产环境

### 配置步骤

1. 访问 Auth → Templates
   ```
   https://supabase.com/dashboard/project/olcnoazqarscpwtrwlhm/auth/templates
   ```

2. 找到 **"Confirm signup"** 部分

3. 切换以下选项：

   **选项 1：禁用邮件确认**
   ```
   Enable email confirmations: OFF
   ```

   **选项 2：启用测试模式**
   ```
   Allow testing (disable email): ON
   ```

4. 点击保存

5. 重新注册测试账号
6. 注册成功后立即可以登录，无需确认邮件

---

## 🎯 方案 C：手动创建用户（临时测试用）

### 限制说明

⚠️ **不推荐使用此方式**，因为：
- 手动创建的用户**无法设置密码**
- 用户需要使用"忘记密码"功能重置密码后才能登录
- 仅适合临时测试

### 操作步骤

1. 访问 Authentication → Users
   ```
   https://supabase.com/dashboard/project/olcnoazqarscpwtrwlhm/auth/users
   ```

2. 点击右上角 **"Add user"** 或 **"New user"** 按钮

3. 填写表单：
   ```
   Email: test@example.com
   Auto Confirm User: ✅（勾选）
   Send invite email: ❌（不勾选）
   ```

4. 点击 **"Create user"**

5. 用户创建成功后，用户需要：
   - 访问登录页面
   - 点击"忘记密码"
   - 输入邮箱
   - 检查邮件并重置密码
   - 使用新密码登录

---

## 📊 配置对比

| 方案 | 适用场景 | 安全性 | 速度 | 推荐度 |
|------|----------|--------|------|--------|
| **方案 A：修复邮件链接** | 生产环境 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ✅ 生产环境推荐 |
| **方案 B：禁用邮件确认** | 测试/开发 | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ✅ 测试环境推荐 |
| **方案 C：手动创建用户** | 临时测试 | ⭐⭐⭐⭐ | ⭐ | ❌ 不推荐 |

---

## 🔍 推荐配置（按环境）

### 开发/测试环境
```
Site URL: http://localhost:3000

Enable email confirmations: OFF
Allow testing (disable email): ON
```

### 生产环境
```
Site URL: https://airoiforshare.vercel.app

Redirect URLs:
  - https://airoiforshare.vercel.app/**
  - https://airoiforshare.vercel.app/auth/callback

Enable email confirmations: ON
Allow testing (disable email): OFF
```

---

## 🧪 测试步骤

### 方案 B 测试（禁用邮件确认）

1. 访问 https://airoiforshare.vercel.app
2. 点击"还没有账号？立即注册"
3. 填写注册信息：
   ```
   邮箱：test@example.com
   密码：test123456
   ```
4. 点击"注册"
5. 应该看到："注册成功！正在跳转..."
6. 自动跳转到主应用界面

### 方案 A 测试（启用邮件确认）

1. 配置正确的 Site URL
2. 注册新账号
3. 检查邮箱（包括垃圾邮件文件夹）
4. 点击确认链接
5. 应该跳转到 `https://airoiforshare.vercel.app`
6. 使用注册的邮箱和密码登录

---

## ❓ 常见问题

### Q1: 为什么邮件链接还是指向 localhost？

**A**: Supabase 有缓存，修改 Site URL 后：
1. 清除 Supabase 缓存：Settings → General → Reset project cache
2. 或者等待 5-10 分钟让配置生效
3. 重新注册测试账号

### Q2: 如何快速切换测试/生产配置？

**A**: 创建两个 Supabase 项目：
- 开发项目：禁用邮件确认，指向 localhost
- 生产项目：启用邮件确认，指向 vercel.app

### Q3: 邮件发送失败怎么办？

**A**: 检查 Supabase 的 SMTP 设置：
1. 访问 Settings → Authentication → SMTP Settings
2. 使用 Supabase 默认邮件服务（免费额度有限）
3. 或配置自己的 SMTP 服务器（如 Sendgrid, AWS SES）

### Q4: 测试时可以使用临时邮箱吗？

**A**: 可以！推荐临时邮箱服务：
- Temp-mail: https://temp-mail.org/
- 10 Minute Mail: https://10minutemail.com/
- Guerrilla Mail: https://www.guerrillamail.com/

---

## 🎉 立即行动

**最快的解决方案（现在就做）**：

1. 访问：
   ```
   https://supabase.com/dashboard/project/olcnoazqarscpwtrwlhm/auth/templates
   ```

2. 找到 "Confirm signup" 部分

3. 关闭 **"Enable email confirmations"**

4. 保存

5. 重新注册并测试登录

✅ **5分钟内完成！**

---

**最后更新**：2026-01-22
**相关文档**：
- [Supabase Auth 配置](https://supabase.com/docs/guides/auth/auth-helpers/nextjs)
- [邮件确认配置](https://supabase.com/docs/guides/auth/auth-email)
