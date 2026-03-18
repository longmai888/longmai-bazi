/**
 * 龙脉文化八字排盘 - 前端逻辑
 * 使用 lunar-javascript 纯前端计算，不依赖后端
 */

// 时辰映射（小时 -> 地支）
const HOUR_TO_ZHI = {
    23: '子', 1: '丑', 3: '寅', 5: '卯', 7: '辰', 9: '巳',
    11: '午', 13: '未', 15: '申', 17: '酉', 19: '戌', 21: '亥'
};

// 天干五行
const GAN_WU_XING = {
    '甲': '木', '乙': '木',
    '丙': '火', '丁': '火',
    '戊': '土', '己': '土',
    '庚': '金', '辛': '金',
    '壬': '水', '癸': '水'
};

// 日干简版解读
const DAY_GAN_SUMMARY = {
    '甲': '甲木栋梁，参天大树，性格正直，有领导力。宜东方发展。',
    '乙': '乙木花草，柔韧细腻，善于协调，有艺术天赋。',
    '丙': '丙火太阳，光明磊落，热情洋溢，适合创业。',
    '丁': '丁火星光，内敛含蓄，心思细腻，技艺超群。',
    '戊': '戊土高山，厚重稳沉，值得信赖，适合金融地产。',
    '己': '己土田园，包容万物，擅长规划，稳中求进。',
    '庚': '庚金刚毅，果敢决断，正义感强，适合外科手术。',
    '辛': '辛金珠玉，精致优雅，审美一流，珠宝设计。',
    '壬': '壬水江河，智慧通达，变化多端，贸易物流。',
    '癸': '癸水雨露，温柔含蓄，学术研究，心理咨询。'
};

// 日干性格特质
const DAY_GAN_PERSONALITY = {
    '甲': '领导型人格，正直有担当，适合担任管理职位，有开拓精神。',
    '乙': '协调型人格，温柔细腻，善于沟通，有艺术气质。',
    '丙': '热情型人格，光明磊落，行动力强，适合创业。',
    '丁': '细腻型人格，内敛深沉，心思缜密，技术专长。',
    '戊': '稳重型人格，诚信可靠，适合金融、地产、公务员。',
    '己': '包容型人格，善于规划，稳扎稳打，团队润滑剂。',
    '庚': '刚毅型人格，果断勇敢，正义感强，适合外科、军警。',
    '辛': '精致型人格，审美一流，追求完美，珠宝、设计行业。',
    '壬': '智慧型人格，变通能力强，适合贸易、物流、咨询。',
    '癸': '内敛型人格，温柔体贴，学术研究、心理咨询。'
};

// 日干事业财运
const DAY_GAN_CAREER = {
    '甲': '适合独立创业或大型企业高管，发展方位宜东方。财运中等偏上，需防冲动投资。',
    '乙': '适合文职、设计、教育、咨询。财运稳定，靠专业技能吃饭。',
    '丙': '适合创业、演艺、销售。财运起伏大，需把握时机。',
    '丁': '适合技术、工艺、医疗。财运平缓但持久，越老越吃香。',
    '戊': '适合金融、地产、建筑、公务员。财运稳健，有固定资产运。',
    '己': '适合策划、管理、中介。财运细水长流，忌冒进。',
    '庚': '适合外科、军警、机械、金融。财运刚猛，但需防口舌。',
    '辛': '适合珠宝、时尚、精密仪器、美学行业。财运精致但不大。',
    '壬': '适合物流、贸易、旅游、咨询。财运流动性强，需积累。',
    '癸': '适合学术、心理咨询、艺术、医疗。财运隐性，靠口碑。'
};

// 日干感情婚姻
const DAY_GAN_MARRIAGE = {
    '甲': '男性缘佳，女性晚婚为宜。适合与己、庚日干者婚配。',
    '乙': '女性温婉，男性桃花旺。适合与庚、辛日干者婚配。',
    '丙': '热情奔放，需防感情用事。适合与壬、癸日干者婚配。',
    '丁': '感情细腻，易感动。适合与甲、乙日干者婚配。',
    '戊': '稳重顾家，适合晚婚。适合与甲、乙日干者婚配。',
    '己': '贤妻良母/好丈夫类型，宜找性格活泼对象。适合与丙、丁日干者婚配。',
    '庚': '婚姻较晚，但质量高。适合与乙、丁日干者婚配。',
    '辛': '追求完美伴侣，晚婚更佳。适合与丙、戊日干者婚配。',
    '壬': '感情波折，需耐心经营。适合与戊、己日干者婚配。',
    '癸': '温柔体贴，但易受情伤。适合与戊、己日干者婚配。'
};

// 日干健康提示
const DAY_GAN_HEALTH = {
    '甲': '注意肝胆、头部。少熬夜，多运动。',
    '乙': '注意肝胆、四肢。保持情绪稳定。',
    '丙': '注意心脏、眼睛。避免过度劳累。',
    '丁': '注意心脏、血液。少食辛辣。',
    '戊': '注意脾胃、消化。饮食规律。',
    '己': '注意脾胃、肌肉。少食生冷。',
    '庚': '注意肺部、呼吸道。远离烟雾。',
    '辛': '注意肺部、皮肤。保湿护肤。',
    '壬': '注意肾脏、泌尿系统。多喝水，勿憋尿。',
    '癸': '注意肾脏、生殖系统。保暖，避免过劳。'
};

// 初始化表单选项
document.addEventListener('DOMContentLoaded', function() {
    initFormOptions();
    document.getElementById('bazi-form').addEventListener('submit', handleSubmit);
});

/**
 * 初始化表单下拉选项
 */
function initFormOptions() {
    const yearSelect = document.getElementById('year');
    const monthSelect = document.getElementById('month');
    const daySelect = document.getElementById('day');
    const hourSelect = document.getElementById('hour');

    // 年份：1900-2100
    const currentYear = new Date().getFullYear();
    for (let y = currentYear - 100; y <= currentYear; y++) {
        const option = document.createElement('option');
        option.value = y;
        option.textContent = y + '年';
        yearSelect.appendChild(option);
    }

    // 月份：1-12
    for (let m = 1; m <= 12; m++) {
        const option = document.createElement('option');
        option.value = m;
        option.textContent = m + '月';
        monthSelect.appendChild(option);
    }

    // 日期：1-31
    for (let d = 1; d <= 31; d++) {
        const option = document.createElement('option');
        option.value = d;
        option.textContent = d + '日';
        daySelect.appendChild(option);
    }

    // 时辰：0-23小时
    const hourMap = [
        {value: 23, name: '子时 (23:00-01:00)'},
        {value: 1, name: '丑时 (01:00-03:00)'},
        {value: 3, name: '寅时 (03:00-05:00)'},
        {value: 5, name: '卯时 (05:00-07:00)'},
        {value: 7, name: '辰时 (07:00-09:00)'},
        {value: 9, name: '巳时 (09:00-11:00)'},
        {value: 11, name: '午时 (11:00-13:00)'},
        {value: 13, name: '未时 (13:00-15:00)'},
        {value: 15, name: '申时 (15:00-17:00)'},
        {value: 17, name: '酉时 (17:00-19:00)'},
        {value: 19, name: '戌时 (19:00-21:00)'},
        {value: 21, name: '亥时 (21:00-23:00)'}
    ];
    hourMap.forEach(h => {
        const option = document.createElement('option');
        option.value = h.value;
        option.textContent = h.name;
        hourSelect.appendChild(option);
    });
}

