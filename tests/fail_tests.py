import sqlite3


def main():
    result = ''
    conn = sqlite3.connect('result.db')
    c = conn.cursor()
    output = c.execute('''SELECT name FROM sqlite_master WHERE type="table" AND name="FailTest" ''')
    if output.fetchone():
        tests = c.execute("SELECT * FROM FailTest")
        if tests.fetchone():
            result = 'true'
    conn.close()
    return result

if __name__ == '__main__':
    main()