/**
 * 微信 JS-SDK 签名接口
 * 使用 Express 框架，部署到 Vercel/Netlify/服务器
 */

const express = require('express');
const axios = require('axios');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;

// 微信公众平台配置（从环境变量读取，不要硬编码！）
const WECHAT_APP_ID = process.env.WECHAT_APP_ID || 'your-app-id';
const WECHAT_APP_SECRET = process.env.WECHAT_APP_SECRET || 'your-app-secret';

// 缓存 access_token 和 jsapi_ticket（减少 API 调用）
let cache = {
    accessToken: null,
    ticket: null,
    expiresAt: 0
};

/**
 * 获取 access_token（有缓存）
 */
async function getAccessToken() {
    const now = Date.now();
    if (cache.accessToken && now < cache.expiresAt) {
        return cache.accessToken;
    }

    try {
        const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${WECHAT_APP_ID}&secret=${WECHAT_APP_SECRET}`;
        const res = await axios.get(url);
        
        if (res.data.access_token) {
            cache.accessToken = res.data.access_token;
            cache.expiresAt = Date.now() + (res.data.expires_in - 300) * 1000; // 提前5分钟过期
            return cache.accessToken;
        } else {
            throw new Error(res.data.errmsg || '获取 access_token 失败');
        }
    } catch (error) {
        console.error('获取 access_token 失败:', error.message);
        throw error;
    }
}

/**
 * 获取 jsapi_ticket（有缓存）
 */
async function getJsApiTicket() {
    const accessToken = await getAccessToken();
    const now = Date.now();
    
    if (cache.ticket && now < cache.expiresAt) {
        return cache.ticket;
    }

    try {
        const url = `https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${accessToken}&type=jsapi`;
        const res = await axios.get(url);
        
        if (res.data.ticket) {
            cache.ticket = res.data.ticket;
            cache.expiresAt = Date.now() + (res.data.expires_in - 300) * 1000;
            return cache.ticket;
        } else {
            throw new Error(res.data.errmsg || '获取 jsapi_ticket 失败');
        }
    } catch (error) {
        console.error('获取 jsapi_ticket 失败:', error.message);
        throw error;
    }
}

/**
 * 生成 SHA1 签名
 */
function generateSha1(str) {
    return crypto.createHash('sha1').update(str).digest('hex');
}

/**
 * 生成微信 JS-SDK 配置签名
 */
async function generateWechatSign(url) {
    const ticket = await getJsApiTicket();
    const nonceStr = crypto.randomBytes(8).toString('hex');
    const timestamp = Math.floor(Date.now() / 1000);
    
    // 签名字符串（注意：必须是 URL 不带 # 后面的部分）
    const signString = `jsapi_ticket=${ticket}&noncestr=${nonceStr}&timestamp=${timestamp}&url=${url}`;
    const signature = generateSha1(signString);
    
    return {
        appId: WECHAT_APP_ID,
        timestamp,
        nonceStr,
        signature
    };
}

// ==================== Express 路由 ====================

app.use(express.json());
app.use(express.static('public')); // 静态文件

/**
 * 健康检查
 */
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: Date.now() });
});

/**
 * 微信 JS-SDK 签名接口
 * GET /api/wechat-sign?url=当前页面URL
 */
app.get('/api/wechat-sign', async (req, res) => {
    const { url } = req.query;
    
    if (!url) {
        return res.status(400).json({
            error: '缺少 url 参数'
        });
    }
    
    try {
        const signData = await generateWechatSign(url);
        
        res.json({
            appId: signData.appId,
            timestamp: signData.timestamp,
            nonceStr: signData.nonceStr,
            signature: signData.signature,
            jsApiList: [
                'updateAppMessageShareData',
                'updateTimelineShareData',
                'onMenuShareTimeline',
                'onMenuShareAppMessage',
                'openLocation',
                'getLocation'
            ]
        });
    } catch (error) {
        console.error('生成微信签名失败:', error);
        res.status(500).json({
            error: '生成签名失败',
            message: error.message
        });
    }
});

/**
 * 微信服务器验证（可选）
 * 用于验证公众号服务器配置
 */
app.get('/api/wechat-verify', (req, res) => {
    const { signature, timestamp, nonce, echostr } = req.query;
    
    // TODO: 实现微信 token 验证逻辑
    // 1. 将 token、timestamp、nonce 三个参数排序后拼接
    // 2. SHA1 加密
    // 3. 对比 signature
    
    res.send(echostr || 'ok');
});

// ==================== 部署说明 ====================

console.log(`
╔════════════════════════════════════════════╗
║  龙脉文化 - 微信 JS-SDK 签名接口          ║
║  服务启动中...                            ║
╚════════════════════════════════════════════╝

📍 本地访问：http://localhost:${PORT}
🔗 签名接口：GET /api/wechat-sign?url=...

⚠️  重要提示：
1. 设置环境变量 WECHAT_APP_ID 和 WECHAT_APP_SECRET
2. 在生产环境使用 HTTPS
3. 配置 CORS（如果前端在不同域名）

示例：
  WECHAT_APP_ID=wx1234567890abcdef \
  WECHAT_APP_SECRET=your-secret \
  node server.js
`);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app; // 用于 Vercel/Netlify 部署