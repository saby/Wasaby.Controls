# -*- coding: utf-8 -*-
from get_info_or_kill_process import ProcInfo
import os

ver = os.environ["ver"]
preproc = 'start_preprocessor_' + ver + '.bat'
robogid = 'intest' + ver + '.bat'

try:
	proc_cls = ProcInfo()
	proc_cls.kill_proc_by_name('cmd.exe', preproc, kill_all = True, tmp_wait = 3)
	print('Остановка все запущенных процессов препрооцессора прошла успешно')
except:
	print('При остановке всех запущенных процессов препрооцессора произошла ошибка')

try:
	proc_cls = ProcInfo()
	proc_cls.kill_proc_by_name('cmd.exe', robogid, kill_all = True, tmp_wait = 3)
	print('Остановка все запущенных процессов робогидры прошла успешно')
except:
	print('При остановке всех запущенных процессов робогидры произошла ошибка')