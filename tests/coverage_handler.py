"""
модуль для составления файла из отчетов istanbul
может вовзарщать список тестов, в зависимости какие исходные файлы изменялись

"""

import os
import json
import argparse

RESULT_JSON = 'result.json'


class Coverage:
    """Составляет исходный json файл с названиями тестов и их зависимостями"""
    path_result = {}
    result = {}

    def build(self, path):
        """Пробегает по всем папкам в поисках coverage.json"""
        test_path = os.listdir(path)
        for tdir in test_path:
            path_list = []
            root = os.path.join(path, tdir)
            for top, d, f in os.walk(root):
                for i in d:
                    file_path = os.path.join(top, i)
                    file_name = os.path.join(file_path, 'coverage.json')
                    if os.path.exists(file_name):
                        path_list.append(file_name)
            self.path_result[tdir] = path_list

        for ts, item in enumerate(self.path_result):
            coverage_result = []
            print(ts, 'Name: ', item)
            for fname in self.path_result[item]:
                with open(fname, encoding='utf-8', mode='r') as f:
                    print('File: ', fname)
                    d = json.loads(f.read(), encoding='utf-8')
                    # получаем зависимости
                    for k in d:
                        coverage_result.append(k)
            s_result = sorted(set(coverage_result))
            self.result[item] = s_result

        # записываем результаты в файл
        mode = 'a+'
        if os.path.exists(RESULT_JSON) :
            mode = 'r+'

        with open(os.path.join(path, RESULT_JSON), mode=mode, encoding='utf-8') as f:
            f.seek(0)
            f.write(json.dumps(self.result, indent=2))
            f.truncate()


class Test:
    """Возвращает список тестов по зависимостям"""
    result = []

    def search(self, change_files):
        with open(RESULT_JSON, encoding='utf-8') as f:
            data = json.loads(f.read(), encoding='utf-8')
            for test_name in data:
                for source in data[test_name]:
                    for file in change_files:
                        if file in source:
                            self.result.append(test_name)


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    build = parser.add_argument_group('build')
    build.add_argument('-s', '--source_path', help='root path with inner coverage.json ')
    action = parser.add_argument_group('action')
    action.add_argument('-c', '--changelist', nargs='+', help='List changed files')
    args = parser.parse_args()
    if args.source_path:
        print('Собираем покрытие', args.source_path)
        coverage = Coverage()
        coverage.build(args.source_path)

    if args.changelist:
        test = Test()
        test.search(args.changelist)
        if test.result:
            print(' '.join(set(test.result)))

