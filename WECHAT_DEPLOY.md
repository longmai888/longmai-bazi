# 微信接入部署指南

## 📦 已生成的文件

```
website/
├── index.html              # 主站页面（已包含每日运势模块）
├── style.css               # 移动端优化样式
├── script.js               # 前端逻辑 + 微信 JS-SDK 集成
├── wechat-sign-server.js   # 后端签名接口（Node.js + Express）
├── package.json            # 依赖配置
├── vercel.json             # Vercel 部署配置
├── .env.example            # 环境变量示例
├── wechat-integration.md   # 完整微信接入方案文档（推荐阅读）
└── 已有文件：
    ├── crystals.html
    ├── fengshui.html
    └── ...
```

---

## 🚀 快速部署（3 种方案）

### 方案 A：Vercel（推荐，免费）

**优点**：零配置、自动 HTTPS、全球 CDN

1. 安装 Vercel CLI：`npm i -g vercel`
2. 进入 website 目录：`cd D:/龙脉文化/website`
3. 登录：`vercel login`
4. 部署：`vercel --prod`
5. 设置环境变量（在 Vercel Dashboard 或 CLI）：
   ```
   WECHAT_APP_ID=你的AppID
   WECHAT_APP_SECRET=你的AppSecret
   ```

**部署后**：
- 生产地址：`https://your-project.vercel.app`
- 签名接口：`https://your-project.vercel.app/api/wechat-sign`
- 配置公众号网页授权域名：`your-project.vercel.app`

---

### 方案 B：Netlify（免费）

1. 将文件推送到 GitHub 仓库
2. 在 Netlify 导入仓库
3. 配置环境变量：
   - Site settings → Build & deploy → Environment
   - 添加 `WECHAT_APP_ID` 和 `WECHAT_APP_SECRET`
4. 配置重定向（`_redirects` 文件）：
   ```
   /api/*    /wechat-sign-server.js   200
   /*        /index.html              200
   ```

---

### 方案 C：自建服务器（需购买 VPS）

1. 在服务器上安装 Node.js 18+
2. 上传文件到服务器
3. 安装依赖：`npm ci --only=production`
4. 设置环境变量（`.env` 或 systemd）：
   ```bash
   export WECHAT_APP_ID="wx123..."
   export WECHAT_APP_SECRET="your-secret"
   export PORT=3000
   ```
5. 启动服务：`node wechat-sign-server.js`
6. 配置 Nginx 反向代理：
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;
       
       location /api/ {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
       
       location / {
           root /path/to/website;
           try_files $uri $uri/ /index.html;
       }
   }
   ```

---

## 🔐 微信公众号后台配置

### 1️⃣ 获取 AppID 和 AppSecret
- 登录 https://mp.weixin.qq.com
- 设置 → 公众号设置 → 人员设置
- 复制 AppID（保存好）
- AppSecret 只能显示一次，点击"重置"获取新密钥

### 2️⃣ 配置网页授权域名
1. 设置 → 公众号设置 → 功能设置 → 网页授权域名
2. 添加：`your-domain.com`（去掉 www 和协议）
   - Vercel：`your-project.vercel.app`
   - Netlify：`your-site.netlify.app`
   - 自建：`longmai888.com`（需要备案）
3. 下载验证文件并上传到网站根目录
4. 点击"保存"

### 3️⃣ 配置 JS 接口安全域名
1. 设置 → 公众号设置 → 功能设置 → JS 接口安全域名
2. 添加同样的域名：`your-domain.com`
3. 保存

---

## 🧪 测试流程

1. **本地测试**（可选）：
   ```bash
   WECHAT_APP_ID=your-id \
   WECHAT_APP_SECRET=your-secret \
   node wechat-sign-server.js
   ```
   访问：`http://localhost:3000/api/wechat-sign?url=https://your-domain.com`

2. **微信内测试**：
   - 用手机微信打开网站
   - 点击"分享"按钮
   - 如果能正常调起分享界面，说明配置成功

3. **调试技巧**：
   - 在浏览器控制台输入 `wx` 查看对象是否定义
   - 检查网络请求 `/api/wechat-sign` 是否成功
   - 查看微信公众平台 "开发者工具" → "web 开发者工具"

---

## ⚠️ 常见问题

### Q1: `wx is not defined`
**原因**：微信 JS-SDK 未加载或网络问题  
**解决**：
1. 确认在微信浏览器中访问
2. 检查网络能否访问 `res.wx.qq.com`
3. 使用调试工具查看 Network 请求

### Q2: 签名失败 / invalid signature
**原因**：url 参数错误、签名过期、域名不匹配  
**解决**：
1. 确保传递的 url 没有 `#hash` 部分
2. 确认公众号配置的 JS 安全域名与实际访问域名一致
3. 检查后端 access_token 和 ticket 是否缓存正常

### Q3: 分享内容不显示或错误
**原因**：未在 `wx.ready` 中调用分享接口  
**解决**：代码已处理，确保 `setupWechatShare()` 在 `wx.ready` 中执行

### Q4: 无法获取用户地理位置
**原因**：需要先调用 `wx.getLocation`，且需用户授权  
**解决**：
1. 添加 `'getLocation'` 到 `jsApiList`
2. 用户点击按钮时调用，不能自动获取

### Q5: 想用微信支付但没商户号
**回答**：微信支付必须要有营业执照 + 商户号，个人无法接入。初期用人工收款即可。

---

## 📊 成本与时间

| 项目 | 成本 | 时间 |
|------|------|------|
| 微信公众号（服务号） | 300元/年 | 1-2天审核 |
| 服务器（Vercel Netlify） | 免费 | - |
| 域名备案（如需） | 0元 | 3-7天 |
| 开发配置 | 人力成本 | 2-4小时 |

**总计**：初期 ≈ 300元（公众号）+ 少量时间

---

## 📝 后续优化建议

1. **SEO 优化**：
   - 添加 sitemap.xml
   - 提交到百度/谷歌站长平台
   - 优化页面 meta 标签

2. **性能监控**：
   - 接入百度统计或 Google Analytics
   - 使用 Web Vitals 监控核心指标

3. **用户体验**：
   - 接入微信 `wx.getNetworkType()` 根据网络调整图片质量
   - 使用 `wx.scanQRCode()` 实现扫码功能
   - 订阅消息推送每日运势

4. **商业化**：
   - 微信支付（有营业执照后）
   - 小程序（流量 > 1000 UV/天）

---

## 🆘 需要帮助？

如果卡在某一步，可以：
1. 查看 `wechat-integration.md`（更详细的文档）
2. 微信扫码添加客服微信：`fuxinfu889`
3. 在开发者社区提问：https://developers.weixin.qq.com

---

**祝 deployment 顺利！** 🦞