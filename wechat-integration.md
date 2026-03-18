# 龙脉文化 - 微信接入完整方案

## 📱 微信公众号配置

### 1. 公众号类型选择
**推荐：服务号**（每月可发4次推送，支持微信支付、JS-SDK、高级接口）
- 如果还没有公众号，建议注册"服务号"
- 已有订阅号可升级，但无法 downgrade

### 2. 公众号基础设置
1. 登录 https://mp.weixin.qq.com
2. 设置 → 公众号设置
   - 账号名称：龙脉文化
   - 功能介绍：传承千年命理智慧，科技+玄学守护人生
   - 头像：使用小龙虾+八卦 logo（需上传透明 PNG）
   - 二维码：下载并保存到本地
   - aws：https://longmai888.github.io/longmai-bazi/wechat-qr.png

### 3. 微信 JS-SDK 配置（网页分享）

#### 步骤 1：绑定域名
1. 设置 → 公众号设置 → 功能设置 → 网页授权域名
2. 添加域名：`longmai888.github.io`（当前 GitHub Pages 域名）
3. 下载验证文件并上传到网站根目录

#### 步骤 2：获取凭证
1. 设置 → 公众号设置 → 人员设置
2. 管理员微信扫码确认
3. 获取 `AppID` 和 `AppSecret`

#### 步骤 3：后端签名接口（必需）
微信 JS-SDK 需要一个后端接口来生成签名：

**接口地址**：`/api/wechat-sign`
**请求参数**：
- `url`（当前页面完整 URL，必须通过 `encodeURIComponent` 编码）

**返回 JSON 格式**：
```json
{
  "appId": "wx1234567890abcdef",
  "timestamp": 1742200000,
  "nonceStr": "random-string-here",
  "signature": "sha1-signature",
  "jsApiList": [
    "updateAppMessageShareData",
    "updateTimelineShareData",
    "onMenuShareTimeline",
    "onMenuShareAppMessage",
    "openLocation",
    "getLocation"
  ]
}
```

**签名算法（Node.js 示例）**：
```javascript
const crypto = require('crypto');

function generateSignature(ticket, nonceStr, timestamp, url) {
  const string = `jsapi_ticket=${ticket}&noncestr=${nonceStr}&timestamp=${timestamp}&url=${url}`;
  return crypto.createHash('sha1').update(string).digest('hex');
}
```

#### 步骤 4：前端调用配置

在 `script.js` 中添加：

```javascript
// 微信 JS-SDK 初始化
function initWechatSDK() {
    // 获取当前页面 URL（需要后端提供签名）
    const currentUrl = window.location.href.split('#')[0];
    
    fetch('/api/wechat-sign?url=' + encodeURIComponent(currentUrl))
        .then(res => res.json())
        .then(config => {
            wx.config({
                debug: false, // 开发环境设为true
                appId: config.appId,
                timestamp: config.timestamp,
                nonceStr: config.nonceStr,
                signature: config.signature,
                jsApiList: config.jsApiList
            });
            
            wx.ready(() => {
                // 分享给好友
                wx.updateAppMessageShareData({
                    title: '🐉 免费八字排盘 - 龙脉文化',
                    desc: '30秒get你的命理密码，精准人生规划',
                    link: window.location.href,
                    imgUrl: 'https://longmai888.github.io/longmai-bazi/logo.png',
                    success: () => showToast('分享成功')
                });
                
                // 分享到朋友圈
                wx.updateTimelineShareData({
                    title: '🐉 免费八字排盘 - 离火运时代的能量指南',
                    link: window.location.href,
                    imgUrl: 'https://longmai888.github.io/longmai-bazi/logo.png',
                    success: () => showToast('分享成功')
                });
            });
            
            wx.error(err => {
                console.error('微信JS-SDK初始化失败:', err);
            });
        })
        .catch(err => {
            console.error('获取微信签名失败:', err);
        });
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 检测是否在微信内置浏览器中
    const isWechat = /MicroMessenger/i.test(navigator.userAgent);
    if (isWechat) {
        initWechatSDK();
    }
});
```

### 4. 微信支付接入（可选）

**适用场景**：VIP会员购买、水晶商城下单

**所需材料**：
- 微信商户号（需营业执照）
- APIv3 密钥
- 商户证书

