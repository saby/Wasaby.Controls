# -*- coding: utf-8 -*-

"""
Получаем список тестов с ошибками из сборки RC
"""

import requests


JC_API = 'http://jenkins-control.tensor.ru/api/'
rec = requests.post(JC_API + 'acceptance/get_id_job_by_name', json={'job': '(int-chrome) 3.19.100 controls'})
rec.raise_for_status()
rec = requests.post(JC_API + 'test_result/errors_from_last_build', json={'id_job': rec.json()['result']})
rec.raise_for_status()
errors = rec.json()['result']
description = ""
for err in errors:
    _iter = iter(errors[err])
    rc_err = dict(zip(_iter, _iter))
    for test in rc_err:
        description += "<b>{}<b> - {}<br>".format(test, rc_err[test])
print(description)

