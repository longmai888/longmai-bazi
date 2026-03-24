#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
恢复被错误修复的HTML文件
删除每个字符前的"息"字
"""

import os

# 需要恢复的文件列表
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

def restore_file(filepath):
    """恢复单个文件"""
    try:
        # 用二进制读取
        with open(filepath, 'rb') as f:
            content = f.read()
        
        # "息"字的UTF-8编码是 \xe6\x81\xaf
        xi_bytes = b'\xe6\x81\xaf'
        
        # 删除所有的"息"字节
        restored_content = content.replace(xi_bytes, b'')
        
        # 保存恢复后的文件
        with open(filepath, 'wb') as f:
            f.write(restored_content)
        
        print(f"✅ 已恢复: {os.path.basename(filepath)}")
        return True
            
    except Exception as e:
        print(f"❌ 错误 {os.path.basename(filepath)}: {str(e)}")
        return False

def main():
    base_dir = r'D:\龙脉文化\website'
    restored_count = 0
    
    print("=" * 60)
    print("开始恢复HTML文件")
    print("=" * 60)
    
    for filename in files_to_fix:
        filepath = os.path.join(base_dir, filename)
        if os.path.exists(filepath):
            print(f"\n处理: {filename}")
            if restore_file(filepath):
                restored_count += 1
        else:
            print(f"⚠️ 文件不存在: {filename}")
    
    print("\n" + "=" * 60)
    print(f"恢复完成！共恢复 {restored_count} 个文件")
    print("=" * 60)

if __name__ == '__main__':
    main()
