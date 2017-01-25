import subprocess as sp
import argparse
import os


def main(args):
    node = sp.Popen(args.node, shell=True, stdout=sp.PIPE, stderr=sp.PIPE, cwd=args.node_path)
    int = sp.Popen(args.int, shell=True, stdout=sp.PIPE, stderr=sp.PIPE, cwd=args.int_path)
    if node.returncode is None:
        node.wait()
    if int.returncode is None:
        int.wait()
        print(node.returncode, int.returncode)
    else:
        print(node.returncode, int.returncode)

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="Задание параметров тестов", add_help=False)
    parser.add_argument("--node", type=str, help="строка запуска node для тестов по веткам")
    parser.add_argument("--node_path", type=str, help="директория из которой запускаем тесты верстки")
    parser.add_argument("--int", type=str, help="строка запуска интеграционных тестов")
    parser.add_argument("--int_path", type=str, help="директория из которой запускаем интеграционные")
    main(parser.parse_args())
