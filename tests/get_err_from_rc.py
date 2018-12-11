# -*- coding: utf-8 -*-

"""
Получаем список тестов с ошибками из сборки RC
"""

import requests
import collections
import itertools
import argparse


class RC:
    err_exist = False

    def get_errors(self, jobs):
        description = '<pre><ul>'
        JC_API = 'http://jenkins-control.tensor.ru/api/'
        for job in jobs:
            rec = requests.post(JC_API + 'acceptance/get_id_job_by_name', json={'job': job})
            rec.raise_for_status()
            rec = requests.post(JC_API + 'test_result/errors_from_last_build', json={'id_job': rec.json()['result']})
            rec.raise_for_status()
            errors = rec.json()['result']
            if not errors:
                continue
            self.err_exist = True
            err_dict = collections.defaultdict(list)
            new_list = list(itertools.chain(*errors.values()))
            for k, v in list(zip(new_list[::2], new_list[1::2])):
                err_dict[v].append(k)
            for err in err_dict:
                description += "<b><a href='{0}'>{0}</a></b><li>{1}</li><br>".format(err, '</li><li>'.join(err_dict[err]))
            description += "</ul>"
        return description


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('-j', '--jobs', nargs='+', help='List jobs for return errors with fail tests')
    args = parser.parse_args()
    rc = RC()
    result = rc.get_errors(args.jobs)
    if rc.err_exist:
        print(result)