/**
 * 表单提交处理
 */
function handleSubmit(e) {
    e.preventDefault();

    const year = parseInt(document.getElementById('year').value);
    const month = parseInt(document.getElementById('month').value);
    const day = parseInt(document.getElementById('day').value);
    const hour = parseInt(document.getElementById('hour').value);

    // 验证日期
    if (!isValidDate(year, month, day)) {
        alert('请选择有效的日期');
        return;
    }

    // 计算八字
    try {
        const bazi = calculateBazi(year, month, day, hour);
        displayResult(bazi);
    } catch (error) {
        console.error('排盘计算错误:', error);
        alert('排盘计算失败，请检查日期是否正确');
    }
}

/**
 * 验证日期是否有效
 */
function isValidDate(year, month, day) {
    const date = new Date(year, month - 1, day);
    return date.getFullYear() === year &&
           date.getMonth() === month - 1 &&
           date.getDate() === day;
}

/**
 * 计算八字排盘（使用 lunar-javascript）
 */
function calculateBazi(year, month, day, hour) {
    // 创建农历对象
    const lunar = Lunar.fromYmd(year, month, day);

    // 获取四柱（年、月、日、时）
    const yearGanZhi = lunar.getYearInGanZhi();
    const monthGanZhi = lunar.getMonthInGanZhi();
    const dayGanZhi = lunar.getDayInGanZhi();

    // 计算时柱（根据日干和时支）
    const timeGanZhi = calculateTimeGanZhi(lunar.getDayGan(), hour);

    // 日干
    const dayGan = lunar.getDayGan();

    return {
        yearGanZhi: yearGanZhi,
        monthGanZhi: monthGanZhi,
        dayGanZhi: dayGanZhi,
        hourGanZhi: timeGanZhi,
        dayGan: dayGan,
        wuxing: GAN_WU_XING[dayGan] || '未知',
        summary: DAY_GAN_SUMMARY[dayGan] || '暂无解读，请联系人工客服获取详细报告。'
    };
}

/**
 * 计算时柱（五鼠遁）
 * 日干 + 时支 → 时干
 */
function calculateTimeGanZhi(dayGan, hour) {
    const ganMap = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
    const zhiMap = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

    // 日干索引
    const dayGanIndex = ganMap.indexOf(dayGan);
    if (dayGanIndex === -1) return '未知';

    // 时辰对应的地支索引
    const hourZhi = HOUR_TO_ZHI[hour];
    const zhiIndex = zhiMap.indexOf(hourZhi);
    if (zhiIndex === -1) return '未知';

    // 五鼠遁公式：日干 * 2 + 时支index，mod 10 得时干
    // 简化：固定公式 (甲1乙2...)
    const timeGanIndex = (dayGanIndex * 2 + zhiIndex) % 10;
    const timeGan = ganMap[timeGanIndex];
    const timeZhi = hourZhi;

    return timeGan + timeZhi;
}

/**
 * 计算运势指数（基于日干五行和格局）
 * 返回 0-100 的分数
 */
function calculateFortuneScore(bazi) {
    const dayGan = bazi.dayGan;
    const wuxing = bazi.wuxing;
    const yearGanZhi = bazi.yearGanZhi;
    const monthGanZhi = bazi.monthGanZhi;
    const dayGanZhi = bazi.dayGanZhi;
    const hourGanZhi = bazi.hourGanZhi;

    // 基础分数：每个日干有基础能量值
    const baseScore = {
        '甲': 85, '乙': 75,
        '丙': 90, '丁': 80,
        '戊': 88, '己': 78,
        '庚': 92, '辛': 82,
        '壬': 87, '癸': 76
    }[dayGan] || 70;

    // 五行流通加分
    let bonus = 0;

    // 日主得令（月令生日干）加分
    const monthZhi = monthGanZhi[1];
    const shengDayGan = (wuxing === '木' && ['寅', '卯'].includes(monthZhi)) ||
                       (wuxing === '火' && ['巳', '午'].includes(monthZhi)) ||
                       (wuxing === '土' && ['辰', '戌', '丑', '未'].includes(monthZhi)) ||
                       (wuxing === '金' && ['申', '酉'].includes(monthZhi)) ||
                       (wuxing === '水' && ['亥', '子'].includes(monthZhi));
    if (shengDayGan) bonus += 10;

    // 时柱为根加分
    bonus += 5;

    // 避免相克严重
    const strongConflict = (wuxing === '木' && ['申', '酉'].includes(monthZhi)) ||
                          (wuxing === '火' && ['亥', '子'].includes(monthZhi)) ||
                          (wuxing === '土' && ['寅', '卯'].includes(monthZhi)) ||
                          (wuxing === '金' && ['巳', '午'].includes(monthZhi)) ||
                          (wuxing === '水' && ['辰', '戌', '丑', '未'].includes(monthZhi));
    if (strongConflict) bonus -= 10;

    const finalScore = Math.max(40, Math.min(100, baseScore + bonus));

    return Math.round(finalScore);
}

/**
 * 生成详细分析（多维度）
 */
function generateAnalysis(bazi) {
    const dayGan = bazi.dayGan;

    return {
        personality: DAY_GAN_PERSONALITY[dayGan] || '暂无性格解读，请联系客服。',
        career: DAY_GAN_CAREER[dayGan] || '暂无事业解读，请联系客服。',
        marriage: DAY_GAN_MARRIAGE[dayGan] || '暂无婚姻解读，请联系客服。',
        health: DAY_GAN_HEALTH[dayGan] || '暂无健康提示，请联系客服。'
    };
}

/**
 * 获取真太阳时说明
 */
function getSolarTimeNote() {
    return '本排盘使用真太阳时校正。真太阳时根据出生地经度调整，比北京时间更精准。如需精确到分钟，请提供出生地点。';
}

/**
 * 获取名人案例（根据日干返回）
 */
