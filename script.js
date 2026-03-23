/**
 * 龙脉文化 - 通用JavaScript库
 * 包含：八字计算、六爻、奇门遁甲、工具函数等
 */

// ===== 基础工具函数 =====

/**
 * 显示提示信息
 */
function showToast(message, type = 'info') {
    // 移除旧的toast
    var oldToast = document.getElementById('toast');
    if (oldToast) {
        oldToast.remove();
    }
    
    // 创建新toast
    var toast = document.createElement('div');
    toast.id = 'toast';
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        padding: 15px 30px;
        border-radius: 25px;
        color: #fff;
        font-size: 1rem;
        z-index: 10000;
        animation: fadeIn 0.3s ease-out;
    `;
    
    // 根据类型设置颜色
    if (type === 'error') {
        toast.style.background = 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)';
    } else if (type === 'success') {
        toast.style.background = 'linear-gradient(135deg, #27ae60 0%, #229954 100%)';
    } else {
        toast.style.background = 'linear-gradient(135deg, #f39c12 0%, #e74c3c 100%)';
    }
    
    toast.textContent = message;
    document.body.appendChild(toast);
    
    // 3秒后自动移除
    setTimeout(function() {
        toast.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(function() {
            toast.remove();
        }, 300);
    }, 3000);
}

/**
 * 验证输入
 */
function validateInput(value, type) {
    if (!value || value.trim() === '') {
        return { valid: false, message: '请输入' + type };
    }
    return { valid: true };
}

/**
 * 验证日期
 */
function validateDate(year, month, day) {
    year = parseInt(year);
    month = parseInt(month);
    day = parseInt(day);
    
    if (isNaN(year) || isNaN(month) || isNaN(day)) {
        return { valid: false, message: '请输入有效的日期' };
    }
    
    if (year < 1900 || year > 2100) {
        return { valid: false, message: '年份必须在1900-2100之间' };
    }
    
    if (month < 1 || month > 12) {
        return { valid: false, message: '月份必须在1-12之间' };
    }
    
    var daysInMonth = new Date(year, month, 0).getDate();
    if (day < 1 || day > daysInMonth) {
        return { valid: false, message: '日期无效' };
    }
    
    return { valid: true, year: year, month: month, day: day };
}

/**
 * 验证时间
 */
function validateTime(hour) {
    hour = parseInt(hour);
    
    if (isNaN(hour)) {
        return { valid: false, message: '请输入有效的时间' };
    }
    
    if (hour < 0 || hour > 23) {
        return { valid: false, message: '时间必须在0-23之间' };
    }
    
    return { valid: true, hour: hour };
}

// ===== 八字计算函数 =====

/**
 * 计算八字
 */
function calculateBazi(year, month, day, hour) {
    try {
        // 验证输入
        var dateValidation = validateDate(year, month, day);
        if (!dateValidation.valid) {
            showToast(dateValidation.message, 'error');
            return null;
        }
        
        var timeValidation = validateTime(hour);
        if (!timeValidation.valid) {
            showToast(timeValidation.message, 'error');
            return null;
        }
        
        // 使用Lunar库计算
        if (typeof Lunar === 'undefined') {
            showToast('农历库加载失败，请刷新页面重试', 'error');
            return null;
        }
        
        var bazi = Lunar.getBazi(
            dateValidation.year,
            dateValidation.month,
            dateValidation.day,
            timeValidation.hour
        );
        
        return {
            year: bazi.year,
            month: bazi.month,
            day: bazi.day,
            hour: bazi.hour,
            animal: Lunar.getAnimal(dateValidation.year)
        };
    } catch (error) {
        console.error('八字计算错误:', error);
        showToast('计算出错，请检查输入是否正确', 'error');
        return null;
    }
}

/**
 * 计算五行
 */
function calculateWuxing(ganZhi) {
    var wuxingMap = {
        '甲': '木', '乙': '木',
        '丙': '火', '丁': '火',
        '戊': '土', '己': '土',
        '庚': '金', '辛': '金',
        '壬': '水', '癸': '水',
        '子': '水', '丑': '土', '寅': '木', '卯': '木',
        '辰': '土', '巳': '火', '午': '火', '未': '土',
        '申': '金', '酉': '金', '戌': '土', '亥': '水'
    };
    
    var result = [];
    for (var i = 0; i < ganZhi.length; i++) {
        var char = ganZhi.charAt(i);
        if (wuxingMap[char]) {
            result.push(wuxingMap[char]);
        }
    }
    return result;
}

/**
 * 计算十神
 */
function calculateShishen(dayGan, targetGan) {
    var ganIndex = {
        '甲': 0, '乙': 1, '丙': 2, '丁': 3, '戊': 4,
        '己': 5, '庚': 6, '辛': 7, '壬': 8, '癸': 9
    };
    
    var shishenMap = [
        ['比肩', '劫财', '食神', '伤官', '偏财', '正财', '七杀', '正官', '偏印', '正印'],
        ['劫财', '比肩', '伤官', '食神', '正财', '偏财', '正官', '七杀', '正印', '偏印'],
        ['食神', '伤官', '比肩', '劫财', '偏印', '正印', '偏财', '正财', '七杀', '正官'],
        ['伤官', '食神', '劫财', '比肩', '正印', '偏印', '正财', '偏财', '正官', '七杀'],
        ['偏财', '正财', '食神', '伤官', '比肩', '劫财', '偏印', '正印', '七杀', '正官'],
        ['正财', '偏财', '伤官', '食神', '劫财', '比肩', '正印', '偏印', '正官', '七杀'],
        ['七杀', '正官', '偏财', '正财', '食神', '伤官', '比肩', '劫财', '偏印', '正印'],
        ['正官', '七杀', '正财', '偏财', '伤官', '食神', '劫财', '比肩', '正印', '偏印'],
        ['偏印', '正印', '七杀', '正官', '偏财', '正财', '食神', '伤官', '比肩', '劫财'],
        ['正印', '偏印', '正官', '七杀', '正财', '偏财', '伤官', '食神', '劫财', '比肩']
    ];
    
    var dayIndex = ganIndex[dayGan];
    var targetIndex = ganIndex[targetGan];
    
    if (dayIndex === undefined || targetIndex === undefined) {
        return '未知';
    }
    
    return shishenMap[dayIndex][targetIndex];
}

// ===== 大运计算 =====

/**
 * 计算起运时间
 */
function calculateQiYun(bazi, gender) {
    // 简化的起运计算
    var dayGan = bazi.day.charAt(0);
    var yearGan = bazi.year.charAt(0);
    
    // 阳年阳月或阴年阴月顺排，否则逆排
    var yangGan = ['甲', '丙', '戊', '庚', '壬'];
    var isYangYear = yangGan.indexOf(yearGan) !== -1;
    var isMale = gender === '男';
    
    // 顺逆判断
    var isForward = (isYangYear && isMale) || (!isYangYear && !isMale);
    
    return {
        direction: isForward ? '顺行' : '逆行',
        startAge: 3, // 简化计算，实际应该根据节气计算
        dayun: generateDaYun(bazi, isForward)
    };
}

/**
 * 生成大运
 */
function generateDaYun(bazi, isForward) {
    var gan = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
    var zhi = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
    
    var monthGan = bazi.month.charAt(0);
    var monthZhi = bazi.month.charAt(1);
    
    var ganIndex = gan.indexOf(monthGan);
    var zhiIndex = zhi.indexOf(monthZhi);
    
    var dayun = [];
    var startAge = 3;
    
    for (var i = 0; i < 8; i++) {
        if (isForward) {
            ganIndex = (ganIndex + 1) % 10;
            zhiIndex = (zhiIndex + 1) % 12;
        } else {
            ganIndex = (ganIndex - 1 + 10) % 10;
            zhiIndex = (zhiIndex - 1 + 12) % 12;
        }
        
        dayun.push({
            age: startAge + i * 10,
            ganZhi: gan[ganIndex] + zhi[zhiIndex]
        });
    }
    
    return dayun;
}

// ===== 六爻计算 =====

/**
 * 生成六爻卦象
 */
function generateLiuyao() {
    var yao = [];
    for (var i = 0; i < 6; i++) {
        // 生成随机数（模拟铜钱占卜）
        var coin1 = Math.floor(Math.random() * 2) + 2; // 2或3
        var coin2 = Math.floor(Math.random() * 2) + 2;
        var coin3 = Math.floor(Math.random() * 2) + 2;
        var sum = coin1 + coin2 + coin3;
        
        // 6: 老阴(变), 7: 少阳, 8: 少阴, 9: 老阳(变)
        yao.push(sum);
    }
    return yao;
}

/**
 * 解释六爻
 */
function interpretLiuyao(yao) {
    var names = ['老阴(变)', '少阳', '少阴', '老阳(变)'];
    var symbols = ['⚋', '⚊', '⚋', '⚊'];
    
    var result = [];
    for (var i = 0; i < yao.length; i++) {
        var index = yao[i] - 6;
        result.push({
            position: i + 1,
            value: yao[i],
            name: names[index],
            symbol: symbols[index],
            isChange: (yao[i] === 6 || yao[i] === 9)
        });
    }
    return result;
}

// ===== 奇门遁甲 =====

/**
 * 获取当前奇门局
 */
function getQimenJu(year, month, day, hour) {
    // 简化的奇门局计算
    var juNumber = ((year + month + day) % 9) + 1;
    var isYang = (month >= 2 && month <= 7);
    
    return {
        number: juNumber,
        type: isYang ? '阳遁' : '阴遁',
        palace: generateQimenPalace(juNumber, isYang)
    };
}

/**
 * 生成奇门九宫
 */
function generateQimenPalace(juNumber, isYang) {
    var palaces = ['坎一宫', '坤二宫', '震三宫', '巽四宫', '中五宫', '乾六宫', '兑七宫', '艮八宫', '离九宫'];
    var stars = ['天蓬', '天任', '天冲', '天辅', '天英', '天芮', '天柱', '天心', '天禽'];
    var gates = ['休门', '生门', '伤门', '杜门', '景门', '死门', '惊门', '开门', '中门'];
    
    var result = [];
    for (var i = 0; i < 9; i++) {
        result.push({
            palace: palaces[i],
            star: stars[i],
            gate: gates[i],
            position: i + 1
        });
    }
    return result;
}

// ===== 页面初始化 =====

document.addEventListener('DOMContentLoaded', function() {
    // 添加CSS动画
    var style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; transform: translateX(-50%) translateY(-20px); }
            to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        @keyframes fadeOut {
            from { opacity: 1; transform: translateX(-50%) translateY(0); }
            to { opacity: 0; transform: translateX(-50%) translateY(-20px); }
        }
    `;
    document.head.appendChild(style);
    
    console.log('龙脉文化 - 通用脚本加载完成');
});

// 导出全局函数
window.showToast = showToast;
window.validateInput = validateInput;
window.validateDate = validateDate;
window.validateTime = validateTime;
window.calculateBazi = calculateBazi;
window.calculateWuxing = calculateWuxing;
window.calculateShishen = calculateShishen;
window.calculateQiYun = calculateQiYun;
window.generateLiuyao = generateLiuyao;
window.interpretLiuyao = interpretLiuyao;
window.getQimenJu = getQimenJu;
