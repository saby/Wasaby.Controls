# -*- coding: utf-8 -*-
from get_info_or_kill_process import ProcInfo

try:
	proc_cls = ProcInfo()
	proc_cls.kill_proc_by_name('cmd.exe', 'start_preprocessor_controls373100.bat', kill_all = True, tmp_wait = 3)
	print('Удаления препрооцессора прошло удачно')
except:
	print('Ошибка при удалении препрооцессора')

try:
	proc_cls = ProcInfo()
	proc_cls.kill_proc_by_name('cmd.exe', 'start_robohydra_controls373100.bat', kill_all = True, tmp_wait = 3)
	print('Удаления робогидры прошло удачно')
except:
	print('Ошибка при удалении робогидры')