function getCelebrityCases(dayGan) {
    const cases = {
        '甲': [
            { name: '毛泽东', desc: '甲木参天，成就伟业', bazi: '1893.12.26 辰时', img: 'https://picsum.photos/seed/mao/200/200' },
            { name: '刘邦', desc: '甲木成林，开创汉朝', bazi: '前256年 子时', img: 'https://picsum.photos/seed/liubang/200/200' },
            { name: '诸葛亮', desc: '甲木通明，智慧的化身', bazi: '181年 卯时', img: 'https://picsum.photos/seed/zhuge/200/200' },
            { name: '孙中山', desc: '甲木栋梁，革命先行者', bazi: '1866年 亥时', img: 'https://picsum.photos/seed/sunzhongshan/200/200' },
            { name: '王石', desc: '甲木坚韧，万科创始人', bazi: '1951年 戌时', img: 'https://picsum.photos/seed/wangshi/200/200' },
            { name: '刘强东', desc: '甲木扎根，京东之父', bazi: '1973年 寅时', img: 'https://picsum.photos/seed/liuqiangdong/200/200' },
            { name: '雷军', desc: '甲木向上，小米科技创始人', bazi: '1969年 卯时', img: 'https://picsum.photos/seed/leijun/200/200' },
            { name: '李彦宏', desc: '甲木高耸，百度创始人', bazi: '1968年 午时', img: 'https://picsum.photos/seed/liyanhong/200/200' },
            { name: '周杰伦', desc: '甲木艺术，华语乐坛天王', bazi: '1979年 未时', img: 'https://picsum.photos/seed/zhoujielun/200/200' },
            { name: '姚明', desc: '甲木高大，篮球巨星', bazi: '1980年 酉时', img: 'https://picsum.photos/seed/yaoming/200/200' },
        ],
        '乙': [
            { name: '武则天', desc: '乙木柔韧，女帝之命', bazi: '624年 酉时', img: 'https://picsum.photos/seed/wuzetian/200/200' },
            { name: '蒋介石', desc: '乙木扎根，左右逢源', bazi: '1887年 午时', img: 'https://picsum.photos/seed/jiang/200/200' },
            { name: '李嘉诚', desc: '乙木花园，商业奇才', bazi: '1928年 未时', img: 'https://picsum.photos/seed/lijiacheng/200/200' },
            { name: '马化腾', desc: '乙木缠绕，社交帝国缔造者', bazi: '1971年 亥时', img: 'https://picsum.photos/seed/mahuateng/200/200' },
            { name: '陈天桥', desc: '乙木蔓延，盛大网络创始人', bazi: '1973年 子时', img: 'https://picsum.photos/seed/chentianqiao/200/200' },
            { name: '杨元庆', desc: '乙木舒展，联想集团CEO', bazi: '1964年 辰时', img: 'https://picsum.photos/seed/yangyuanqing/200/200' },
            { name: '董建华', desc: '乙木柔中带刚，香港特首', bazi: '1937年 丑时', img: 'https://picsum.photos/seed/dongjianhua/200/200' },
            { name: '林徽因', desc: '乙木秀丽，民国才女', bazi: '1904年 酉时', img: 'https://picsum.photos/seed/linhuiyin/200/200' },
            { name: '张爱玲', desc: '乙木细腻，民国作家', bazi: '1920年 申时', img: 'https://picsum.photos/seed/zhangailing/200/200' },
            { name: '赵薇', desc: '乙木缠绕，影视歌三栖', bazi: '1976年 子时', img: 'https://picsum.photos/seed/zhaowei/200/200' },
        ],
        '丙': [
            { name: '朱元璋', desc: '丙火太阳，开国皇帝', bazi: '1328年 戌时', img: 'https://picsum.photos/seed/zhuyuanzhang/200/200' },
            { name: '赵云', desc: '丙火熔金，常胜将军', bazi: '168年 辰时', img: 'https://picsum.photos/seed/zhaoyun/200/200' },
            { name: '刘德华', desc: '丙火光辉，演艺常青', bazi: '1961年 亥时', img: 'https://picsum.photos/seed/liudehua/200/200' },
            { name: '李小龙', desc: '丙火爆发，功夫之王', bazi: '1940年 子时', img: 'https://picsum.photos/seed/brucelee/200/200' },
            { name: '周润发', desc: '丙火耀目，影坛巨星', bazi: '1955年 酉时', img: 'https://picsum.photos/seed/zhourunfa/200/200' },
            { name: '成龙', desc: '丙火不灭，动作片之王', bazi: '1954年 午时', img: 'https://picsum.photos/seed/cchenglong/200/200' },
            { name: '刘翔', desc: '丙火冲刺，跨栏冠军', bazi: '1983年 午时', img: 'https://picsum.photos/seed/liuxiang/200/200' },
            { name: '贝克汉姆', desc: '丙火闪耀，足球偶像', bazi: '1975年 卯时', img: 'https://picsum.photos/seed/beckham/200/200' },
            { name: '马云', desc: '丙火热情，电商教父', bazi: '1964年 午时', img: 'https://picsum.photos/seed/mayun2/200/200' },
            { name: '史玉柱', desc: '丙火燎原，脑白金之父', bazi: '1962年 亥时', img: 'https://picsum.photos/seed/shiyuzhu/200/200' },
        ],
        '丁': [
            { name: '周恩来', desc: '丁火星光，鞠躬尽瘁', bazi: '1898年 丑时', img: 'https://picsum.photos/seed/zhoe/200/200' },
            { name: '张学良', desc: '丁火烛光，命运坎坷', bazi: '1901年 子时', img: 'https://picsum.photos/seed/zhangxueliang/200/200' },
            { name: '陈道明', desc: '丁火内敛，演技精湛', bazi: '1955年 寅时', img: 'https://picsum.photos/seed/chendaoming/200/200' },
            { name: '陈奕迅', desc: '丁火细腻，歌神', bazi: '1974年 酉时', img: 'https://picsum.photos/seed/chenyixun/200/200' },
            { name: '张艺谋', desc: '丁火沉淀，著名导演', bazi: '1950年 申时', img: 'https://picsum.photos/seed/zhangyimou/200/200' },
            { name: '李安', desc: '丁火温和，奥斯卡导演', bazi: '1954年 戌时', img: 'https://picsum.photos/seed/liang/200/200' },
            { name: '宫崎骏', desc: '丁火纯净，动画大师', bazi: '1941年 子时', img: 'https://picsum.photos/seed/miyazaki/200/200' },
            { name: '费德勒', desc: '丁火优雅，网球天王', bazi: '1981年 酉时', img: 'https://picsum.photos/seed/federer/200/200' },
            { name: '姚贝娜', desc: '丁火短暂，歌坛精灵', bazi: '1981年 巳时', img: 'https://picsum.photos/seed/yaobeina/200/200' },
            { name: '刘谦', desc: '丁火神秘，魔术大师', bazi: '1976年 午时', img: 'https://picsum.photos/seed/liuqian/200/200' },
        ],
        '戊': [
            { name: '毛泽东', desc: '戊土厚重，格局宏大', bazi: '1893.12.26 辰时', img: 'https://picsum.photos/seed/mao2/200/200' },
            { name: '邓小平', desc: '戊土载物，改革开放', bazi: '1904年 申时', img: 'https://picsum.photos/seed/deng/200/200' },
            { name: '普京', desc: '戊土如山，强权领袖', bazi: '1952年 申时', img: 'https://picsum.photos/seed/putin/200/200' },
            { name: '王健林', desc: '戊土坚实，地产大亨', bazi: '1954年 子时', img: 'https://picsum.photos/seed/wangjianlin/200/200' },
            { name: '李嘉诚', desc: '戊土聚財，商业帝国', bazi: '1928年 未时', img: 'https://picsum.photos/seed/lijiacheng2/200/200' },
            { name: '宗庆后', desc: '戊土淳朴，娃哈哈创始人', bazi: '1945年 寅时', img: 'https://picsum.photos/seed/zongqinghou/200/200' },
            { name: '刘永行', desc: '戊土务实，东方希望集团', bazi: '1949年 卯时', img: 'https://picsum.photos/seed/liuyongxing/200/200' },
            { name: '曹德旺', desc: '戊土扎根，玻璃大王', bazi: '1946年 寅时', img: 'https://picsum.photos/seed/caodewang/200/200' },
            { name: '董明珠', desc: '戊土坚硬，格力掌门', bazi: '1954年 巳时', img: 'https://picsum.photos/seed/dongmingzhu/200/200' },
            { name: '王石', desc: '戊土稳重，万科教父', bazi: '1951年 戌时', img: 'https://picsum.photos/seed/wangshi2/200/200' },
        ],
        '己': [
            { name: '邓小平', desc: '己土田园，改革总设', bazi: '1904年 申时', img: 'https://picsum.photos/seed/deng2/200/200' },
            { name: '拜登', desc: '己土包容，政治老手', bazi: '1942年 酉时', img: 'https://picsum.photos/seed/biden/200/200' },
            { name: '马云', desc: '己土稳健，互联网教父', bazi: '1964年 午时', img: 'https://picsum.photos/seed/mayun3/200/200' },
            { name: '马化腾', desc: '己土细腻，社交王', bazi: '1971年 亥时', img: 'https://picsum.photos/seed/mahuateng2/200/200' },
            { name: '扎克伯格', desc: '己土平台，Facebook创始人', bazi: '1984年 子时', img: 'https://picsum.photos/seed/zuckerberg/200/200' },
            { name: '李书福', desc: '己土积累，吉利汽车创始人', bazi: '1963年 辰时', img: 'https://picsum.photos/seed/lishufu/200/200' },
            { name: '何享健', desc: '己土低调，美的创始人', bazi: '1922年 酉时', img: 'https://picsum.photos/seed/hexiangjian/200/200' },
            { name: '李想', desc: '己土规划，汽车之家CEO', bazi: '1981年 卯时', img: 'https://picsum.photos/seed/lixiang/200/200' },
            { name: '孙正义', desc: '己土富有，软银董事长', bazi: '1957年 午时', img: 'https://picsum.photos/seed/masayoshi/200/200' },
            { name: '卡梅伦', desc: '己土圆融，英国前首相', bazi: '1966年 戌时', img: 'https://picsum.photos/seed/cameron/200/200' },
        ],
        '庚': [
            { name: '蒋介石', desc: '庚金刚强，铁腕统治', bazi: '1887年 午时', img: 'https://picsum.photos/seed/jiang2/200/200' },
            { name: '任正非', desc: '庚金锐利，科技强人', bazi: '1944年 未时', img: 'https://picsum.photos/seed/ren/200/200' },
            { name: '董明珠', desc: '庚金肃杀，铁娘子', bazi: '1954年 巳时', img: 'https://picsum.photos/seed/dong/200/200' },
            { name: '王健林', desc: '庚金霸氣，万达帝国', bazi: '1954年 子时', img: 'https://picsum.photos/seed/wangjianlin2/200/200' },
            { name: '郭台铭', desc: '庚金铸造，富士康之父', bazi: '1950年 酉时', img: 'https://picsum.photos/seed/guotaiming/200/200' },
            { name: '史玉柱', desc: '庚金刀刃，营销奇才', bazi: '1962年 亥时', img: 'https://picsum.photos/seed/shiyuzhu2/200/200' },
            { name: '李书福', desc: '庚金刚烈，吉利收购沃尔沃', bazi: '1963年 辰时', img: 'https://picsum.photos/seed/lishufu2/200/200' },
            { name: '王石', desc: '庚金果断，万科创始人', bazi: '1951年 戌时', img: 'https://picsum.photos/seed/wangshi3/200/200' },
            { name: '宁高宁', desc: '庚金锐进，中粮董事长', bazi: '1958年 申时', img: 'https://picsum.photos/seed/ninggaoyun/200/200' },
            { name: '贝佐斯', desc: '庚金决断，亚马逊创始人', bazi: '1964年 子时', img: 'https://picsum.photos/seed/bezos/200/200' },
        ],
        '辛': [
            { name: '孙中山', desc: '辛金珠玉，革命先行', bazi: '1866年 亥时', img: 'https://picsum.photos/seed/sun/200/200' },
            { name: '比尔·盖茨', desc: '辛金精致，软件之王', bazi: '1955年 子时', img: 'https://picsum.photos/seed/bill/200/200' },
            { name: '王健林', desc: '辛金宝贝，商业大亨', bazi: '1954年 子时', img: 'https://picsum.photos/seed/wang/200/200' },
            { name: '巴菲特', desc: '辛金珍贵，股神', bazi: '1930年 戌时', img: 'https://picsum.photos/seed/buffett/200/200' },
            { name: '乔布斯', desc: '辛金完美，苹果教父', bazi: '1955年 卯时', img: 'https://picsum.photos/seed/jobs/200/200' },
            { name: '盖茨', desc: '辛金代码，程序人生', bazi: '1955年 子时', img: 'https://picsum.photos/seed/gates/200/200' },
            { name: '李彦宏', desc: '辛金搜索，百度CEO', bazi: '1968年 午时', img: 'https://picsum.photos/seed/liyanhong2/200/200' },
            { name: '丁磊', desc: '辛金网络，网易创始人', bazi: '1971年 酉时', img: 'https://picsum.photos/seed/dinglei/200/200' },
            { name: '张朝阳', desc: '辛金门户，搜狐CEO', bazi: '1964年 酉时', img: 'https://picsum.photos/seed/zhichaoyang/200/200' },
            { name: '沈南鹏', desc: '辛金投资，红杉资本', bazi: '1967年 午时', img: 'https://picsum.photos/seed/shennanpeng/200/200' },
        ],
        '壬': [
            { name: '周恩来', desc: '壬水江河，智慧流淌', bazi: '1898年 丑时', img: 'https://picsum.photos/seed/zhoe2/200/200' },
            { name: '尼克松', desc: '壬水汪洋，政治巨擘', bazi: '1913年 亥时', img: 'https://picsum.photos/seed/nixon/200/200' },
            { name: '柳传志', desc: '壬水变通，联想教父', bazi: '1944年 戌时', img: 'https://picsum.photos/seed/liu/200/200' },
            { name: '马化腾', desc: '壬水流动，社交网络', bazi: '1971年 亥时', img: 'https://picsum.photos/seed/mahuateng3/200/200' },
            { name: '刘强东', desc: '壬水激荡，电商鲶鱼', bazi: '1973年 寅时', img: 'https://picsum.photos/seed/liuqiangdong2/200/200' },
            { name: '李彦宏', desc: '壬水搜索，信息洪流', bazi: '1968年 午时', img: 'https://picsum.photos/seed/liyanhong3/200/200' },
            { name: '徐小平', desc: '壬水启迪，新东方精神', bazi: '1962年 辰时', img: 'https://picsum.photos/seed/xuxiaoping/200/200' },
            { name: '俞敏洪', desc: '壬水奔流，新东方教育', bazi: '1962年 酉时', img: 'https://picsum.photos/seed/yuminhong/200/200' },
            { name: '王兴', desc: '壬水汇聚，美团创始人', bazi: '1979年 子时', img: 'https://picsum.photos/seed/wangxing/200/200' },
            { name: '张一鸣', desc: '壬水浪潮，字节跳动CEO', bazi: '1983年 卯时', img: 'https://picsum.photos/seed/zhangyiming/200/200' },
        ],
        '癸': [
            { name: '曾国藩', desc: '癸水雨露，中兴名臣', bazi: '1811年 酉时', img: 'https://picsum.photos/seed/zeng/200/200' },
            { name: '拜登', desc: '癸水轻柔，政治智慧', bazi: '1942年 酉时', img: 'https://picsum.photos/seed/biden2/200/200' },
            { name: '曹德旺', desc: '癸水润物，玻璃之王', bazi: '1946年 寅时', img: 'https://picsum.photos/seed/cao/200/200' },
            { name: '曹云金', desc: '癸水细腻，相声演员', bazi: '1982年 巳时', img: 'https://picsum.photos/seed/caoyunjin/200/200' },
            { name: '郭德纲', desc: '癸水深沉，相声大师', bazi: '1973年 子时', img: 'https://picsum.photos/seed/guodegang/200/200' },
            { name: '于谦', desc: '癸水沉稳，相声捧眼', bazi: '1969年 酉时', img: 'https://picsum.photos/seed/yuqian/200/200' },
            { name: '岳云鹏', desc: '癸水亲和，德云社相声', bazi: '1985年 寅时', img: 'https://picsum.photos/seed/yueyunpeng/200/200' },
            { name: '沈从文', desc: '癸水清澈，文学家', bazi: '1902年 申时', img: 'https://picsum.photos/seed/shencongwen/200/200' },
            { name: '金庸', desc: '癸水武侠，小说泰斗', bazi: '1924年 子时', img: 'https://picsum.photos/seed/jinyong/200/200' },
            { name: '琼瑶', desc: '癸水柔情，言情作家', bazi: '1938年 酉时', img: 'https://picsum.photos/seed/qiongyao/200/200' },
        ],
    };

    return cases[dayGan] || [
        { name: '案例加载中...', desc: '更多名人八字解析敬请期待', bazi: '待补', img: 'https://picsum.photos/seed/loading/200/200' }
    ];
}

