/**
 * 龙脉文化八字分析报告生成系统
 * 专业版 - 完整命理分析
 */

// 八字分析报告生成器
class BaziReportGenerator {
    constructor() {
        this.reportData = {};
        this.initData();
    }

    // 初始化基础数据
    initData() {
        // 天干
        this.tianGan = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
        // 地支
        this.diZhi = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
        // 五行
        this.wuXing = {
            '甲': '木', '乙': '木', '丙': '火', '丁': '火', '戊': '土',
            '己': '土', '庚': '金', '辛': '金', '壬': '水', '癸': '水',
            '子': '水', '丑': '土', '寅': '木', '卯': '木', '辰': '土',
            '巳': '火', '午': '火', '未': '土', '申': '金', '酉': '金',
            '戌': '土', '亥': '水'
        };
        // 十神
        this.shiShen = {
            '甲': { '甲': '比肩', '乙': '劫财', '丙': '食神', '丁': '伤官', '戊': '偏财', 
                   '己': '正财', '庚': '七杀', '辛': '正官', '壬': '偏印', '癸': '正印' },
            '乙': { '甲': '劫财', '乙': '比肩', '丙': '伤官', '丁': '食神', '戊': '正财', 
                   '己': '偏财', '庚': '正官', '辛': '七杀', '壬': '正印', '癸': '偏印' },
            '丙': { '甲': '偏印', '乙': '正印', '丙': '比肩', '丁': '劫财', '戊': '食神', 
                   '己': '伤官', '庚': '偏财', '辛': '正财', '壬': '七杀', '癸': '正官' },
            '丁': { '甲': '正印', '乙': '偏印', '丙': '劫财', '丁': '比肩', '戊': '伤官', 
                   '己': '食神', '庚': '正财', '辛': '偏财', '壬': '正官', '癸': '七杀' },
            '戊': { '甲': '七杀', '乙': '正官', '丙': '偏印', '丁': '正印', '戊': '比肩', 
                   '己': '劫财', '庚': '食神', '辛': '伤官', '壬': '偏财', '癸': '正财' },
            '己': { '甲': '正官', '乙': '七杀', '丙': '正印', '丁': '偏印', '戊': '劫财', 
                   '己': '比肩', '庚': '伤官', '辛': '食神', '壬': '正财', '癸': '偏财' },
            '庚': { '甲': '偏财', '乙': '正财', '丙': '七杀', '丁': '正官', '戊': '偏印', 
                   '己': '正印', '庚': '比肩', '辛': '劫财', '壬': '食神', '癸': '伤官' },
            '辛': { '甲': '正财', '乙': '偏财', '丙': '正官', '丁': '七杀', '戊': '正印', 
                   '己': '偏印', '庚': '劫财', '辛': '比肩', '壬': '伤官', '癸': '食神' },
            '壬': { '甲': '食神', '乙': '伤官', '丙': '偏财', '丁': '正财', '戊': '七杀', 
                   '己': '正官', '庚': '偏印', '辛': '正印', '壬': '比肩', '癸': '劫财' },
            '癸': { '甲': '伤官', '乙': '食神', '丙': '正财', '丁': '偏财', '戊': '正官', 
                   '己': '七杀', '庚': '正印', '辛': '偏印', '壬': '劫财', '癸': '比肩' }
        };
        // 纳音
        this.naYin = {
            '甲子': '海中金', '乙丑': '海中金', '丙寅': '炉中火', '丁卯': '炉中火',
            '戊辰': '大林木', '己巳': '大林木', '庚午': '路旁土', '辛未': '路旁土',
            '壬申': '剑锋金', '癸酉': '剑锋金', '甲戌': '山头火', '乙亥': '山头火',
            '丙子': '涧下水', '丁丑': '涧下水', '戊寅': '城头土', '己卯': '城头土',
            '庚辰': '白蜡金', '辛巳': '白蜡金', '壬午': '杨柳木', '癸未': '杨柳木',
            '甲申': '泉中水', '乙酉': '泉中水', '丙戌': '屋上土', '丁亥': '屋上土',
            '戊子': '霹雳火', '己丑': '霹雳火', '庚寅': '松柏木', '辛卯': '松柏木',
            '壬辰': '长流水', '癸巳': '长流水', '甲午': '沙中金', '乙未': '沙中金',
            '丙申': '山下火', '丁酉': '山下火', '戊戌': '平地木', '己亥': '平地木',
            '庚子': '壁上土', '辛丑': '壁上土', '壬寅': '金箔金', '癸卯': '金箔金',
            '甲辰': '覆灯火', '乙巳': '覆灯火', '丙午': '天河水', '丁未': '天河水',
            '戊申': '大驿土', '己酉': '大驿土', '庚戌': '钗钏金', '辛亥': '钗钏金',
            '壬子': '桑柘木', '癸丑': '桑柘木', '甲寅': '大溪水', '乙卯': '大溪水',
            '丙辰': '沙中土', '丁巳': '沙中土', '戊午': '天上火', '己未': '天上火',
            '庚申': '石榴木', '辛酉': '石榴木', '壬戌': '大海水', '癸亥': '大海水'
        };
        // 生肖
        this.shengXiao = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];
        // 星座
        this.xingZuo = [
            { name: '摩羯座', start: [1, 1], end: [1, 19] },
            { name: '水瓶座', start: [1, 20], end: [2, 18] },
            { name: '双鱼座', start: [2, 19], end: [3, 20] },
            { name: '白羊座', start: [3, 21], end: [4, 19] },
            { name: '金牛座', start: [4, 20], end: [5, 20] },
            { name: '双子座', start: [5, 21], end: [6, 21] },
            { name: '巨蟹座', start: [6, 22], end: [7, 22] },
            { name: '狮子座', start: [7, 23], end: [8, 22] },
            { name: '处女座', start: [8, 23], end: [9, 22] },
            { name: '天秤座', start: [9, 23], end: [10, 23] },
            { name: '天蝎座', start: [10, 24], end: [11, 22] },
            { name: '射手座', start: [11, 23], end: [12, 21] },
            { name: '摩羯座', start: [12, 22], end: [12, 31] }
        ];
        // 星宿
        this.xingXiu = ['角', '亢', '氐', '房', '心', '尾', '箕', '斗', '牛', '女', '虚', '危', 
                        '室', '壁', '奎', '娄', '胃', '昴', '毕', '觜', '参', '井', '鬼', '柳', 
                        '星', '张', '翼', '轸'];
        // 十二长生
        this.shiErChangSheng = ['长生', '沐浴', '冠带', '临官', '帝旺', '衰', '病', '死', '墓', '绝', '胎', '养'];
        // 节气
        this.jieQi = [
            { name: '立春', month: 2, day: 4 }, { name: '雨水', month: 2, day: 19 },
            { name: '惊蛰', month: 3, day: 6 }, { name: '春分', month: 3, day: 21 },
            { name: '清明', month: 4, day: 5 }, { name: '谷雨', month: 4, day: 20 },
            { name: '立夏', month: 5, day: 6 }, { name: '小满', month: 5, day: 21 },
            { name: '芒种', month: 6, day: 6 }, { name: '夏至', month: 6, day: 21 },
            { name: '小暑', month: 7, day: 7 }, { name: '大暑', month: 7, day: 23 },
            { name: '立秋', month: 8, day: 8 }, { name: '处暑', month: 8, day: 23 },
            { name: '白露', month: 9, day: 8 }, { name: '秋分', month: 9, day: 23 },
            { name: '寒露', month: 10, day: 8 }, { name: '霜降', month: 10, day: 23 },
            { name: '立冬', month: 11, day: 7 }, { name: '小雪', month: 11, day: 22 },
            { name: '大雪', month: 12, day: 7 }, { name: '冬至', month: 12, day: 22 },
            { name: '小寒', month: 1, day: 6 }, { name: '大寒', month: 1, day: 20 }
        ];
    }

    // 计算年柱
    calculateYearGanZhi(year, month, day) {
        // 以立春为界
        const liChun = this.jieQi.find(j => j.name === '立春');
        const isBeforeLiChun = month < liChun.month || (month === liChun.month && day < liChun.day);
        const actualYear = isBeforeLiChun ? year - 1 : year;
        
        const ganIndex = (actualYear - 4) % 10;
        const zhiIndex = (actualYear - 4) % 12;
        
        return {
            gan: this.tianGan[ganIndex],
            zhi: this.diZhi[zhiIndex],
            ganZhi: this.tianGan[ganIndex] + this.diZhi[zhiIndex]
        };
    }

    // 计算月柱
    calculateMonthGanZhi(year, month, day) {
        const yearGan = this.calculateYearGanZhi(year, month, day).gan;
        const yearGanIndex = this.tianGan.indexOf(yearGan);
        
        // 找到当前节气
        let currentJieQi = null;
        for (let i = 0; i < this.jieQi.length; i++) {
            const jq = this.jieQi[i];
            if (jq.month === month && Math.abs(jq.day - day) <= 15) {
                currentJieQi = jq;
                break;
            }
        }
        
        // 确定月支（寅月为正月）
        let zhiIndex;
        if (currentJieQi) {
            const jieQiIndex = this.jieQi.indexOf(currentJieQi);
            zhiIndex = Math.floor(jieQiIndex / 2);
        } else {
            zhiIndex = (month + 1) % 12;
        }
        
        // 月干根据年干推算（五虎遁）
        const ganStart = [2, 14, 26, 38, 50][yearGanIndex % 5] % 10; // 甲己之年丙作首
        const ganIndex = (ganStart + zhiIndex) % 10;
        
        return {
            gan: this.tianGan[ganIndex],
            zhi: this.diZhi[zhiIndex],
            ganZhi: this.tianGan[ganIndex] + this.diZhi[zhiIndex]
        };
    }

    // 计算日柱（简化版，实际应该用万年历）
    calculateDayGanZhi(year, month, day) {
        // 使用已知的基准日计算（1900年1月31日为甲辰日）
        const baseDate = new Date(1900, 0, 31);
        const targetDate = new Date(year, month - 1, day);
        const diffDays = Math.floor((targetDate - baseDate) / (1000 * 60 * 60 * 24));
        
        const ganIndex = (diffDays % 10 + 10) % 10;
        const zhiIndex = (diffDays % 12 + 12) % 12;
        
        return {
            gan: this.tianGan[ganIndex],
            zhi: this.diZhi[zhiIndex],
            ganZhi: this.tianGan[ganIndex] + this.diZhi[zhiIndex]
        };
    }

    // 计算时柱
    calculateHourGanZhi(dayGan, hour) {
        const dayGanIndex = this.tianGan.indexOf(dayGan);
        const zhiIndex = Math.floor((hour + 1) / 2) % 12;
        
        // 时干根据日干推算（五鼠遁）
        const ganStart = [0, 12, 24, 36, 48][dayGanIndex % 5] % 10; // 甲己还加甲
        const ganIndex = (ganStart + zhiIndex) % 10;
        
        return {
            gan: this.tianGan[ganIndex],
            zhi: this.diZhi[zhiIndex],
            ganZhi: this.tianGan[ganIndex] + this.diZhi[zhiIndex]
        };
    }

    // 计算十神
    calculateShiShen(dayGan, targetGan) {
        return this.shiShen[dayGan][targetGan];
    }

    // 计算五行数量
    calculateWuXingCount(bazi) {
        const count = { '金': 0, '木': 0, '水': 0, '火': 0, '土': 0 };
        const allGanZhi = bazi.year.gan + bazi.year.zhi + 
                          bazi.month.gan + bazi.month.zhi + 
                          bazi.day.gan + bazi.day.zhi + 
                          bazi.hour.gan + bazi.hour.zhi;
        
        for (let gz of allGanZhi) {
            const wx = this.wuXing[gz];
            if (wx) count[wx]++;
        }
        
        return count;
    }

    // 判断日主强弱
    calculateDayGanStrength(bazi, wuXingCount) {
        const dayGan = bazi.day.gan;
        const dayWuXing = this.wuXing[dayGan];
        
        // 简单判断（实际应该考虑月令、通根等）
        const sameCount = wuXingCount[dayWuXing];
        const shengCount = this.getShengCount(dayWuXing, wuXingCount);
        
        if (sameCount >= 3 || (sameCount + shengCount) >= 4) {
            return '身强';
        } else if (sameCount <= 1 && shengCount <= 1) {
            return '身弱';
        } else {
            return '中和';
        }
    }

    // 获取生助数量
    getShengCount(wuXing, wuXingCount) {
        const shengRelation = {
            '金': ['土'],
            '木': ['水'],
            '水': ['金'],
            '火': ['木'],
            '土': ['火']
        };
        
        const sheng = shengRelation[wuXing];
        return sheng.reduce((sum, wx) => sum + wuXingCount[wx], 0);
    }

    // 确定喜用神
    calculateXiYongShen(dayGan, strength) {
        const dayWuXing = this.wuXing[dayGan];
        
        if (strength === '身强') {
            // 身强喜克泄耗
            const ke = this.getKe(dayWuXing);
            const xie = this.getXie(dayWuXing);
            const hao = this.getHao(dayWuXing);
            return [...ke, ...xie, ...hao];
        } else {
            // 身弱喜生助
            const sheng = this.getSheng(dayWuXing);
            const zhu = [dayWuXing];
            return [...sheng, ...zhu];
        }
    }

    // 获取克我的五行
    getKe(wuXing) {
        const keRelation = {
            '金': ['火'], '木': ['金'], '水': ['土'], '火': ['水'], '土': ['木']
        };
        return keRelation[wuXing];
    }

    // 获取我生的五行
    getXie(wuXing) {
        const xieRelation = {
            '金': ['水'], '木': ['火'], '水': ['木'], '火': ['土'], '土': ['金']
        };
        return xieRelation[wuXing];
    }

    // 获取我克的五行
    getHao(wuXing) {
        const haoRelation = {
            '金': ['木'], '木': ['土'], '水': ['火'], '火': ['金'], '土': ['水']
        };
        return haoRelation[wuXing];
    }

    // 获取生我的五行
    getSheng(wuXing) {
        const shengRelation = {
            '金': ['土'], '木': ['水'], '水': ['金'], '火': ['木'], '土': ['火']
        };
        return shengRelation[wuXing];
    }

    // 生成完整报告
    generateReport(birthData) {
        const { year, month, day, hour, gender } = birthData;
        
        // 计算四柱
        const bazi = {
            year: this.calculateYearGanZhi(year, month, day),
            month: this.calculateMonthGanZhi(year, month, day),
            day: this.calculateDayGanZhi(year, month, day),
            hour: this.calculateHourGanZhi(this.calculateDayGanZhi(year, month, day).gan, hour)
        };
        
        // 计算十神
        const dayGan = bazi.day.gan;
        const shiShen = {
            year: this.calculateShiShen(dayGan, bazi.year.gan),
            month: this.calculateShiShen(dayGan, bazi.month.gan),
            day: '日主',
            hour: this.calculateShiShen(dayGan, bazi.hour.gan)
        };
        
        // 计算纳音
        const naYin = {
            year: this.naYin[bazi.year.ganZhi] || '未知',
            month: this.naYin[bazi.month.ganZhi] || '未知',
            day: this.naYin[bazi.day.ganZhi] || '未知',
            hour: this.naYin[bazi.hour.ganZhi] || '未知'
        };
        
        // 计算五行
        const wuXingCount = this.calculateWuXingCount(bazi);
        
        // 判断日主强弱
        const dayGanStrength = this.calculateDayGanStrength(bazi, wuXingCount);
        
        // 确定喜用神
        const xiYongShen = this.calculateXiYongShen(dayGan, dayGanStrength);
        
        // 计算生肖
        const shengXiao = this.shengXiao[(year - 4) % 12];
        
        // 计算星座
        const xingZuo = this.getXingZuo(month, day);
        
        // 计算星宿
        const xingXiu = this.getXingXiu(year, month, day);
        
        return {
            birthData,
            bazi,
            shiShen,
            naYin,
            wuXingCount,
            dayGanStrength,
            xiYongShen,
            shengXiao,
            xingZuo,
            xingXiu
        };
    }

    // 获取星座
    getXingZuo(month, day) {
        for (let xz of this.xingZuo) {
            if (month === xz.start[0] && day >= xz.start[1]) return xz.name;
            if (month === xz.end[0] && day <= xz.end[1]) return xz.name;
        }
        return '未知';
    }

    // 获取星宿
    getXingXiu(year, month, day) {
        const date = new Date(year, month - 1, day);
        const startDate = new Date(1900, 0, 1);
        const daysDiff = Math.floor((date - startDate) / (1000 * 60 * 60 * 24));
        const index = daysDiff % 28;
        return this.xingXiu[index] + '宿';
    }
}

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BaziReportGenerator;
}
