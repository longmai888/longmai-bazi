#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
修复剩余的8个HTML文件中的乱码问题
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

def fix_file(filepath):
    """修复单个文件"""
    try:
        # 尝试用UTF-8读取
        with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
        
        original_content = content
        
        # 修复1: 替换乱码字符
        # 这些乱码字符对应的中文字符
        replacements = {
            '': '件',
            'Ʒƹ': '件',
            '': '条',
            '': '款',
            '': '月',
            '': '日',
            '': '商',
            '': '城',
            '': '信',
            '': '息',
            '': '用',
            '': '于',
            '': '录',
            '': '排',
            '': '盘',
            '': '咨',
            '': '询',
            '': '浏',
            '': '览',
            '': '记',
            '': '银',
            '': '行',
            '': '卡',
            '': '基',
            '': '本',
            '': '姓',
            '': '名',
            '': '性',
            '': '别',
            '': '出',
            '': '生',
            '': '期',
            '': '联',
            '': '系',
            '': '手',
            '': '机',
            '': '号',
            '': '码',
            '': '电',
            '': '子',
            '': '邮',
            '': '箱',
            '': '注',
            '': '册',
            '': '和',
            '': '设',
            '': '备',
            '': '型',
            '': 'IP',
            '': '地',
            '': '址',
            '': '浏',
            '': '览',
            '': '器',
            '': '类',
            '': '型',
            '': '目',
            '': '的',
            '': '为',
            '': '了',
            '': '向',
            '': '您',
            '': '提',
            '': '供',
            '': '更',
            '': '好',
            '': '的',
            '': '服',
            '': '务',
            '': '我',
            '': '们',
            '': '可',
            '': '能',
            '': '会',
            '': '收',
            '': '集',
            '': '以',
            '': '下',
            '': '信',
            '': '息',
        }
        
        # 执行替换
        for old, new in replacements.items():
            if old in content:
                content = content.replace(old, new)
                print(f"  替换: {repr(old)} -> {new}")
        
        # 修复2: 修复换行符问题
        content = content.replace('`n', '\n')
        content = content.replace('\u003e`n', '\u003e\n')
        
        # 修复3: 修复HTML标签闭合符
        content = content.replace('?/', '</')
        
        # 如果内容有变化，保存文件
        if content != original_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"✅ 已修复: {os.path.basename(filepath)}")
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
    print("开始修复剩余的HTML文件")
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
