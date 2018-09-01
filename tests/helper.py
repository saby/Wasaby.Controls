# -*- coding: utf-8 -*-
"""
Общий модуль для вспомогательных скриптов
"""

import argparse
import requests


class JC:
    """
    Класс для работы с JC
    """
    JC_URL = 'http://usd-comp91.corp.tensor.ru:5000'

    def get_errors_from_rc(self, version, type):
        """Возвращает упавшие тесты и описание
        :param job: Название сборки, напр. (int-chrome) 3.18.600 controls
        """
        reg_job = '(reg-chrome) {} controls'.format(version)
        int_job = '(int-chrome) {} controls'.format(version)
        if type == 'reg':
            payload = {'job_name': reg_job}
        elif type == 'int':
            payload = {'job_name': int_job}
        req = requests.post(self.JC_URL + '/api/test_result/errors_from_last_build', json=payload)
        req.raise_for_status()
        result = req.json()['result']
        if result['success']:
            data = result['data']
            test_for_skip = ''
            for item in data:
                test_for_skip += '{}.{} "{}" '.format(item['suite'], item['test'],
                                            item['description'] or 'Сборка не подписана, причина падения не определена')
            print(test_for_skip)


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('-efrc', '--errors_from_rc', help='Получить список упавших тестов из RC. '
                                                          'Опция принимает версию платформы: 3.18.600')
    parser.add_argument('-tt', '--type_test', help='Тип тестов: int, reg')
    args = parser.parse_args()
    if args.errors_from_rc:
        JC().get_errors_from_rc(args.errors_from_rc, args.type_test)
