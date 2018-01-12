# -*- coding: utf-8 -*-
import os
import shutil

# удаление лишних папок со страницами тестов
root = os.getcwd()
dirs_for_del = ['reg', 'unit', r'stand/intest/regression']
for tmp_dir in dirs_for_del:
    if os.path.exists(tmp_dir):
        shutil.rmtree(tmp_dir)

os.chdir(r'stand/intest/integration')
root_1 = os.getcwd()
exclude = ['_VDOM']
tmp_list_dirs = [d for d in os.listdir(root_1) if os.path.isdir(os.path.join(root_1, d)) and d not in exclude]
for tmp_dir in tmp_list_dirs:
    shutil.rmtree(tmp_dir)
