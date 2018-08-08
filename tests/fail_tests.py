import sqlite3
result = ''
conn = sqlite3.connect('result.db')
c = conn.cursor()
output = c.execute('''SELECT name FROM sqlite_master WHERE type="table" AND name="FailTest" ''')
if output.fetchone():
    result = c.execute("SELECT * FROM FailTest").fetchone()
conn.close()
print(result)