**支付流程**：
1. 用户点击"立即支付"
2. 前端请求后端创建订单（`/api/create-order`）
3. 后端调用微信统一下单API
4. 前端调用 `wx.requestPayment()` 调起支付
5. 支付成功后，后端回调验证并更新订单状态

**后端示例（Node.js + wechatpay-node-v3）**：
```javascript
const { WechatPay } = require('wechatpay-node-v3');

const wechatPay = new WechatPay({
    appid: 'wx1234567890abcdef',
    mchid: '1234567890',
    privateKey: '-----BEGIN PRIVATE KEY-----...',
    serialNo: 'serialNumber',
    apiV3key: 'your-api-v3-key'
});

// 创建支付订单
async function createOrder(amount, description, outTradeNo) {
    const order = await wechatPay.transactions_native({
        description,
        out_trade_no: outTradeNo,
        amount: {
            total: amount,
            currency: 'CNY'
        },
        notify_url: 'https://yourdomain.com/api/payment/callback'
    });
    return order.code_url; // 返回二维码供用户扫码
}
```

### 5. 微信公众号消息推送

**模板消息**（需用户主动触发，如点击"订阅每日运势"）：
- 每日运势推送（早上8点）
- 订单状态通知
- VIP到期提醒

**客服消息**（48小时内可主动推送）：
- 用户咨询回复
- 服务完成通知

**订阅消息**（一次性订阅，无需用户ACTION）：
- "每日运势"订阅
- "水晶能量提醒"订阅

### 6. 微信小程序（进阶，2-3个月后）

**当流量 > 1000 UV/天后考虑开发**

**优势**：
- 更好的用户体验
- 微信生态内传播
- 更低的开发成本（相比原生APP）

**功能**：
- 八字排盘（完整版）
- 每日运势订阅
- 水晶商城
- 会员中心

---

## 📊 当前状态（2026-03-17）

### ✅ 已实现（网页版）
- 八字排盘计算
- 每日运势（黄历宜忌）
- 移动端优化
- 分享到微信/朋友圈（基础版，需用户手动打开）

### 🔄 待接入（需要后端支持）
1. **微信 JS-SDK 签名接口**
   - 优先级：高（用于网页内分享）
   - 工作量：2-3小时
   - 需要：公众号 AppID/AppSecret

2. **微信支付**
   - 优先级：中（用户没有明确需求暂时不急）
   - 工作量：1-2天
   - 需要：营业执照 + 微信商户号

3. **微信公众号消息**
   - 优先级：低（用户量上来后再做）
   - 工作量：1-2天
   - 需要：模板消息权限

---

## 🚀 下一步行动清单

### 立即行动（今天）
1. [ ] 确认是否有微信公众号（服务号）
   - 如果有：记录 AppID、AppSecret
   - 如果没有：注册服务号（需营业执照，个体户也可）
2. [ ] 配置网页授权域名（`longmai888.github.io`）
3. [ ] 准备后端签名接口（可以使用 OpenClaw 快速搭建）

### 本周完成
4. [ ] 部署后端签名接口到服务器（或 Vercel/Netlify）
5. [ ] 在 `script.js` 中集成微信 JS-SDK 初始化
6. [ ] 测试微信内分享功能（真机调试）

### 后续考虑
7. [ ] 接入微信支付（等有付费需求时）
8. [ ] 开发微信小程序（流量 > 1000 UV/天）

---

## 🔐 安全注意事项

1. **AppSecret 绝对不要暴露在前端**！必须放在后端
2. **域名必须备案**（微信要求）：`.github.io` 域名已备案
3. **签名有效期 5 分钟**，必须每次请求重新生成
4. **支付回调必须使用 HTTPS**
5. **用户隐私**：不要收集敏感个人信息

---

## 📞 技术支持

如果遇到问题，可以：
1. 查看微信公众平台官方文档：https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/JS-SDK.html
2. 联系我（九天）协助调试

需要我帮你：
- ✅ 生成后端签名接口代码？
- ✅ 配置微信公众号详细步骤？
- ✅ 部署到 Vercel/Netlify？
- ✅ 还是现在就开始写代码？

**告诉我你的决定，我马上执行！** 🦞