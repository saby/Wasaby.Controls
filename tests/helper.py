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

    def get_errors_from_rc(self, version, type_test):
        """Возвращает упавшие тесты и причину из последней RC сборки
        :param version: Версия платформы
        :param type_test: Тип тестов
        """
        job = '({}-chrome) {} controls'.format(type_test, version)
        payload = {'job': job}
        req = requests.post(self.JC_URL + '/api/acceptance/get_id_job_by_name', json=payload)
        req.raise_for_status()
        id_job = req.json()['result']
        payload = {'id_job': id_job}
        req = requests.post(self.JC_URL + '/api/test_result/errors_from_last_build', json=payload)
        req.raise_for_status()
        result = req.json()['result']
        if not result['success']:
            data = result['data']
            for item in data:
                print('{} {}'.format(item, ' '.join(data[item])))


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('-efrc', '--errors_from_rc', help='Получить список упавших тестов из RC. '
                                                          'Опция принимает версию платформы: 3.18.600')
    parser.add_argument('-tt', '--type_test', help='Тип тестов: int, reg')
    args = parser.parse_args()
    if args.errors_from_rc:
        JC().get_errors_from_rc(args.errors_from_rc, args.type_test)
