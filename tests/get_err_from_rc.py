# -*- coding: utf-8 -*-

"""
Получаем список тестов с ошибками из сборки RC
"""

import requests
import collections
import itertools
import argparse

if __name__ == '__main__':
    JC_API = 'http://jenkins-control.tensor.ru/api/'
    description = "UI ТЕСТЫ С ОШИБКАМИ В RC:<pre><ul>"
    parser = argparse.ArgumentParser()
    parser.add_argument('-j', '--jobs', nargs='+', help='List jobs for return errors with fail tests')
    args = parser.parse_args()
    for job in args.jobs:
        rec = requests.post(JC_API + 'acceptance/get_id_job_by_name', json={'job': job})
        rec.raise_for_status()
        rec = requests.post(JC_API + 'test_result/errors_from_last_build', json={'id_job': rec.json()['result']})
        rec.raise_for_status()
        errors = rec.json()['result']
        err_dict = collections.defaultdict(list)
        new_list = list(itertools.chain(*errors.values()))
        for k, v in list(zip(new_list[::2], new_list[1::2])):
            err_dict[v].append(k)
        for err in err_dict:
            description += "<b><a href='{0}'>{0}</a></b><li>{1}</li><br>".format(err, '</li><li>'.join(err_dict[err]))
        description += "</ul>"
    print(description)

