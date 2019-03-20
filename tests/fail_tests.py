import sqlite3
import argparse
import os
import sys


def main(path_to_db):
    result = ''
    if os.path.exists(path_to_db):
        conn = sqlite3.connect(path_to_db)
        c = conn.cursor()
        output = c.execute('''SELECT name FROM sqlite_master WHERE type="table" AND name="FailTest" ''')
        if output.fetchone():
            tests = c.execute("SELECT * FROM FailTest")
            if tests.fetchone():
                result = 'true'
        conn.close()
    else:
        print('{} - файла result.db по указанному пути не существует'.format(path_to_db))
        sys.exit(1)
    print(result)

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('-f', '--filename', help='Path to result.db')
    arg = parser.parse_args()
    main(arg.filename)
