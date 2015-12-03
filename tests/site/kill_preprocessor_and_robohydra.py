# -*- coding: utf-8 -*-
from get_info_or_kill_process import ProcInfo

try:
	proc_cls = ProcInfo()
	proc_cls.kill_proc_by_name('cmd.exe', 'start_preprocessor_controls380.bat', kill_all = True, tmp_wait = 3)
	print('Остановка все запущенных процессов препрооцессора прошла успешно')
except:
	print('При остановке всех запущенных процессов препрооцессора произошла ошибка')

try:
	proc_cls = ProcInfo()
	proc_cls.kill_proc_by_name('cmd.exe', 'start_robohydra_controls380.bat', kill_all = True, tmp_wait = 3)
	print('Остановка все запущенных процессов робогидры прошла успешно')
except:
	print('При остановке всех запущенных процессов робогидры произошла ошибка')