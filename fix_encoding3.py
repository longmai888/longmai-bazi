# -*- coding: utf-8 -*-
import os
import codecs

# 完整的乱码映射表
replacements = {
    # 请选择
    "璇烽€夋嫨": "请选择",
    
    # 时辰（完整）
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
    
    # 标签
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
    "?/title>": "</title>",
    "?/head>": "</head>",
    "?/body>": "</body>",
    "?/html>": "</html>",
    "?/script>": "</script>",
    "?/style>": "</style>",
    "?/meta>": "</meta>",
    "?/link>": "</link>",
    "?/input>": "</input>",
    "?/form>": "</form>",
    "?/table>": "</table>",
    "?/tr>": "</tr>",
    "?/td>": "</td>",
    "?/th>": "</th>",
    "?/ul>": "</ul>",
    "?/ol>": "</ol>",
    "?/nav>": "</nav>",
    "?/header>": "</header>",
    "?/footer>": "</footer>",
    "?/section>": "</section>",
    "?/article>": "</article>",
    "?/aside>": "</aside>",
    "?/main>": "</main>",
    "?/figure>": "</figure>",
    "?/figcaption>": "</figcaption>",
    "?/details>": "</details>",
    "?/summary>": "</summary>",
    "?/dialog>": "</dialog>",
    "?/menu>": "</menu>",
    "?/menuitem>": "</menuitem>",
}

# 遍历所有HTML文件
website_dir = r"D:\龙脉文化\website"
for root, dirs, files in os.walk(website_dir):
    for filename in files:
        if filename.endswith('.html'):
            filepath = os.path.join(root, filename)
            
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
                
                print(f"✓ {filename}")
            except Exception as e:
                print(f"✗ {filename}: {e}")

print("\n处理完成！")
