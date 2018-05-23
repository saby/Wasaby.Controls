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
delete_folders('reg', 'stand')

os.chdir(r'stand/Intest')
delete_folders('images', 'pageTemplates', 'regression')
