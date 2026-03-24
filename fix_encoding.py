# 批量修复 HTML 文件编码为 UTF-8 无 BOM
import os

website_dir = r"D:\龙脉文化\website"
html_files = [f for f in os.listdir(website_dir) if f.endswith('.html')]

print(f"找到 {len(html_files)} 个 HTML 文件")

for filename in html_files:
    filepath = os.path.join(website_dir, filename)
    try:
        # 读取（假设当前可能是乱码，按 Latin-1 读原始字节）
        with open(filepath, 'rb') as f:
            raw = f.read()

        # 移除 BOM（如果存在）
        if raw.startswith(b'\xef\xbb\xbf'):
            raw = raw[3:]
            print(f"⚠️  {filename}: 有 BOM，已移除")

        # 尝试解码为 UTF-8（如果失败，尝试 Latin-1）
        try:
            content = raw.decode('utf-8')
        except UnicodeDecodeError:
            content = raw.decode('latin-1')
            print(f"⚠️  {filename}: 非 UTF-8，已按 Latin-1 转换")

        # 重新编码为 UTF-8 无 BOM
        new_raw = content.encode('utf-8')

        # 写回
        with open(filepath, 'wb') as f:
            f.write(new_raw)

        print(f"✅  {filename}: 已修复为 UTF-8 无 BOM")

    except Exception as e:
        print(f"❌  {filename}: 错误 {e}")

print("\n完成！所有 HTML 文件现在都是 UTF-8 无 BOM")
