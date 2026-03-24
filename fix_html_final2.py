#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
修复HTML文件中的剩余乱码问题
"""

import os

# 需要修复的文件列表
files_to_fix = [
    'privacy_policy.html',
    'payment_shop.html',
    'celebrity_cases.html',
    'disclaimer.html'
]

# 乱码到正确字符的映射
char_fixes = {
    # privacy_policy.html
    '我们收集的信\u003c': '我们收集的信息\u003c',
    '我们可能会收集以下信：': '我们可能会收集以下信息：',
    '浏览记\u003c': '浏览记录\u003c',
    '不包含银行卡信\u003c': '不包含银行卡信息）\u003c',
    '2. 信使用目的': '2. 信息使用目的',
    '我们使用您的信用于以下目的?': '我们使用您的信息用于以下目的：',
    
    # payment_shop.html
    '付费解锁与商\u003c': '付费解锁与商城\u003c',
    
    # celebrity_cases.html
    '名人八字案例\u003c': '名人八字案例库\u003c',
    
    # disclaimer.html
    '请仔细阅读以下条\u003c': '请仔细阅读以下条款\u003c',
    '条?': '条款',
    '请理性看待?': '请理性看待。',
    '不代表任何科学结论?': '不代表任何科学结论。',
}

def fix_file(filepath):
    """修复单个文件"""
    try:
        # 用UTF-8读取
        with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
        
        original_content = content
        changes = []
        
        # 修复特定的乱码字符串
        for old, new in char_fixes.items():
            if old in content:
                content = content.replace(old, new)
                changes.append(f"'{old}' -> '{new}'")
        
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
