# -*- coding: utf-8 -*-
import os
import shutil

# удаление лишних папок со страницами тестов
root = os.getcwd()
os.chdir(r'stand/intest/integration')
root_1 = os.getcwd()
exclude = ['_VDOM']
tmp_list_dirs = [d for d in os.listdir(root_1) if os.path.isdir(os.path.join(root_1, d)) and d not in exclude]
for tmp_dir in tmp_list_dirs:
    shutil.rmtree(tmp_dir)

# удаление лишних файлов тестов
os.chdir(root)
os.chdir('int')
root_1 = os.getcwd()
exclude = ['start_tests.py', 'test_todomvc.py', 'common.py',
           'todomvc.py', 'tabbuttons.py', 'browser.py', 'index.py', 'wisbis.py']
for top, folders, files in os.walk(root_1):
    if top == root_1 or top == os.path.join(root_1, 'pages'):
        for file in files:
            if file not in exclude:
                os.remove(os.path.join(top, file))
