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
exclude = ['_Grids', 'IntComboBox', 'IntDropdownList']
tmp_list_dirs = [d for d in os.listdir(root_1) if os.path.isdir(os.path.join(root_1, d)) and d not in exclude]
for tmp_dir in tmp_list_dirs:
    shutil.rmtree(tmp_dir)

os.chdir(r'_Grids')
root_1 = os.getcwd()
exclude = ['IntCompositeViewList', 'IntDataGrid', 'IntTreeDataGrid', 'IntTreeView']
tmp_list_dirs = [d for d in os.listdir(root_1) if os.path.isdir(os.path.join(root_1, d)) and d not in exclude]
for tmp_dir in tmp_list_dirs:
    shutil.rmtree(tmp_dir)

os.chdir(r'IntCompositeViewList')
root_1 = os.getcwd()
tmp_list_dirs = [d for d in os.listdir(root_1) if os.path.isdir(os.path.join(root_1, d)) and d not in exclude]
for tmp_dir in tmp_list_dirs:
    shutil.rmtree(tmp_dir)

os.chdir(os.path.join(root, r'stand/intest/integration/_Grids/IntDataGrid'))
root_1 = os.getcwd()
exclude = ['DG7', 'DG13', 'DG11', 'DGPlace']
tmp_list_dirs = [d for d in os.listdir(root_1) if os.path.isdir(os.path.join(root_1, d)) and d not in exclude]
for tmp_dir in tmp_list_dirs:
    shutil.rmtree(tmp_dir)
	
os.chdir(r'DGPlace')
root_1 = os.getcwd()
exclude = ['DGPlace2', 'DGPlace38', 'DGPlace16', 'DGPlace44']
tmp_list_dirs = [d for d in os.listdir(root_1) if os.path.isdir(os.path.join(root_1, d)) and d not in exclude]
for tmp_dir in tmp_list_dirs:
    shutil.rmtree(tmp_dir)
	
os.chdir(os.path.join(root, r'stand/intest/integration/_Grids/IntTreeDataGrid'))
root_1 = os.getcwd()
exclude = ['TDG12', 'TDG5', 'TDG6', 'TDGMove']
tmp_list_dirs = [d for d in os.listdir(root_1) if os.path.isdir(os.path.join(root_1, d)) and d not in exclude]
for tmp_dir in tmp_list_dirs:
    shutil.rmtree(tmp_dir)
	
os.chdir(os.path.join(root, r'stand/intest/integration/_Grids/IntTreeView'))
root_1 = os.getcwd()
exclude = ['IntTreeView1']
tmp_list_dirs = [d for d in os.listdir(root_1) if os.path.isdir(os.path.join(root_1, d)) and d not in exclude]
for tmp_dir in tmp_list_dirs:
    shutil.rmtree(tmp_dir)
		
os.chdir(os.path.join(root, 'int'))
root_1 = os.getcwd()
exclude = ['common.py', 'start_tests.py', 'config.ini', 'smoke_test.py', 'test_combobox.py',
           'test_compositeview_list.py', 'test_datagrid_1.py', 'test_datagrid_2.py', 'test_datagrid_4.py',
		   'test_datagrid.py', 'test_drop_down_list.py', 'test_edit_at_place_12_db.py', 'test_edit_at_place_02_db.py',
		   'test_edit_at_place_07_db.py', 'test_edit_at_place_01_db.py', 'test_edit_at_place_1.py',
		   'test_treedatagrid_1.py', 'test_treedatagrid_3_db.py', 'test_treedatagrid_3.py', 
		   'test_treedatagrid_4_db.py', 'test_treedatagrid_4.py', 'test_treedatagrid_move.py', 'test_treeview.py']
tmp_list_files = [f for f in os.listdir(root_1) if os.path.isfile(os.path.join(root_1, f)) and f not in exclude]
for file_name in tmp_list_files:
    os.remove(file_name)
shutil.copy('smoke_test.py', 'test_smoke.py')