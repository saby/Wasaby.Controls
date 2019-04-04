import os
import sys
from fnmatch import fnmatch


def get_suites():

    result = {}
    for name in sys.argv[1].split(' '):
        if name.endswith('chrome_1920_1080.png'):
            suite = name.split('/capture/')[1].split('/')[0]
            try:
                result[suite]
            except KeyError:
                result[suite] = ''
    return result


def find():

    _suites = get_suites()
    start = os.path.join(os.getcwd(), 'reg', sys.argv[2])
    for root, _, dir_files in os.walk(start):
        for file in dir_files:
            if fnmatch(file, 'test*.py'):
                file_path = os.path.join(root, file)
                with open(file_path, encoding='utf-8') as f:
                    data = f.read()
                    for suite in _suites.keys():
                        if not _suites[suite] and suite in data:
                            _suites[suite] = os.path.relpath(file_path, start)
    return _suites

if __name__ == '__main__':

    print(' '.join(find().values()))