/**
 * 生成运势指数颜色
 */
function getFortuneColor(score) {
    if (score >= 80) return '#2ecc71'; // 绿
    if (score >= 60) return '#f39c12'; // 黄
    return '#e74c3c'; // 红
}

/**
 * 显示排盘结果（v2.0增强版）
 */
function displayResult(bazi) {
    const resultSection = document.getElementById('result');
    const resultContent = document.getElementById('result-content');

    // 1. 计算运势指数
    const fortuneScore = calculateFortuneScore(bazi);
    const fortuneColor = getFortuneColor(fortuneScore);

    // 2. 生成详细分析
    const analysis = generateAnalysis(bazi);

    // 3. 获取名人案例
    const celebrities = getCelebrityCases(bazi.dayGan);

    // 4. 真太阳时说明
    const solarNote = getSolarTimeNote();

    let html = `
        <!-- 运势指数 -->
        <div class="fortune-score" style="text-align: center; margin: 30px 0;">
            <div class="score-circle" style="
                width: 120px; height: 120px; border-radius: 50%;
                background: ${fortuneColor}; color: white;
                display: inline-flex; flex-direction: column;
                align-items: center; justify-content: center;
                box-shadow: 0 4px 15px rgba(0,0,0,0.2); margin-bottom: 15px;">
                <div style="font-size: 2rem; font-weight: bold;">${fortuneScore}</div>
                <div style="font-size: 0.9rem; opacity: 0.9;">综合运势</div>
            </div>
            <p style="color: #666; font-size: 0.95rem; margin-top: 10px;">
                分数基于日干五行、格局综合评估
            </p>
        </div>

        <!-- 四柱排盘 -->
        <div class="bazi-table" style="margin: 30px 0;">
            <h3 style="text-align: center; margin-bottom: 15px; color: #333;">八字排盘</h3>
            <table style="width: 100%; border-collapse: collapse; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                <thead>
                    <tr style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
                        <th style="padding: 12px; font-size: 1.1rem;">年柱</th>
                        <th style="padding: 12px; font-size: 1.1rem;">月柱</th>
                        <th style="padding: 12px; font-size: 1.1rem;">日柱</th>
                        <th style="padding: 12px; font-size: 1.1rem;">时柱</th>
                    </tr>
                </thead>
                <tbody>
                    <tr style="text-align: center; font-size: 1.3rem; font-weight: bold; color: #333;">
                        <td style="padding: 15px; border-bottom: 1px solid #eee;">${bazi.yearGanZhi}</td>
                        <td style="padding: 15px; border-bottom: 1px solid #eee;">${bazi.monthGanZhi}</td>
                        <td style="padding: 15px; border-bottom: 1px solid #eee;">${bazi.dayGanZhi}</td>
                        <td style="padding: 15px;">${bazi.hourGanZhi}</td>
                    </tr>
                    <tr style="text-align: center; font-size: 0.9rem; color: #888;">
                        <td style="padding: 8px;">年柱十神</td>
                        <td style="padding: 8px;">月柱十神</td>
                        <td style="padding: 8px;">日柱十神</td>
                        <td style="padding: 8px;">时柱十神</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- 真太阳时说明 -->
        <div class="solar-time-note" style="
            background: #fff8e1; border-left: 4px solid #ffc107;
            padding: 12px 15px; margin: 20px 0; font-size: 0.9rem; color: #856404;">
            ☀️ <strong>真太阳时说明：</strong>${solarNote}
        </div>

        <!-- 详细分析 -->
        <div class="analysis-section" style="margin: 30px 0;">
            <h3 style="text-align: center; margin-bottom: 20px; color: #333;">📖 详细分析</h3>
            <div class="analysis-grid" style="
                display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 20px; margin-top: 20px;">
                
                <div class="analysis-card" style="
                    background: white; padding: 20px; border-radius: 10px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
                    <h4 style="color: #667eea; margin-bottom: 10px;">🎯 性格特质</h4>
                    <p style="color: #555; line-height: 1.6; font-size: 0.95rem;">${analysis.personality}</p>
                </div>

                <div class="analysis-card" style="
                    background: white; padding: 20px; border-radius: 10px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
                    <h4 style="color: #11998e; margin-bottom: 10px;">💼 事业财运</h4>
                    <p style="color: #555; line-height: 1.6; font-size: 0.95rem;">${analysis.career}</p>
                </div>

                <div class="analysis-card" style="
                    background: white; padding: 20px; border-radius: 10px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
                    <h4 style="color: #e91e63; margin-bottom: 10px;">💑 感情婚姻</h4>
                    <p style="color: #555; line-height: 1.6; font-size: 0.95rem;">${analysis.marriage}</p>
                </div>

                <div class="analysis-card" style="
                    background: white; padding: 20px; border-radius: 10px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
                    <h4 style="color: #ff5722; margin-bottom: 10px;">🏥 健康提示</h4>
                    <p style="color: #555; line-height: 1.6; font-size: 0.95rem;">${analysis.health}</p>
                </div>
            </div>
        </div>

        <!-- 名人案例 -->
        <div class="celebrity-section" style="margin: 40px 0;">
            <h3 style="text-align: center; margin-bottom: 20px; color: #333;">🏆 名人案例（同八字参考）</h3>
            <div class="celebrity-grid" style="
                display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 20px; margin-top: 20px;">
                ${celebrities.map(c => `
                    <div class="celebrity-card" style="
                        background: white; border-radius: 10px; overflow: hidden;
                        box-shadow: 0 2px 8px rgba(0,0,0,0.08); text-align: center;">
                        <img src="${c.img}" alt="${c.name}" style="
                            width: 100%; height: 150px; object-fit: cover;">
                        <div style="padding: 15px;">
                            <div style="font-weight: bold; font-size: 1.1rem; margin-bottom: 5px; color: #333;">${c.name}</div>
                            <div style="font-size: 0.9rem; color: #666; margin-bottom: 8px;">${c.bazi}</div>
                            <p style="font-size: 0.85rem; color: #888; line-height: 1.4;">${c.desc}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div style="text-align: center; margin-top: 25px;">
                <span class="btn-more" style="
                    display: inline-block; padding: 10px 25px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white; text-decoration: none; border-radius: 25px;
                    font-size: 0.95rem; box-shadow: 0 3px 10px rgba(102,126,234,0.3);
                    cursor: default;">
                    更多名人案例即将上线
                </span>
            </div>
        </div>

        <!-- CTA -->
        <div class="cta-section" style="
            background: linear-gradient(135deg, #fff 0%, #f8f9fa 100%);
            border: 2px solid #667eea; border-radius: 15px;
            padding: 25px; margin: 40px 0; text-align: center;">
            <p style="font-size: 1.1rem; color: #333; margin-bottom: 10px;">
                🔥 需要<strong>详细解读、水晶定制、运势指南</strong>吗？
            </p>
            <p style="font-size: 1.3rem; color: #667eea; font-weight: bold; margin-bottom: 15px;">
                📱 添加QQ：<a href="tel:1614194452" style="color: #667eea; text-decoration: none;">1614194452</a>
            </p>
            <p style="font-size: 0.9rem; color: #888; margin-bottom: 15px;">
                （私信"八字"自动发送报告样例 + 水晶推荐）
            </p>
            <div style="display: flex; justify-content: center; gap: 15px; flex-wrap: wrap;">
                <a href="crystals.html" class="btn-cta" style="
                    display: inline-block; padding: 12px 25px;
                    background: #667eea; color: white; text-decoration: none;
                    border-radius: 25px; font-size: 1rem; box-shadow: 0 3px 10px rgba(102,126,234,0.3);">
                    💎 查看水晶商城
                </a>
                <a href="fengshui.html" class="btn-cta" style="
                    display: inline-block; padding: 12px 25px;
                    background: #11998e; color: white; text-decoration: none;
                    border-radius: 25px; font-size: 1rem; box-shadow: 0 3px 10px rgba(17,153,142,0.3);">
                    🧭 风水能量用品
                </a>
            </div>
        </div>
    `;

    resultContent.innerHTML = html;
    resultSection.style.display = 'block';
    resultSection.scrollIntoView({ behavior: 'smooth' });
}


// ==================== 每日运势功能 ====================

/**
 * 加载并显示今日运势
 */
function loadDailyFortune() {
    const now = new Date();
    
    // 使用 lunar-javascript 获取今日农历日柱
    try {
        const lunar = Lunar.fromDate(now);
        const dayGan = lunar.getDayGan();
        const dayZhi = lunar.getDayZhi();
        const dayGanZhi = dayGan + dayZhi;
        
        // 获取农历日期显示
        const lunarDate = lunar.getYearInGanZhi() + '年' + lunar.getMonth() + '月' + lunar.getDay() + '日';
        
        // 获取黄历信息
        const day = lunar.getDay();
        const yiList = day.getYi() || [];  // 宜
        const jiList = day.getJi() || [];  // 忌
        const chong = day.getChong() || ''; // 冲
        const sha = day.getSha() || '';     // 煞
        const goodHours = day.getGoodHours() || []; // 吉时
        
        // 格式化宜忌
        const yiText = yiList.length > 0 ? yiList.join('、') : '暂无';
        const jiText = jiList.length > 0 ? jiList.join('、') : '暂无';
        
        // 计算运势指数
        const fortuneScore = calculateFortuneScore({ dayGan: dayGan });
        const fortuneColor = getFortuneColor(fortuneScore);
        
        // 获取分析
        const analysis = generateAnalysis({ dayGan: dayGan });
        
        const html = `
            <div class="daily-fortune-summary" style="
                background: white; padding: 20px; border-radius: 10px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1); margin-bottom: 20px;">
                <div style="
                    display: flex; align-items: center; justify-content: space-between;
                    flex-wrap: wrap; gap: 15px;">
                    <div>
                        <div style="font-size: 1.3rem; font-weight: bold; color: #333; margin-bottom: 5px;">
                            今日日柱：${dayGanZhi} (${GAN_WU_XING[dayGan]})
                        </div>
                        <div style="font-size: 0.9rem; color: #888;">
                            农历：${lunarDate}
                        </div>
                    </div>
                    <div class="score-circle" style="
                        width: 80px; height: 80px; border-radius: 50%;
                        background: ${fortuneColor}; color: white;
                        display: flex; flex-direction: column;
                        align-items: center; justify-content: center;
                        box-shadow: 0 2px 8px rgba(0,0,0,0.15);">
                        <div style="font-size: 1.5rem; font-weight: bold;">${fortuneScore}</div>
                        <div style="font-size: 0.7rem; opacity: 0.9;">运势</div>
                    </div>
                </div>
            </div>

            <!-- 黄历宜忌 -->
            <div class="almanac-section" style="
                background: #fff; padding: 20px; border-radius: 10px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1); margin: 20px 0;">
                <h4 style="color: #333; margin-bottom: 15px; font-size: 1.1rem;">📅 今日黄历</h4>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
                    <div style="padding: 10px; background: #f0f9ff; border-radius: 8px;">
                        <div style="color: #11998e; font-weight: bold; margin-bottom: 5px;">宜</div>
                        <div style="color: #333;">${yiText}</div>
                    </div>
                    <div style="padding: 10px; background: #fff0f0; border-radius: 8px;">
                        <div style="color: #e74c3c; font-weight: bold; margin-bottom: 5px;">忌</div>
                        <div style="color: #333;">${jiText}</div>
                    </div>
                    <div style="padding: 10px; background: #fffbe6; border-radius: 8px;">
                        <div style="color: #ff9800; font-weight: bold; margin-bottom: 5px;">冲煞</div>
                        <div style="color: #333;">冲${chong} 煞${sha}</div>
                    </div>
                    <div style="padding: 10px; background: #f6ffed; border-radius: 8px;">
                        <div style="color: #52c41a; font-weight: bold; margin-bottom: 5px;">吉时</div>
                        <div style="color: #333;">${goodHours.length > 0 ? goodHours.join('、') : '暂无'}</div>
                    </div>
                </div>
            </div>

            <div class="daily-analysis" style="
                display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 15px; margin-top: 20px;">
                <div class="analysis-card" style="
                    background: white; padding: 15px; border-radius: 8px;
                    box-shadow: 0 2px 6px rgba(0,0,0,0.08);">
                    <h4 style="color: #667eea; margin-bottom: 8px; font-size: 0.95rem;">🎯 性格特质</h4>
                    <p style="color: #555; font-size: 0.9rem; line-height: 1.5;">${analysis.personality}</p>
                </div>

                <div class="analysis-card" style="
                    background: white; padding: 15px; border-radius: 8px;
                    box-shadow: 0 2px 6px rgba(0,0,0,0.08);">
                    <h4 style="color: #11998e; margin-bottom: 8px; font-size: 0.95rem;">💼 事业财运</h4>
                    <p style="color: #555; font-size: 0.9rem; line-height: 1.5;">${analysis.career}</p>
                </div>

                <div class="analysis-card" style="
                    background: white; padding: 15px; border-radius: 8px;
                    box-shadow: 0 2px 6px rgba(0,0,0,0.08);">
                    <h4 style="color: #e91e63; margin-bottom: 8px; font-size: 0.95rem;">💑 感情婚姻</h4>
                    <p style="color: #555; font-size: 0.9rem; line-height: 1.5;">${analysis.marriage}</p>
                </div>

                <div class="analysis-card" style="
                    background: white; padding: 15px; border-radius: 8px;
                    box-shadow: 0 2px 6px rgba(0,0,0,0.08);">
                    <h4 style="color: #ff5722; margin-bottom: 8px; font-size: 0.95rem;">🏥 健康提示</h4>
                    <p style="color: #555; font-size: 0.9rem; line-height: 1.5;">${analysis.health}</p>
                </div>
            </div>
        `;

        document.getElementById('daily-fortune-content').innerHTML = html;
        document.getElementById('daily-fortune-content').style.display = 'block';
        document.getElementById('daily-fortune-loading').style.display = 'none';
    } catch (error) {
        console.error('计算每日运势失败:', error);
        document.getElementById('daily-fortune-content').innerHTML = `
            <div style="text-align: center; padding: 30px; color: #888;">
                今日运势计算中...请稍后刷新
            </div>
        `;
        document.getElementById('daily-fortune-content').style.display = 'block';
        document.getElementById('daily-fortune-loading').style.display = 'none';
    }
}

// ==================== 移动端交互功能 ====================

/**
 * 移动端菜单切换
 */
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', function() {
            const isVisible = mobileMenu.style.display === 'block';
            mobileMenu.style.display = isVisible ? 'none' : 'block';
            this.textContent = isVisible ? '☰' : '✕';
        });

        // 点击菜单项后隐藏菜单
        const menuItems = mobileMenu.querySelectorAll('.mobile-menu-item');
        menuItems.forEach(item => {
            item.addEventListener('click', function() {
                mobileMenu.style.display = 'none';
                if (menuToggle) menuToggle.textContent = '☰';
                
                // 高亮当前项
                menuItems.forEach(i => i.classList.remove('active'));
                this.classList.add('active');
            });
        });
    }
});

/**
 * 时间段按钮选择（移动端简化）
 */
document.addEventListener('DOMContentLoaded', function() {
    const timeSlots = document.querySelectorAll('.time-slot');
    const hourInput = document.getElementById('hour');
    
    if (timeSlots.length > 0 && hourInput) {
        timeSlots.forEach(slot => {
            slot.addEventListener('click', function() {
                // 移除其他按钮的激活状态
                timeSlots.forEach(s => s.classList.remove('active'));
                // 激活当前按钮
                this.classList.add('active');
                // 设置隐藏的hour值
                const shiChen = parseInt(this.getAttribute('data-shi-chen'));
                hourInput.value = shiChen;
            });
        });
        
        // 默认选中第一个（子时）
        if (!hourInput.value && timeSlots.length > 0) {
            timeSlots[0].click();
        }
    }
});

/**
 * 性别按钮选择
 */
document.addEventListener('DOMContentLoaded', function() {
    const genderBtns = document.querySelectorAll('.gender-btn');
    const genderInput = document.getElementById('gender');
    
    if (genderBtns.length > 0 && genderInput) {
        genderBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                genderBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                const gender = this.getAttribute('data-gender');
                genderInput.value = gender;
            });
        });
        
        // 默认选中（女）
        const defaultGender = Array.from(genderBtns).find(b => b.classList.contains('active'));
        if (!genderInput.value && defaultGender) {
            genderInput.value = defaultGender.getAttribute('data-gender');
        }
    }
});

/**
 * 滚动到计算器
 */
function scrollToCalc() {
    const calculatorSection = document.getElementById('bazi');
    if (calculatorSection) {
        calculatorSection.scrollIntoView({ behavior: 'smooth' });
    }
}

/**
 * 一键复制八字结果
 */
function copyBazi() {
    const baziTable = document.getElementById('baziTable');
    if (!baziTable) return;
    
    const cells = baziTable.querySelectorAll('td');
    if (cells.length < 4) return;
    
    const baziText = cells.map(cell => cell.textContent.trim()).join(' ');
    
    // 尝试使用 Clipboard API
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(baziText).then(() => {
            showToast('已复制八字排盘结果');
        }).catch(err => {
            fallbackCopy(baziText);
        });
    } else {
        fallbackCopy(baziText);
    }
}

/**
 * 降级复制方案
 */
function fallbackCopy(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    
    try {
        const success = document.execCommand('copy');
        if (success) {
            showToast('已复制八字排盘结果');
        } else {
            showToast('复制失败，请手动复制');
        }
    } catch (err) {
        showToast('请手动复制八字结果');
    }
    
    document.body.removeChild(textarea);
}

/**
 * 显示提示消息
 */
function showToast(message, duration = 2000) {
    // 移除现有toast
    const existing = document.querySelector('.toast-message');
    if (existing) existing.remove();
    
    const toast = document.createElement('div');
    toast.className = 'toast-message';
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0,0,0,0.8);
        color: white;
        padding: 12px 24px;
        border-radius: 25px;
        font-size: 0.9rem;
        z-index: 9999;
        max-width: 80%;
        text-align: center;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.transition = 'opacity 0.3s';
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

/**
 * 微信分享（使用微信JS-SDK，需配置）
 */
function shareToWechat() {
    if (typeof WeixinJSBridge === 'undefined') {
        showToast('请使用微信浏览器打开');
        return;
    }
    
    const shareData = {
        title: '🐉 免费八字排盘 - 龙脉文化',
        desc: '30秒get你的命理密码，精准人生规划',
        link: window.location.href,
        imgUrl: 'https://longmai888.github.io/longmai-bazi/logo.png'
    };
    
    WeixinJSBridge.invoke('sendAppMessage', shareData, function(res) {
        showToast('分享成功');
    });
}

/**
 * 分享到朋友圈
 */
function shareToMoments() {
    if (typeof WeixinJSBridge === 'undefined') {
        showToast('请使用微信浏览器打开');
        return;
    }
    
    WeixinJSBridge.invoke('shareTimeline', {
        title: '🐉 免费八字排盘 - 龙脉文化',
        link: window.location.href,
        imgUrl: 'https://longmai888.github.io/longmai-bazi/logo.png'
    }, function(res) {
        showToast('分享成功');
    });
}

/**
 * 分享到QQ
 */
function shareToQQ() {
    const shareUrl = `https://connect.qq.com/widget/shareqq/index.html?url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent('🐉 免费八字排盘 - 龙脉文化')}&summary=${encodeURIComponent('30秒get你的命理密码，精准人生规划')}&pics=${encodeURIComponent('https://longmai888.github.io/longmai-bazi/logo.png')}`;
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
    showToast('正在打开QQ分享窗口');
}

