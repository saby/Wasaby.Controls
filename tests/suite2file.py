"""
модуль для получениев файлов для запуска из git diff
выводит в консоль список тестов которые необходимо запустить
"""

import os
import argparse
from fnmatch import fnmatch


def get_suites():
    """Возвращает словарь сьюитов для запуска из git diff"""

    result = {}
    for name in args.changed_files.split(' '):
        if name.endswith('chrome_1920_1080.png'):
            suite = name.split('/capture/')[1].split('/')[0]
            try:
                result[suite]
            except KeyError:
                result[suite] = ''
    return result


def find():
    """Возвращает словарь сьюит->путь до теста"""

    _suites = get_suites()
    start = os.path.abspath(args.search_dir)
    for root, _, dir_files in os.walk(start):
        for file in dir_files:
            if fnmatch(file, 'test*.py'):
                file_path = os.path.join(root, file)
                with open(file_path, encoding='utf-8') as f:
                    data = f.read()
                    for suite in _suites.keys():
                        if not _suites[suite] and 'class %s(' % suite in data:
                            _suites[suite] = os.path.relpath(file_path, start)
    return _suites

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('-cf', '--changed_files', type=str, required=True, help='Строка со списком измененых файлов')
    parser.add_argument('-sd', '--search_dir', type=str, required=True, help='Путь до папки с тестами в которой ищем изменения')
    args = parser.parse_args()
    print(' '.join(find().values()), end='')
