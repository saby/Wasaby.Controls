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
exclude = ['_VDOM', '_Grids']
tmp_list_dirs = [d for d in os.listdir(root_1) if os.path.isdir(os.path.join(root_1, d)) and d not in exclude]
for tmp_dir in tmp_list_dirs:
    shutil.rmtree(tmp_dir)

os.chdir(r'_Grids')
root_grid = os.getcwd()
delete_folders('IntCompositeViewList', 'IntDataGrid', 'IntTreeDataGrid', 'IntTreeView')

os.chdir(r'IntCompositeViewList')
delete_folders()

os.chdir(os.path.join(root_grid, r'IntDataGrid'))
delete_folders('DG7', 'DG13', 'DG3', 'DG11', 'DGPlace')

os.chdir(r'DGPlace')
delete_folders('DGPlace2', 'DGPlace38', 'DGPlace16', 'DGPlace44')

os.chdir(os.path.join(root_grid, r'IntTreeDataGrid'))
delete_folders('TDG12', 'TDG5', 'TDG6', 'TDGMove', 'TDG4', 'TDG_model')

os.chdir(r'IntTreeDataGrid')
root_1 = os.getcwd()
exclude = ['TDG4', 'TDG_model']
tmp_list_dirs = [d for d in os.listdir(root_1) if os.path.isdir(os.path.join(root_1, d)) and d not in exclude]
for tmp_dir in tmp_list_dirs:
    shutil.rmtree(tmp_dir)

os.chdir(os.path.join(root, 'int'))
root_1 = os.getcwd()
exclude = ['common.py', 'start_tests.py', 'config.ini', 'smoke_test.py', 'test_todomvc.py',
           'test_treedatagrid_2.py', 'test_treedatagrid_2_db.py', 'test_vdom.py']
tmp_list_files = [f for f in os.listdir(root_1) if os.path.isfile(os.path.join(root_1, f)) and f not in exclude]
for file_name in tmp_list_files:
    os.remove(file_name)
shutil.copy('smoke_test.py', 'test_smoke.py')