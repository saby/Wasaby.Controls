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
    build_result = {}
    test_result = []

    def build(self, path):
        """Пробегает по всем папкам в поисках coverage.json"""

        test_path = os.listdir(path)
        for tdir in test_path:
            path_list = []
            root = os.path.join(path, tdir)
            for top, directory, files in os.walk(root):
                for f in files:
                    if f.endswith('-coverage.json') :
                        path_list.append(os.path.join(top, f))
            self.path_result[tdir] = path_list

        for ts, item in enumerate(self.path_result):
            coverage_result = []
            print(ts, 'Name: ', item)
            for fname in self.path_result[item]:
                with open(fname, encoding='utf-8', mode='r') as f:
                    print('File: ', fname)
                    d = json.load(f, encoding='utf-8')
                    # получаем зависимости
                    for k in d:
                        coverage_result.append(k)
            s_result = sorted(set(coverage_result))
            self.build_result[item] = s_result

        # записываем результаты в файл
        with open(os.path.join(path, RESULT_JSON), mode='a+', encoding='utf-8') as f:
            f.write(json.dumps(self.build_result, indent=2))

    def get_tests(self, change_files):
        """Возвращает список файлов, которые нужно запустить"""

        with open(RESULT_JSON, encoding='utf-8') as f:
            data = json.load(f, encoding='utf-8')
            for test_name in data:
                for source in data[test_name]:
                    for file in change_files:
                        if file in source:
                            self.test_result.append(test_name)


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    build = parser.add_argument_group('build')
    build.add_argument('-s', '--source_path', help='root path with inner coverage.json ')
    action = parser.add_argument_group('action')
    action.add_argument('-c', '--changelist', nargs='+', help='List changed files')
    args = parser.parse_args()
    coverage = Coverage()
    if args.source_path:
        print('Собираем покрытие', args.source_path)
        coverage.build(args.source_path)

    if args.changelist:
        coverage.get_tests(args.changelist)
        if coverage.test_result:
            print(' '.join(set(coverage.test_result)))