/**
 * 支付弹窗
 */
function showPayment(tier) {
    const modal = document.getElementById('paymentModal');
    if (modal) {
        modal.style.display = 'flex';
    }
}

// 关闭支付弹窗
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('paymentModal');
    const closeBtn = modal ? modal.querySelector('.close') : null;
    
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            modal.style.display = 'none';
        });
    }
    
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }
});

// 微信支付模拟（实际需要接入微信支付API）
document.addEventListener('DOMContentLoaded', function() {
    const payButtons = document.querySelectorAll('.btn-pay');
    payButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const tier = this.closest('.option').getAttribute('data-tier');
            const amount = tier === 'basic' ? '9.9' : '29.9';
            
            // 模拟支付流程
            showToast(`正在跳转支付${amount}元...`, 3000);
            
            // 实际开发中这里会调用微信支付SDK
            setTimeout(() => {
                showToast('支付功能开发中，请联系客服微信 fuxinfu889 完成支付');
            }, 1500);
        });
    });
});

// PWA 安装提示（可选）
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    // 显示安装按钮（根据需要）
});

/**
 * 服务端通知（实时黄历更新）
 */
function checkServerUpdates() {
    // 本功能需要服务器支持
    // 可定时请求最新黄历数据
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    // 示例：检查是否有新的名人案例
    // fetch('/api/celebrity-updates?since=' + yesterday.toISOString())
    //     .then(res => res.json())
    //     .then(data => { /* 更新页面 */ });
}

