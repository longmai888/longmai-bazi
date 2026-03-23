# -*- coding: utf-8 -*-
import os
import codecs

# 扩展的乱码映射表
replacements = {
    # 时辰
    "瀛愭椂": "子时",
    "涓戞椂": "丑时",
    "瀵呮椂": "寅时",
    "鍗舵椂": "卯时",
    "杈版椂": "辰时",
    "宸濇椂": "巳时",
    "鍗堟椂": "午时",
    "鏈熸椂": "未时",
    "鐢虫椂": "申时",
    "閰掓椂": "酉时",
    "鎴熸椂": "戌时",
    "浜辨椂": "亥时",
    
    # 其他乱码
    "璇烽€夋嫨": "请选择",
    "?3:00": "(23:00",
    "?1:00": "(01:00",
    "?3:00": "(03:00",
    "?5:00": "(05:00",
    "?7:00": "(07:00",
    "?9:00": "(09:00",
    "?1:00": "(11:00",
    "?3:00": "(13:00",
    "?5:00": "(15:00",
    "?7:00": "(17:00",
    "?9:00": "(19:00",
    "?1:00": "(21:00",
    "?/option>": "</option>",
    "?/label>": "</label>",
    "?/button>": "</button>",
    "?/div>": "</div>",
    "?/h3>": "</h3>",
    "?/h4>": "</h4>",
    "?/strong>": "</strong>",
    "?/span>": "</span>",
    "?/p>": "</p>",
    "?/li>": "</li>",
    "?/a>": "</a>",
}

# 遍历所有HTML文件
website_dir = r"D:\龙脉文化\website"
for root, dirs, files in os.walk(website_dir):
    for filename in files:
        if filename.endswith('.html'):
            filepath = os.path.join(root, filename)
            print(f"Processing: {filename}")
            
            try:
                # 读取文件
                with codecs.open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                # 执行替换
                for old, new in replacements.items():
                    content = content.replace(old, new)
                
                # 保存文件
                with codecs.open(filepath, 'w', encoding='utf-8') as f:
                    f.write(content)
                
                print(f"✓ Fixed: {filename}")
            except Exception as e:
                print(f"✗ Error: {e}")

print("\n处理完成！")
