# -*- coding: utf-8 -*-
"""
Общий модуль для вспомогательных скриптов
"""

import argparse
import requests


class JobRC:
    """
    Класс для работы с RC сборками
    """
    JC_URL = 'http://jenkins-control.tensor.ru'

    def get_id_job(self, version):
        """Возвращает id job
        :param version: Версия платформы
        :return:
        """
        result = []
        payload = {"users": [], "regex": ".*\((int|reg)-chrome\) {} controls.*".format(version),
                   "host": "ci-platform.sbis.ru", "type_build": None}
        req = requests.post(self.JC_URL + '/api/acceptance/get_list', json=payload)
        req.raise_for_status()
        req_result = req.json()['result']['list']
        # print(req_result)
        for job in req_result:
            data = {"_id": job['_id'], "last_build": job['last_build'], "job": job['job']}
            result.append(data)
        return result

    def get_fail_tests(self, jobs):
        """Возвращает список упавших тестов и причину
        :param jobs: Список из id сборки и билдом
        :return:
        """
        tests = []
        for item in jobs:
            payload = {"build": item['last_build'], "id_job": item['_id']}
            req = requests.post(self.JC_URL + '/api/test_result/list', json=payload)
            req.raise_for_status()
            result = req.json()['result']['tests']
            # print(item['job'])
            # print(result)
            for test in result:
                data = {"suite":test['_id'], "tests": [(t['test'], t['description']) for t in test['tests']]}
                tests.append(data)
        skip_tests = []
        for suite in tests:
            for test in suite['tests']:
                skip_tests.append('{}.{}'.format(suite['suite'], test[0]))
                skip_tests.append('"{}"'.format(test[1] or 'Причина падения еще не определена'))
        return ' '.join(skip_tests)

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('-sfrc', '--skip_from_rc', help='Получить список упавших тестов из RC. '
                                                        'Опция принимает версию платформы: 3.18.600')
    args = parser.parse_args()
    if args.skip_from_rc:
        jrc = JobRC()
        j_id = jrc.get_id_job(args.skip_from_rc)
        result = jrc.get_fail_tests(j_id)
        print(result)
