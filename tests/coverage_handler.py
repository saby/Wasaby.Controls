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

    def get_fullpath_test_name(self, src):
        """Получаем пути расположения файлов"""
        test_path, _ = os.path.split(src)
        for root, _, filename in os.walk(test_path):
            for f in filename:
                if f.startswith('test_') and f.endswith('.py'):
                    self.fullpath.append(os.path.join(root, f).replace(test_path + os.path.sep, ''))

    @staticmethod
    def search_other_file(cover_file):
        """Ищем файлы, которые могут быть связаны"""

        # соотносим конвертируемые ресурсы с исходниками
        cover_file = cover_file.replace('/home/sbis/Controls/build-ui/resources', os.path.join(os.environ["WORKSPACE"], 'controls'))
        other_files = [cover_file]
        component_path = os.path.splitext(cover_file)[0]
        # если есть папка с названием компонента
        if os.path.exists(component_path):
            for other in os.listdir(component_path):
                other_component_file = os.path.join(component_path, other)
                if os.path.isfile(other_component_file):
                    other_files.append(other_component_file)

        # заберем все файлы не js в текущей папке
        current_dir = os.path.split(cover_file)[0]
        for current_file in os.listdir(current_dir):
            current_file_path = os.path.join(current_dir, current_file)
            if os.path.isfile(current_file_path) and not current_file_path.endswith('.js'):
                other_files.append(current_file_path)

        # Демки
        if 'Controls-demo' in cover_file:
            demo_path = os.path.split(cover_file)[0]
            if not demo_path.endswith('Controls-demo'):
                for demo_root,_, demo_file in os.walk(demo_path):
                    for f in demo_file:
                        other_files.append(os.path.join(demo_root, f))
        return other_files

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
                        coverage_result.extend(self.search_other_file(k))
            # обрезаем пути, переменная берется из сборки
            for i, filename in enumerate(coverage_result):
                coverage_result[i] = filename.replace(os.path.join(os.environ["WORKSPACE"], 'controls'), '')
            s_result = sorted(set(coverage_result))
            self.build_result[item] = s_result

        # записываем результаты в файл
        with open(os.path.join(path, RESULT_JSON), mode='a+', encoding='utf-8') as f:
            f.write(json.dumps(OrderedDict(sorted(self.build_result.items(), key=lambda t: t[0])), indent=2))

    def get_tests(self, result_json, change_files):
        """Возвращает список файлов, которые нужно запустить"""

        test_result = []
        with open(result_json, encoding='utf-8') as f:
            data = json.load(f, encoding='utf-8')
            for test_name in data:
                for source in data[test_name]:
                    for file in change_files:
                        if file in source:
                            test_result.append(test_name)

        # иногда необходимо вернуть все тесты верстки
        if 'reg' in result_json and not test_result:
            for file in change_files:
                if '/themes/' in file or file.endswith('.less'):
                    test_result.extend(data.keys())

        return test_result

    def get_test_for_regression_test(self, change_files):
        """Получить список тестов для запуска, в которых делались изменения"""

        int_tests_sbis3 = []
        int_tests_vdom = []
        reg_tests_sbis3 = []
        reg_tests_vdom = []
        def validate(path_test):
            test_name = os.path.basename(path_test)
            if test_name.startswith('test') and test_name.endswith('.py'):
                if path_test.startswith('tests/int/'):
                    if 'SBIS3.CONTROLS' in path_test:
                        int_tests_sbis3.append(path_test.replace('tests/int/SBIS3.CONTROLS/', ''))
                    elif 'VDOM' in path_test:
                        int_tests_vdom.append(path_test.replace('tests/int/VDOM/', ''))
                elif path_test.startswith('tests/reg/'):
                    if 'SBIS3.CONTROLS' in path_test:
                        reg_tests_sbis3.append(path_test.replace('tests/reg/SBIS3.CONTROLS/', ''))
                    elif 'VDOM' in path_test:
                        reg_tests_vdom.append(path_test.replace('tests/reg/VDOM/', ''))

        for file in change_files:
            validate(file)
        return int_tests_sbis3, int_tests_vdom, reg_tests_sbis3, reg_tests_vdom

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    build = parser.add_argument_group('build')
    build.add_argument('-s', '--source_path', help='root path with inner coverage.json ')
    action = parser.add_argument_group('action')
    action.add_argument('-c', '--changelist', nargs='+', help='List changed files')
    action.add_argument('-rj', '--result_json', help='Location result.json with coverage')
    action.add_argument('-d', '--developer', action='store_true', default=False, help='I\'m developer autotest')
    args = parser.parse_args()
    coverage = Coverage()
    if args.source_path:
        print('Собираем покрытие', args.source_path)
        coverage.get_fullpath_test_name(args.source_path)
        coverage.build(args.source_path)

    if args.changelist:
        if not args.developer:
            test_result = coverage.get_tests(args.result_json, args.changelist)
            if test_result:
                print(' '.join(set(test_result)))
        else:
            int_test_sbis3, int_test_vdom, reg_test_sbis3, reg_test_vdom = coverage.get_test_for_regression_test(args.changelist)
            if int_test_sbis3 or int_test_vdom or reg_test_sbis3 or reg_test_vdom:
                print('reg_sbis3:{reg_sbis3};reg_vdom:{reg_vdom};int_sbis3:{int_sbis3};int_vdom:{int_vdom}'.format(
                    reg_sbis3=' '.join(set(reg_test_sbis3)), reg_vdom=' '.join(set(reg_test_vdom)),
                    int_sbis3=' '.join(set(int_test_sbis3)), int_vdom=' '.join(set(int_test_vdom))))

