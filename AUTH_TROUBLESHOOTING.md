# 🔐 Supabase 登录问题解决指南

## 问题现象
```
Error: Invalid login credentials
POST https://olcnoazqarscpwtrwlhm.supabase.co/auth/v1/token?grant_type=password 400
```

## 🎯 最常见原因

### 原因 1：还没有注册账号（最可能，90%的情况）
**症状**：直接在登录页面输入邮箱和密码，显示"Invalid login credentials"

**解决方法**：
1. 点击登录页面的"注册"标签
2. 输入邮箱和密码（密码至少6位）
3. 点击"注册"按钮
4. 根据是否启用邮件确认：
   - **未启用邮件确认**：注册后可以直接登录
   - **已启用邮件确认**：需要先点击邮件中的确认链接

### 原因 2：启用了邮件确认但未确认邮箱
**症状**：注册成功但登录时仍然提示凭证无效

**解决方法**：
1. 检查邮箱（包括垃圾邮件文件夹）
2. 找到来自 Supabase 的确认邮件
3. 点击邮件中的确认链接
4. 确认后再尝试登录

### 原因 3：密码错误
**症状**：注册过但忘记了密码

**解决方法**：
1. 点击登录页面的"忘记密码"链接
2. 输入注册邮箱
3. 检查邮件中的重置密码链接
4. 设置新密码后重新登录

---

## 🔧 诊断步骤

### 步骤 1：使用诊断工具

我已创建了一个诊断工具 `debug-auth.html`：

1. 在浏览器中打开：
   ```
   file:///home/ycs/work/wjl/airoi_forshare/debug-auth.html
   ```

2. 或者直接复制以下代码到新的 HTML 文件中运行

3. 测试注册功能：
   - 输入测试邮箱：`test@example.com`
   - 输入测试密码：`test123456`
   - 点击"注册账号"
   - 查看结果

4. 测试登录功能：
   - 使用刚才注册的邮箱和密码
   - 点击"登录"
   - 查看结果

### 步骤 2：检查 Supabase Auth 配置

1. 访问 Supabase Dashboard：
   ```
   https://supabase.com/dashboard/project/olcnoazqarscpwtrwlhm/auth/templates
   ```

2. 检查"Email Auth"设置：
   - 确保 **Enable Email signups** 是开启的
   - 查看 **Confirm email** 设置：
     - 如果开启：用户必须确认邮箱才能登录
     - 如果关闭：用户注册后可以直接登录

3. 查看用户列表：
   ```
   https://supabase.com/dashboard/project/olcnoazqarscpwtrwlhm/auth/users
   ```
   - 检查是否有已注册的用户
   - 查看用户的邮箱确认状态

---

## ⚡ 快速解决方案

### 方案 A：禁用邮件确认（最快，用于测试）

1. 访问 Supabase Dashboard → Authentication → Templates
2. 找到"Confirm email"或"Email Confirmation"设置
3. 将其关闭或设为可选
4. 保存设置
5. 重新注册并尝试登录

### 方案 B：启用邮件确认（更安全，用于生产）

1. 确保 Supabase 已配置 SMTP 设置
2. 注册时会发送确认邮件到用户邮箱
3. 用户点击确认链接后才能登录
4. 在测试时，可以使用临时邮箱服务（如 temp-mail.org）

---

## 🧪 测试流程

### 1. 清空浏览器数据（重要！）
```
1. 按 F12 打开开发者工具
2. 右键点击浏览器刷新按钮
3. 选择"清空缓存并硬性重新加载"
4. 或者手动清除 localStorage：
   - Console 中输入：localStorage.clear()
   - 按 Enter
   - 刷新页面
```

### 2. 注册新账号
```
邮箱：test@example.com
密码：test123456（至少6位）
```

### 3. 检查注册结果
- 如果显示"注册成功"，说明 Auth 配置正确
- 如果启用邮件确认，检查邮箱
- 如果未启用邮件确认，直接登录即可

### 4. 登录测试
使用刚才注册的账号登录，应该能成功

---

## 🐛 调试技巧

### 查看 Supabase 客户端状态
在浏览器控制台（Console）中输入：
```javascript
// 检查 Supabase 是否正确初始化
console.log(window.location.href);

// 检查当前会话
supabase.auth.getSession().then(({ data }) => {
    console.log('当前会话：', data);
});

// 手动登录测试
supabase.auth.signInWithPassword({
    email: 'test@example.com',
    password: 'test123456'
}).then(({ data, error }) => {
    console.log('登录结果：', { data, error });
});
```

### 查看网络请求
在开发者工具的 Network 标签中：
1. 找到 `auth/v1/token` 请求
2. 查看 Request Payload：
   ```json
   {
     "email": "your@email.com",
     "password": "your-password",
     "grant_type": "password"
   }
   ```
3. 查看 Response：
   - 如果是 400，说明凭证无效
   - 如果是 200，说明登录成功

---

## 📝 常见错误码

| 错误 | 原因 | 解决方法 |
|------|------|----------|
| `Invalid login credentials` | 邮箱未注册或密码错误 | 先注册账号 |
| `Email not confirmed` | 邮箱未确认 | 检查邮件并点击确认链接 |
| `User already registered` | 邮箱已被注册 | 使用其他邮箱或直接登录 |
| `Password should be at least 6 characters` | 密码太短 | 使用至少6位的密码 |

---

## ✅ 成功标志

登录成功后：
1. 页面会跳转到主应用界面（ROI 计算表单）
2. 可以看到"新建评估"按钮
3. 右上角显示用户邮箱
4. Console 中没有红色错误

---

## 🆘 如果问题仍然存在

1. **检查环境变量**：
   ```bash
   vercel env ls
   ```
   确保 `VITE_SUPABASE_URL` 和 `VITE_SUPABASE_ANON_KEY` 已正确配置

2. **检查 Supabase 项目状态**：
   - 访问：https://supabase.com/dashboard/project/olcnoazqarscpwtrwlhm
   - 确保项目未暂停
   - 检查 API 设置是否正常

3. **重新部署**：
   ```bash
   vercel --prod
   ```

4. **联系支持**：
   - 检查 Supabase Dashboard 中的 Logs
   - 查看是否有额外的错误信息

---

## 📞 需要帮助？

请提供以下信息：
1. 注册时的完整错误信息（截图）
2. 浏览器 Console 中的完整输出
3. Network 标签中 auth/v1/token 请求的 Response
4. Supabase Auth 设置截图（特别是 Email Confirmation 部分）

---

**最后更新**：2026-01-22
**相关文件**：`debug-auth.html`（诊断工具）
