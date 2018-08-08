import sqlite3
conn = sqlite3.connect('result.db')
c = conn.cursor()
output = c.execute('''SELECT name FROM sqlite_master WHERE type="table" AND name="FailTest" ''')
result = '' if not output.fetchone() else c.execute("SELECT * FROM FailTest").fetchone()
conn.close()
print(result)