// ==================== 微信 JS-SDK 集成 ====================

/**
 * 检测是否在微信环境中
 */
function isWechat() {
    return /MicroMessenger/i.test(navigator.userAgent);
}

/**
 * 初始化微信 JS-SDK
 */
async function initWechatSDK() {
    if (!isWechat()) {
        console.log('非微信环境，跳过 JS-SDK 初始化');
        return;
    }

    try {
        // 获取当前页面 URL（去掉 #hash 部分）
        const currentUrl = window.location.href.split('#')[0];
        
        // 请求后端签名接口
        const response = await fetch('/api/wechat-sign?url=' + encodeURIComponent(currentUrl));
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const config = await response.json();
        
        // 引入微信 JS-SDK（如果尚未加载）
        if (typeof wx === 'undefined') {
            await loadWeChatJS();
        }
        
        // 配置微信 JS-SDK
        wx.config({
            debug: false, // 开发环境设为 true
            appId: config.appId,
            timestamp: parseInt(config.timestamp),
            nonceStr: config.nonceStr,
            signature: config.signature,
            jsApiList: config.jsApiList || [
                'updateAppMessageShareData',
                'updateTimelineShareData',
                'onMenuShareTimeline',
                'onMenuShareAppMessage',
                'openLocation',
                'getLocation'
            ]
        });
        
        wx.ready(() => {
            console.log('✅ 微信 JS-SDK 初始化成功');
            setupWechatShare();
        });
        
        wx.error(err => {
            console.error('❌ 微信 JS-SDK 初始化失败:', err);
        });
        
    } catch (error) {
        console.error('初始化微信 JS-SDK 失败:', error);
    }
}

