#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
修复HTML文件中的乱码问题 - 全面修复版本
"""

import os
import re

# 需要修复的文件列表
files_to_fix = [
    'ai_qa.html',
    'career_analysis.html',
    'celebrity_cases.html',
    'disclaimer.html',
    'dongbei_xian.html',
    'healing_center.html',
    'health_analysis.html',
    'luopan.html',
    'marriage_analysis.html',
    'mountain_map.html',
    'payment_shop.html',
    'privacy_policy.html'
]

# 乱码到正确字符的映射（基于观察到的乱码模式）
# 这些是在特定上下文中应该出现的字符
char_fixes = {
    # 日期相关
    '2026??7?': '2026年3月7日',
    '2026??7': '2026年3月7日',
    
    # 标题相关
    '名人八字案例?': '名人八字案例库',
    '付费解锁与商?': '付费解锁与商城',
    
    # 内容相关 - 基于上下文推断
    '我们收集的信?': '我们收集的信息',
    '基本信：': '基本信息：',
    '联系信：': '联系信息：',
    '支付信：': '支付信息：',
    '设备信：': '设备信息：',
    '银行卡信?': '银行卡信息',
    '浏览记?': '浏览记录',
    '用于八字排盘?': '用于八字排盘）',
    '不包含银行卡信?': '不包含银行卡信息）',
    '?八字基础排盘': '（八字基础排盘',
}

def fix_file(filepath):
    """修复单个文件"""
    try:
        # 用UTF-8读取
        with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
        
        original_content = content
        changes = []
        
        # 修复1: 替换特定的乱码字符串
        for old, new in char_fixes.items():
            if old in content:
                content = content.replace(old, new)
                changes.append(f"'{old}' -> '{new}'")
        
        # 修复2: 替换 ?/ 为 </
        if '?/' in content:
            content = content.replace('?/', '</')
            changes.append("'?/' -> '</'")
        
        # 修复3: 替换 `n 为换行符
        if '`n' in content:
            content = content.replace('`n', '\n')
            changes.append("'`n' -> '\\n'")
        
        # 修复4: 智能修复单个问号（在中文上下文中）
        # 查找 "信?" 模式并替换为 "信息"
        content = re.sub(r'信\?', '信息', content)
        content = re.sub(r'记\?', '记录', content)
        content = re.sub(r'盘\?', '盘）', content)
        content = re.sub(r'例\?', '例库', content)
        content = re.sub(r'商\?', '商城', content)
        
        # 如果内容有变化，保存文件
        if content != original_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"✅ 已修复: {os.path.basename(filepath)}")
            for change in changes:
                print(f"   - {change}")
            return True
        else:
            print(f"ℹ️ 无需修复: {os.path.basename(filepath)}")
            return False
            
    except Exception as e:
        print(f"❌ 错误 {os.path.basename(filepath)}: {str(e)}")
        return False

def main():
    base_dir = r'D:\龙脉文化\website'
    fixed_count = 0
    
    print("=" * 60)
    print("开始修复HTML文件")
    print("=" * 60)
    
    for filename in files_to_fix:
        filepath = os.path.join(base_dir, filename)
        if os.path.exists(filepath):
            print(f"\n处理: {filename}")
            if fix_file(filepath):
                fixed_count += 1
        else:
            print(f"⚠️ 文件不存在: {filename}")
    
    print("\n" + "=" * 60)
    print(f"修复完成！共修复 {fixed_count} 个文件")
    print("=" * 60)

if __name__ == '__main__':
    main()
