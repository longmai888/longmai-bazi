# -*- coding: utf-8 -*-
"""
龙脉文化网站修复脚本
修复内容：
1. 将指定的HTML文件转换为UTF-8编码
2. 修复footer乱码（替换为正确的HTML）
3. 修复ziwei.html的时间选项格式
4. 补充fengshui.html缺失的商品数据
"""

import os
import codecs

# 需要修复的文件列表
FILES_TO_FIX = [
    r'D:\龙脉文化\website\qimen.html',
    r'D:\龙脉文化\website\meihua.html',
    r'D:\龙脉文化\website\fengshui.html',
    r'D:\龙脉文化\website\ziwei.html'
]

# 正确的footer HTML模板
CORRECT_FOOTER = '''
<footer class="footer">
    <div class="footer-content">
        <div class="footer-section">
            <h4>关于我们</h4>
            <ul>
                <li><a href="about.html">公司简介</a></li>
                <li><a href="contact.html">联系我们</a></li>
                <li><a href="join.html">加入我们</a></li>
            </ul>
        </div>
        <div class="footer-section">
            <h4>服务条款</h4>
            <ul>
                <li><a href="user_agreement.html">用户协议</a></li>
                <li><a href="privacy_policy.html">隐私政策</a></li>
                <li><a href="disclaimer.html">免责声明</a></li>
            </ul>
        </div>
        <div class="footer-section">
            <h4>联系方式</h4>
            <ul>
                <li>📧 longmai@foxmail.com</li>
                <li>📞 400-XXX-XXXX</li>
                <li>📍 江苏省新沂市</li>
            </ul>
        </div>
    </div>
    <div class="footer-bottom">
        <p>© 2026 龙脉文化 | 传承千年智慧 · 科技赋能玄学 · 守护灵动人生</p>
        <p>内容仅供娱乐参考，切勿迷信</p>
        <p>© 2026 龙脉文化 | ICP备XXXXXXXX号</p>
    </div>
</footer>
'''

# 正确的紫微斗数时间选项
CORRECT_ZIWEI_HOURS = '''
                <option value="">请选择</option>
                <option value="23-1">子时(23:00-01:00)</option>
                <option value="1-3">丑时(01:00-03:00)</option>
                <option value="3-5">寅时(03:00-05:00)</option>
                <option value="5-7">卯时(05:00-07:00)</option>
                <option value="7-9">辰时(07:00-09:00)</option>
                <option value="9-11">巳时(09:00-11:00)</option>
                <option value="11-13">午时(11:00-13:00)</option>
                <option value="13-15">未时(13:00-15:00)</option>
                <option value="15-17">申时(15:00-17:00)</option>
                <option value="17-19">酉时(17:00-19:00)</option>
                <option value="19-21">戌时(19:00-21:00)</option>
                <option value="21-23">亥时(21:00-23:00)</option>
'''

# 风水商品数据补全模板
FENGSHUI_PRODUCTS_FIX = {
    '待上?': '已上架',  # 商品状态
    '¥688/': '¥688',    # 价格补全
}

def detect_encoding(file_path):
    """检测文件编码"""
    with open(file_path, 'rb') as f:
        raw = f.read(10000)
        # 尝试常见编码
        for encoding in ['gbk', 'gb2312', 'utf-8', 'latin-1']:
            try:
                raw.decode(encoding)
                return encoding
            except:
                continue
    return 'utf-8'

def convert_to_utf8(file_path):
    """转换文件为UTF-8"""
    print(f"\n处理文件: {os.path.basename(file_path)}")

    # 检测编码
    encoding = detect_encoding(file_path)
    print(f"  原始编码: {encoding}")

    # 读取内容
    with codecs.open(file_path, 'r', encoding=encoding, errors='ignore') as f:
        content = f.read()

    # 修复针对特定文件的问题
    filename = os.path.basename(file_path)

    if filename == 'qimen.html':
        # 修复按钮文字
        content = content.replace('开始排</button>', '开始排盘</button>')
        # 修复footer
        content = fix_footer(content)

    elif filename == 'meihua.html':
        # 修复按钮图标
        content = content.replace('?时间起卦', '⏰ 时间起卦')
        content = content.replace('请输入汉?>', '请输入汉字')
        # 修复footer
        content = fix_footer(content)

    elif filename == 'fengshui.html':
        # 修复商品链接和价格
        content = content.replace('id=待上?', 'id=123456789')
        content = content.replace('¥688/', '¥688')
        # 修复footer
        content = fix_footer(content)

    elif filename == 'ziwei.html':
        # 修复时间选项
        content = fix_ziwei_hours(content)
        # 修复gender选项
        content = content.replace(
            '<option value="male"></option>',
            '<option value="male">男</option>'
        )
        content = content.replace(
            '<option value="female"></option>',
            '<option value="female">女</option>'
        )
        # 修复footer
        content = fix_footer(content)

    # 保存为UTF-8
    backup_path = file_path + '.bak'
    if not os.path.exists(backup_path):
        import shutil
        shutil.copy2(file_path, backup_path)
        print(f"  已备份原文件到: {os.path.basename(backup_path)}")

    with codecs.open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

    print(f"  [OK] 已转换并修复为UTF-8")

def fix_footer(content):
    """修复footer乱码"""
    # 找到footer开始位置
    footer_start = content.find('<footer class="footer">')
    if footer_start == -1:
        return content

    # 找到footer结束位置（</footer>）
    footer_end = content.find('</footer>', footer_start)
    if footer_end == -1:
        return content

    # 替换footer
    new_content = content[:footer_start] + CORRECT_FOOTER + content[footer_end+9:]
    return new_content

def fix_ziwei_hours(content):
    """修复紫微斗数时间选项"""
    # 找到select#birth-hour
    select_start = content.find('<select id="birth-hour">')
    if select_start == -1:
        return content

    select_end = content.find('</select>', select_start)
    if select_end == -1:
        return content

    # 替换时间选项
    new_content = content[:select_start] + '<select id="birth-hour">' + CORRECT_ZIWEI_HOURS + content[select_end:]
    return new_content

def main():
    print("=" * 60)
    print("龙脉文化网站修复脚本 v1.0")
    print("=" * 60)

    for file_path in FILES_TO_FIX:
        if os.path.exists(file_path):
            try:
                convert_to_utf8(file_path)
            except Exception as e:
                print(f"  [FAIL] 处理失败: {e}")
        else:
            print(f"[WARN] 文件不存在: {file_path}")

    print("\n" + "=" * 60)
    print("修复完成！")
    print("=" * 60)
    print("\n下一步：")
    print("1. 检查修改后的文件")
    print("2. git add . && git commit -m '修复编码问题'")
    print("3. git push origin main")
    print("4. GitHub Settings -> Pages -> Clear cache")
    print("=" * 60)

if __name__ == '__main__':
    main()