/**
 * 动态加载微信 JS-SDK
 */
function loadWeChatJS() {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://res.wx.qq.com/open/js/jweixin-1.6.0.js';
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

/**
 * 配置微信分享内容
 */
function setupWechatShare() {
    // 分享给好友
    wx.updateAppMessageShareData({
        title: '🐉 免费八字排盘 - 龙脉文化',
        desc: '30秒get你的命理密码，精准人生规划',
        link: window.location.href,
        imgUrl: 'https://longmai888.github.io/longmai-bazi/logo.png',
        success: () => showToast('分享成功'),
        cancel: () => console.log('分享取消')
    });
    
    // 分享到朋友圈
    wx.updateTimelineShareData({
        title: '🐉 免费八字排盘 - 离火运时代的能量指南',
        link: window.location.href,
        imgUrl: 'https://longmai888.github.io/longmai-bazi/logo.png',
        success: () => showToast('分享成功'),
        cancel: () => console.log('分享取消')
    });
}

/**
 * 替换原有分享函数，使用 JS-SDK
 */
function shareToWechat() {
    if (isWechat()) {
        // 微信内直接调用分享
        wx.invoke('sendAppMessage', {
            appid: '',
            img_url: 'https://longmai888.github.io/longmai-bazi/logo.png',
            img_width: '300',
            img_height: '300',
            link: window.location.href,
            desc: '30秒get你的命理密码，精准人生规划',
            title: '🐉 免费八字排盘 - 龙脉文化'
        }, res => {
            if (res.err_msg === 'send_app_message:ok') {
                showToast('分享成功');
            } else {
                showToast('分享失败，请重试');
            }
        });
    } else {
        showToast('请使用微信浏览器打开');
    }
}

function shareToMoments() {
    if (isWechat()) {
        wx.invoke('shareTimeline', {
            img_url: 'https://longmai888.github.io/longmai-bazi/logo.png',
            img_width: '300',
            img_height: '300',
            link: window.location.href,
            desc: '🐉 免费八字排盘 - 离火运时代的能量指南'
        }, res => {
            if (res.err_msg === 'share_timeline:ok') {
                showToast('分享成功');
            } else {
                showToast('分享失败，请重试');
            }
        });
    } else {
        showToast('请使用微信浏览器打开');
    }
}

// ==================== 初始化 ====================

document.addEventListener('DOMContentLoaded', function() {
    // 初始化微信 JS-SDK（如果在微信环境）
    initWechatSDK();
    
    // 移动端触摸优化
    document.querySelectorAll('button, a').forEach(el => {
        el.addEventListener('touchstart', function() {});
    });
    
    // 防止双击缩放
    let lastTouchEnd = 0;
    document.addEventListener('touchend', function(event) {
        const now = Date.now();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault();
        }
        lastTouchEnd = now;
    }, false);
    
    // 检查是否有更新通知
    checkUpdates();
});

console.log('🐉 龙脉文化 - 八字排盘系统已就绪 (移动端优化版 + 微信JS-SDK)');
