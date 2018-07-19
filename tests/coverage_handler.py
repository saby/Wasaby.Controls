import os
import json
from pprint import pprint


path = os.getcwd()

path_result = {}
test_path = os.listdir(path)
result = {}
for tdir in test_path:
    path_list = []
    root = os.path.join(path, tdir)
    for top, d, f in os.walk(root):
        for i in d:
            file_path = os.path.join(top, i)
            file_name = os.path.join(file_path, 'coverage.json')
            if os.path.exists(file_name):
                path_list.append(file_name)
    path_result[tdir] = path_list

coverage_result = []
ts = tf = 1

for item in path_result:
    coverage_result = []
    print(ts,'ТЕСТ:', item)
    ts +=1
    for fname in path_result[item]:
        with open(fname, encoding='utf-8', mode='r') as f:
            d = json.loads(f.read(), encoding='utf-8')
            print(tf, 'Filename: ', fname)
            tf+=1
            for k in d:
                coverage_result.append(k)
    uresult = sorted(set(coverage_result))
    result[item] = uresult

pprint(path_result)
name = 'result.json'
mode = 'a+'
if os.path.exists(name) :
    mode = 'r+'

with open('result.json', mode=mode, encoding='utf-8') as f:
    f.seek(0)
    f.write(json.dumps(result, indent=2))
    f.truncate()