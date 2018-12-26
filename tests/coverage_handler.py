"""
модуль для составления файла из отчетов istanbul
может вовзарщать список тестов, в зависимости какие исходные файлы изменялись

"""

import os
import json
import argparse
from collections import OrderedDict

RESULT_JSON = 'result.json'


class Coverage:
    """Составляет исходный json файл с названиями тестов и их зависимостями"""

    path_result = {}
    build_result = {}
    fullpath = []

    def get_fullpath_test_name(self):
        """Получаем пути расположения файлов"""
        cwd = os.getcwd()
        os.chdir('int')
        for root_test in ('SBIS3.CONTROLS', 'VDOM'):
            for root, dirs , filename in os.walk(os.path.join(root_test)):
                for f in filename:
                    if f.startswith('test_') and f.endswith('.py'):
                        self.fullpath.append(os.path.join(root, f))
        os.chdir(cwd)

    def build(self, path):
        """Пробегает по всем папкам в поисках coverage.json"""

        test_path = os.listdir(path)
        for tdir in test_path:
            path_list = []
            root = os.path.join(path, tdir)
            for top, _, files in os.walk(root):
                for f in files:
                    if f.endswith('-coverage.json'):
                        path_list.append(os.path.join(top, f))
            path_test = [test for test in self.fullpath if tdir in test][0]
            self.path_result[path_test] = path_list

        for ts, item in enumerate(self.path_result):
            coverage_result = []
            print(ts, 'Name: ', item)
            for fname in self.path_result[item]:
                with open(fname, encoding='utf-8', mode='r') as f:
                    print('File: ', fname)
                    d = json.load(f, encoding='utf-8')
                    # получаем зависимости
                    for k in d:
                        # обрезаем пути, переменная берется из сборки
                        env = os.environ["WORKSPACE"]
                        k = k.replace(env, '')
                        coverage_result.append(k)
            s_result = sorted(set(coverage_result))
            self.build_result[item] = s_result

        # записываем результаты в файл
        with open(os.path.join(path, RESULT_JSON), mode='a+', encoding='utf-8') as f:
            f.write(json.dumps(OrderedDict(sorted(self.build_result.items(), key=lambda t: t[0])), indent=2))

    def get_tests(self, change_files):
        """Возвращает список файлов, которые нужно запустить"""

        test_result = []
        with open(RESULT_JSON, encoding='utf-8') as f:
            data = json.load(f, encoding='utf-8')
            for test_name in data:
                for source in data[test_name]:
                    for file in change_files:
                        if file in source:
                            test_result.append(test_name)
        return test_result

    def get_test_for_regression_test(self, change_files):
        """Получить список тестов для запуска, в которых делались изменения"""

        int_tests = []
        reg_tests = []
        def validate(path_test):
            test_name = os.path.basename(path_test)
            if test_name.startswith('test') and test_name.endswith('.py'):
                if path_test.startswith('tests/int/'):
                    int_tests.append(path_test.replace('tests/int/', ''))
                elif path_test.startswith('tests/reg/'):
                    reg_tests.append(path_test.replace('tests/reg/', ''))

        for file in change_files:
            validate(file)
        return int_tests, reg_tests

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
        coverage.get_fullpath_test_name()
        coverage.build(args.source_path)

    if args.changelist:
        test_result = coverage.get_tests(args.changelist)
        if test_result:
            print(' '.join(set(test_result)))
        else:
            int_test, reg_test = coverage.get_test_for_regression_test(args.changelist)
            if int_test or reg_test:
                print('reg:{reg};int:{int}'.format(reg=' '.join(set(reg_test)), int=' '.join(set(int_test))))

