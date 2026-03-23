/**
 * 农历转换库 - Lunar.js
 * 支持公历与农历互转、节气计算、干支纪年等
 * 适用于八字排盘、黄历查询等功能
 */

(function(global) {
    'use strict';

    // 农历数据（1900-2100年）
    var lunarInfo = [
        0x04bd8,0x04ae0,0x0a570,0x054d5,0x0d260,0x0d950,0x16554,0x056a0,0x09ad0,0x055d2,
        0x04ae0,0x0a5b6,0x0a4d0,0x0d250,0x1d255,0x0b540,0x0d6a0,0x0ada2,0x095b0,0x14977,
        0x04970,0x0a4b0,0x0b4b5,0x06a50,0x06d40,0x1ab54,0x02b60,0x09570,0x052f2,0x04970,
        0x06566,0x0d4a0,0x0ea50,0x06e95,0x05ad0,0x02b60,0x186e3,0x092e0,0x1c8d7,0x0c950,
        0x0d4a0,0x1d8a6,0x0b550,0x056a0,0x1a5b4,0x025d0,0x092d0,0x0d2b2,0x0a950,0x0b557,
        0x06ca0,0x0b550,0x15355,0x04da0,0x0a5d0,0x14573,0x052d0,0x0a9a8,0x0e950,0x06aa0,
        0x0aea6,0x0ab50,0x04b60,0x0aae4,0x0a570,0x05260,0x0f263,0x0d950,0x05b57,0x056a0,
        0x096d0,0x04dd5,0x04ad0,0x0a4d0,0x0d4d4,0x0d250,0x0d558,0x0b540,0x0b5a0,0x195a6,
        0x095b0,0x049b0,0x0a974,0x0a4b0,0x0b27a,0x06a50,0x06d40,0x0af46,0x0ab60,0x09570,
        0x04af5,0x04970,0x064b0,0x074a3,0x0ea50,0x06b58,0x055c0,0x0ab60,0x096d5,0x092e0,
        0x0c960,0x0d954,0x0d4a0,0x0da50,0x07552,0x056a0,0x0abb7,0x025d0,0x092d0,0x0cab5,
        0x0a950,0x0b4a0,0x0baa4,0x0ad50,0x055d9,0x04ba0,0x0a5b0,0x15176,0x052b0,0x0a930,
        0x07954,0x06aa0,0x0ad50,0x05b52,0x04b60,0x0a6e6,0x0a4e0,0x0d260,0x0ea65,0x0d530,
        0x05aa0,0x076a3,0x096d0,0x04bd7,0x04ad0,0x0a4d0,0x1d0b6,0x0d250,0x0d520,0x0dd45,
        0x0b5a0,0x056d0,0x055b2,0x049b0,0x0a577,0x0a4b0,0x0aa50,0x1b255,0x06d20,0x0ada0
    ];

    // 天干
    var gan = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
    // 地支
    var zhi = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
    // 生肖
    var animals = ['鼠','牛','虎','兔','龙','蛇','马','羊','猴','鸡','狗','猪'];
    // 农历月份
    var lunarMonths = ['正','二','三','四','五','六','七','八','九','十','冬','腊'];
    // 农历日期
    var lunarDays = ['初一','初二','初三','初四','初五','初六','初七','初八','初九','初十',
                     '十一','十二','十三','十四','十五','十六','十七','十八','十九','二十',
                     '廿一','廿二','廿三','廿四','廿五','廿六','廿七','廿八','廿九','三十'];
    // 节气
    var solarTerms = ['小寒','大寒','立春','雨水','惊蛰','春分','清明','谷雨',
                      '立夏','小满','芒种','夏至','小暑','大暑','立秋','处暑',
                      '白露','秋分','寒露','霜降','立冬','小雪','大雪','冬至'];

    /**
     * 判断是否为闰年
     */
    function isLeapYear(year) {
        return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
    }

    /**
     * 获取农历年份的总天数
     */
    function lYearDays(year) {
        var i, sum = 348;
        for (i = 0x8000; i > 0x8; i >>= 1) {
            sum += (lunarInfo[year - 1900] & i) ? 1 : 0;
        }
        return sum + leapDays(year);
    }

    /**
     * 获取农历年份的闰月天数
     */
    function leapDays(year) {
        if (leapMonth(year)) {
            return (lunarInfo[year - 1900] & 0x10000) ? 30 : 29;
        }
        return 0;
    }

    /**
     * 获取农历年份的闰月月份
     */
    function leapMonth(year) {
        return lunarInfo[year - 1900] & 0xf;
    }

    /**
     * 获取农历年份某月的总天数
     */
    function monthDays(year, month) {
        return (lunarInfo[year - 1900] & (0x10000 >> month)) ? 30 : 29;
    }

    /**
     * 公历转农历
     */
    function solarToLunar(date) {
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        
        var baseDate = new Date(1900, 0, 31);
        var offset = Math.floor((date - baseDate) / 86400000);
        
        var lunarYear = 1900;
        var daysOfYear = 0;
        
        for (var i = 1900; i < 2100 && offset > 0; i++) {
            daysOfYear = lYearDays(i);
            offset -= daysOfYear;
            lunarYear++;
        }
        
        if (offset < 0) {
            offset += daysOfYear;
            lunarYear--;
        }
        
        var lunarMonth = 1;
        var lunarDay = 1;
        var isLeap = false;
        var leap = leapMonth(lunarYear);
        var daysOfMonth = 0;
        
        for (var i = 1; i < 13 && offset > 0; i++) {
            if (leap > 0 && i === (leap + 1) && !isLeap) {
                i--;
                isLeap = true;
                daysOfMonth = leapDays(lunarYear);
            } else {
                daysOfMonth = monthDays(lunarYear, i);
            }
            
            if (isLeap && i === (leap + 1)) {
                isLeap = false;
            }
            
            offset -= daysOfMonth;
            lunarMonth++;
        }
        
        if (offset === 0 && leap > 0 && i === leap + 1) {
            if (isLeap) {
                isLeap = false;
            } else {
                isLeap = true;
                i--;
            }
        }
        
        if (offset < 0) {
            offset += daysOfMonth;
            lunarMonth--;
        }
        
        lunarDay = offset + 1;
        
        return {
            year: lunarYear,
            month: lunarMonth,
            day: lunarDay,
            isLeap: isLeap,
            yearGanZhi: getYearGanZhi(lunarYear),
            monthGanZhi: getMonthGanZhi(lunarYear, lunarMonth),
            dayGanZhi: getDayGanZhi(date),
            animal: animals[(lunarYear - 4) % 12],
            monthName: (isLeap ? '闰' : '') + lunarMonths[lunarMonth - 1] + '月',
            dayName: lunarDays[lunarDay - 1]
        };
    }

    /**
     * 获取年干支
     */
    function getYearGanZhi(year) {
        var ganIndex = (year - 4) % 10;
        var zhiIndex = (year - 4) % 12;
        return gan[ganIndex] + zhi[zhiIndex];
    }

    /**
     * 获取月干支
     */
    function getMonthGanZhi(year, month) {
        var yearGanIndex = (year - 4) % 10;
        var monthGanIndex = (yearGanIndex * 2 + month) % 10;
        var monthZhiIndex = (month + 1) % 12;
        return gan[monthGanIndex] + zhi[monthZhiIndex];
    }

    /**
     * 获取日干支
     */
    function getDayGanZhi(date) {
        var baseDate = new Date(1900, 0, 31);
        var offset = Math.floor((date - baseDate) / 86400000);
        var ganIndex = (offset + 40) % 10;
        var zhiIndex = (offset + 16) % 12;
        return gan[ganIndex] + zhi[zhiIndex];
    }

    /**
     * 获取时辰干支
     */
    function getHourGanZhi(dayGanZhi, hour) {
        var dayGan = dayGanZhi.charAt(0);
        var dayGanIndex = gan.indexOf(dayGan);
        var hourZhiIndex = Math.floor((hour + 1) / 2) % 12;
        var hourGanIndex = (dayGanIndex * 2 + hourZhiIndex) % 10;
        return gan[hourGanIndex] + zhi[hourZhiIndex];
    }

    /**
     * 获取节气
     */
    function getSolarTerm(year, month, day) {
        var termInfo = [
            6, 20, 4, 19, 6, 21, 5, 20, 6, 21, 6, 22, 7, 23, 8, 23, 8, 23, 8, 24, 8, 23, 7, 22
        ];
        var termIndex = (month - 1) * 2;
        if (day === termInfo[termIndex]) {
            return solarTerms[termIndex];
        } else if (day === termInfo[termIndex + 1]) {
            return solarTerms[termIndex + 1];
        }
        return null;
    }

    /**
     * 获取八字
     */
    function getBazi(year, month, day, hour) {
        var date = new Date(year, month - 1, day);
        var lunar = solarToLunar(date);
        var dayGanZhi = lunar.dayGanZhi;
        var hourGanZhi = getHourGanZhi(dayGanZhi, hour);
        
        return {
            year: lunar.yearGanZhi,
            month: lunar.monthGanZhi,
            day: dayGanZhi,
            hour: hourGanZhi
        };
    }

    /**
     * 获取生肖
     */
    function getAnimal(year) {
        return animals[(year - 4) % 12];
    }

    // 导出API
    var Lunar = {
        solarToLunar: solarToLunar,
        getYearGanZhi: getYearGanZhi,
        getMonthGanZhi: getMonthGanZhi,
        getDayGanZhi: getDayGanZhi,
        getHourGanZhi: getHourGanZhi,
        getSolarTerm: getSolarTerm,
        getBazi: getBazi,
        getAnimal: getAnimal,
        gan: gan,
        zhi: zhi,
        animals: animals
    };

    // 兼容CommonJS和浏览器
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = Lunar;
    } else {
        global.Lunar = Lunar;
    }

})(typeof window !== 'undefined' ? window : this);
