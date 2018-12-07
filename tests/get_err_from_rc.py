# -*- coding: utf-8 -*-

"""
Получаем список тестов с ошибками из сборки RC
"""

import requests
import collections
import itertools


JC_API = 'http://jenkins-control.tensor.ru/api/'
rec = requests.post(JC_API + 'acceptance/get_id_job_by_name', json={'job': '(int-chrome) 3.19.100 controls'})
rec.raise_for_status()
rec = requests.post(JC_API + 'test_result/errors_from_last_build', json={'id_job': rec.json()['result']})
rec.raise_for_status()
errors = rec.json()['result']
err_dict = collections.defaultdict(list)
new_list = list(itertools.chain(*errors.values()))
for k, v in list(zip(new_list[::2], new_list[1::2])):
    err_dict[v].append(k)
description = "ПАДАЕТ В RC:<br>"
for err in err_dict:
    description += "<a href='{0}'>{0}</a> - {1}<br>".format(err, ', '.join(err_dict[err]))
print(description)

