#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
修复HTML文件中的乱码问题
"""

import os

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
        # 用二进制读取
        with open(filepath, 'rb') as f:
            content = f.read()
        
        original_content = content
        
        # 修复1: 替换 ?/ 为 </
        content = content.replace(b'?/', b'</')
        
        # 修复2: 替换 `n 为换行符
        content = content.replace(b'`n', b'\n')
        
        # 修复3: 替换 \u003e`n 为 >\n
        content = content.replace(b'\\u003e`n', b'>\n')
        
        # 如果内容有变化，保存文件
        if content != original_content:
            with open(filepath, 'wb') as f:
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
