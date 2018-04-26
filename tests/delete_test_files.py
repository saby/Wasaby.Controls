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
dirs_for_del = ['reg', 'unit', r'stand/Intest/regression']
for tmp_dir in dirs_for_del:
    if os.path.exists(tmp_dir):
        shutil.rmtree(tmp_dir)

os.chdir(r'stand/Intest/integration')
delete_folders('_VDOM', '_Grids', 'IntComboBox', 'IntDropdownList')

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

os.chdir(os.path.join(root_grid, r'IntTreeView'))
delete_folders('IntTreeView1')

# удаляем лишние тесты
os.chdir(os.path.join(root, 'int'))
root_1 = os.getcwd()
exclude_files = ['common.py', 'start_tests.py', 'config.ini', 'smoke_test.py', 'test_combobox.py',
           'test_compositeview_list.py', 'test_datagrid_1.py', 'test_datagrid_2.py', 'test_datagrid_4.py',
           'test_datagrid.py', 'test_drop_down_list.py', 'test_edit_at_place_12_db.py', 'test_edit_at_place_02_db.py',
           'test_edit_at_place_07_db.py', 'test_edit_at_place_01_db.py', 'test_edit_at_place_1.py',
           'test_treedatagrid_1.py', 'test_treedatagrid_3_db.py', 'test_treedatagrid_3.py',
           'test_treedatagrid_4_db.py', 'test_treedatagrid_4.py', 'test_treedatagrid_move.py', 'test_treeview.py',
           'test_todomvc.py', 'test_todomvc_1.py', 'test_todomvc_2.py', 'test_vdom.py']

tmp_list_files = [f for f in os.listdir(root_1) if os.path.isfile(os.path.join(root_1, f)) and f not in exclude_files]
for file_name in tmp_list_files:
    os.remove(file_name)
shutil.copy('smoke_test.py', 'test_smoke.py')
