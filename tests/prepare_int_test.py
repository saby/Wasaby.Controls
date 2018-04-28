# -*- coding: utf-8 -*-
import os
import shutil


def delete_folders(*exclude):
    root_folder = os.getcwd()
    tmp_list_dirs = [d for d in os.listdir(root_folder) if os.path.isdir(os.path.join(root_folder, d)) and d not in exclude]
    for tmp_dir in tmp_list_dirs:
        shutil.rmtree(tmp_dir)

# удаление лишних папок со страницами тестов
root = os.getcwd()
delete_folders('int', 'stand', 'WSTest')

os.chdir(r'stand/Intest/regression')
root_regr = os.getcwd()
delete_folders('CssRichEditor', 'CssDataGridView')

os.chdir(r'CssRichEditor')
root_1 = os.getcwd()
delete_folders('RE41')

tmp_list_files = [f for f in os.listdir(root_1) if os.path.isfile(os.path.join(root_1, f))]
for file_name in tmp_list_files:
    os.remove(file_name)

os.chdir(root_regr+r'/CssDataGridView')
delete_folders()
