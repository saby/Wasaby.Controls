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
    test_names = []
    err_links = []
    err_dict = collections.defaultdict(list)
    head = ''

    def get_errors(self, jobs):
        """получаем ошибки из Jenkins-control"""

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
            new_list = list(itertools.chain(*errors.values()))
            self.test_names = new_list[::2]
            self.err_links = new_list[1::2]
            for k, v in list(zip(self.test_names, self.err_links)):
                self.err_dict[v].append(k)

    def get_status_title(self, rc_list, new_list):
        """Возвращает статус сборки с описанием
        - списки ошибок равны ОК
        - список в сборке подмножество в ошибок в RC OK
        - список в рц подмножество ошибок в сборке FAIL
        - списка в сборке нет, в рц есть. return
        - списка в рц нет, в сборке есть FAIL
        - списка в рц нет, в сборке нет return
        """
        rc_set = set(rc_list)
        new_set = set(new_list)

        if rc_set == new_set:
            return "ОК|Эти ошибки уже попали в RC."
        elif new_set.issubset(rc_set):
            return "ОК|Эти ошибки уже попали в RC."
        elif rc_set.issubset(new_set) or not rc_set.intersection(new_set):
            return "FAIL|В сборке падает UI тесты по новым ошибкам! В RC таких нет."
        elif not rc_set and new_set:
            return "FAIL|В сборке падает UI тесты по новым ошибкам! В RC таких нет."
        elif (not new_set and rc_set) or (not rc_set and not new_set):
            return ''

    def description(self, fail_tests_path, skip):
        """Формируем описаниена основе полученных данных из RC сборки и упавших тестов в текущей"""

        with open(fail_tests_path, mode='r', encoding='utf-8') as f:
            now_list = sorted(f.read().split())
            self.test_names = sorted(self.test_names)
            if not skip:
                title = self.get_status_title(self.test_names, now_list)
                if not title:
                    return ''
            else:
                if now_list:
                    self.head = "FAIL WITH SKIP|Тесты по ошибкам из RC не запускались. В сборке появились новые ошибки!"
                    return ''   # не показываем ошибки из RC

        description = '<pre><ul>'
        for err in self.err_dict:
            description += "<b><a href='{0}'>{0}</a></b><li>{1}</li><br>".format(err, '</li><li>'.join(self.err_dict[err]))
        description += "</ul>"
        return description


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('-j', '--jobs', nargs='+', help='List jobs for return errors with fail tests')
    parser.add_argument('-f', '--fail_tests_path', help='Full path for file with fail test.')
    parser.add_argument('-s', '--skip', help='Test was skipped.', action='store_true', default=False)
    args = parser.parse_args()
    rc = RC()
    rc.get_errors(args.jobs)
    result = rc.description(args.fail_tests_path, args.skip)
    if rc.err_exist or rc.head:
        print('{}\n{}'.format(rc.head, result))



