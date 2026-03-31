
import mysql.connector
import os

db_config = {
    'user': os.environ.get('DB_USER', 'root'),
    'password': os.environ.get('DB_PASSWORD', ''),
    'host': os.environ.get('DB_HOST', 'localhost'),
    'database': os.environ.get('DB_NAME', 'treetech_db')
}

try:
    print(f"Connecting to {db_config['host']} with user {db_config['user']}...")
    conn = mysql.connector.connect(**db_config)
    cursor = conn.cursor()
    
    cursor.execute("SELECT COUNT(*) FROM candidates")
    count = cursor.fetchone()[0]
    print(f"Total candidates in table: {count}")
    
    if count > 0:
        cursor.execute("SELECT id, name, status FROM candidates LIMIT 5")
        rows = cursor.fetchall()
        print("First 5 candidates:")
        for row in rows:
            print(row)
            
    cursor.close()
    conn.close()

except mysql.connector.Error as err:
    print(f"Error: {err}")
