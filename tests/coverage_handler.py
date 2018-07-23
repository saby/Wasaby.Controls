import os
import json
from pprint import pprint
import argparse


class Coverage:

    path_result = {}
    result = {}

    def build(self, path):
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

        ts = tf = 1

        for item in self.path_result:
            coverage_result = []
            print(ts,'ТЕСТ:', item)
            ts +=1
            for fname in self.path_result[item]:
                with open(fname, encoding='utf-8', mode='r') as f:
                    d = json.loads(f.read(), encoding='utf-8')
                    print(tf, 'Filename: ', fname)
                    tf+=1
                    for k in d:
                        coverage_result.append(k)
            uresult = sorted(set(coverage_result))
            self.result[item] = uresult

        pprint(self.path_result)
        name = 'result.json'
        mode = 'a+'
        if os.path.exists(name) :
            mode = 'r+'

        with open(os.path.join(path, 'result.json'), mode=mode, encoding='utf-8') as f:
            f.seek(0)
            f.write(json.dumps(self.result, indent=2))
            f.truncate()


class Test:
    result_name = 'result.json'
    result = []
    all_files = []

    def search(self, change_files):
        with open(self.result_name, encoding='utf-8') as f:
            data = json.loads(f.read(), encoding='utf-8')
            for name in data:
                self.all_files.append(name)
                for source in data[name]:
                    for file in change_files:
                        if file in source:
                            self.result.append(name)


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
        print(' '.join(set(test.result)))

