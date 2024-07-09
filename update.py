import os
import re
import subprocess
import shutil
import filecmp

# 列出当前目录下所有的 .mnaddon 文件
addon_files = [f for f in os.listdir('.') if os.path.isfile(f) and f.endswith('.mnaddon')]

# 初始化最大的 x 和 y
max_x = 0
max_y = 0
target_addon = None

# 定义正则表达式来匹配文件名格式
pattern = r"mntoolbar_v0_0_(\d+)_alpha(\d+)\.mnaddon"

# 遍历每个 .mnaddon 文件，找到 x 和 y 最大的
for addon_file in addon_files:
    match = re.match(pattern, addon_file)
    if match:
        x = int(match.group(1))
        y = int(match.group(2))
        
        if x == max_x:
            if y > max_y:
                max_y = y
                target_addon = addon_file
        elif x > max_x:
            max_x = x
            max_y = y
            target_addon = addon_file

# 将找到的目标插件赋值给 target_addon
if target_addon is not None:
    target_addon = os.path.join(os.getcwd(), target_addon)
    newVersion_path = target_addon.replace('.mnaddon', '')
    print(f"目标插件：{target_addon}\n目标目录：{newVersion_path}")
else:
    print("未找到符合条件的插件文件")
    exit()

# 旧版本地址
oldVersion_path = os.path.join(os.getcwd(), 'mntoolbar')

# 调试信息
print(f"正在解压文件：{target_addon}")

# 检查是否需要解压，存在时是否强制覆盖（这里没有覆盖检查）
if os.path.exists(newVersion_path) and os.path.isdir(newVersion_path):
    shutil.rmtree(newVersion_path)

# 执行命令行命令：mnaddon unpack target_addon
try:
    command = f"mnaddon unpack {target_addon}"
    result = subprocess.run(command, shell=True, capture_output=True, text=True)
    print(result.stdout)
    if result.returncode != 0:
        print(f"解压失败：{result.stderr}")
        exit()
    print("解压成功")
except subprocess.CalledProcessError as e:
    print(f"解压失败：{e}")
    exit()

# 检查新解压目录是否存在
if not os.path.isdir(newVersion_path):
    print(f"解压目录 {newVersion_path} 不存在")
    exit()

# 将 newVersion_path 中的 .js 文件和 .html 文件复制到 oldVersion_path 中 
for file in os.listdir(newVersion_path):
    if file.endswith('.js') or file.endswith('.html'):
        new_file = os.path.join(newVersion_path, file)
        old_file = os.path.join(oldVersion_path, file)
        if os.path.exists(old_file):
            if filecmp.cmp(new_file, old_file):
                print(f"{file} 未发生变化，跳过")
                continue
        print(f"复制文件：{new_file} -> {old_file}")
        shutil.copy(new_file, old_file)

# 调试信息
print("更新完成，准备开始进行文本替换")


# 将 oldVersion_path 中所有 .js 文件中的 foucsNote 改为 focusNote
for file in os.listdir(oldVersion_path):
    if file.endswith('.js'):
        file_path = os.path.join(oldVersion_path, file)
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        new_content = content.replace('foucsNote', 'focusNote')

        if new_content != content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"修改文件：{file_path}")
        else:
            print(f"文件无需修改：{file_path}")
            
print("文本替换完成")


# 输出 newVersion_path 中 oldVersion_path 没有的文件
old_files = set(os.listdir(oldVersion_path))
new_files = set(os.listdir(newVersion_path))

extra_files = new_files - old_files

# 定义用于匹配 "customx.png" 文件的正则表达式
pattern = re.compile(r'custom\d+\.png')

files_found = False

for file in extra_files:
    if not pattern.match(file):
        print(f"文件 {file} 在 newVersion_path 中存在，但在 oldVersion_path 中不存在")
        files_found = True

if not files_found:
    print("没有新文件")
    shutil.rmtree(newVersion_path)