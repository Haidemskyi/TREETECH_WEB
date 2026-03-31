import mysql.connector
from mysql.connector import errorcode
import os

db_config = {
    'user': os.environ.get('DB_USER', 'treetech_user'),
    'password': os.environ.get('DB_PASSWORD', 'treetech_pass'),
    'host': os.environ.get('DB_HOST', 'db'),
    'database': os.environ.get('DB_NAME', 'treetech_db')
}

DB_NAME = os.environ.get('DB_NAME', 'treetech_db')

def create_database(cursor):
    try:
        cursor.execute(
            "CREATE DATABASE {} DEFAULT CHARACTER SET 'utf8'".format(DB_NAME))
    except mysql.connector.Error as err:
        print("Failed creating database: {}".format(err))
        exit(1)

try:
    print("Connecting to MySQL...")
    cnx = mysql.connector.connect(**db_config)
    cursor = cnx.cursor()

    try:
        cursor.execute("USE {}".format(DB_NAME))
        print(f"Database {DB_NAME} exists.")
    except mysql.connector.Error as err:
        print(f"Database {DB_NAME} does not exist.")
        if err.errno == errorcode.ER_BAD_DB_ERROR:
            create_database(cursor)
            print(f"Database {DB_NAME} created successfully.")
            cnx.database = DB_NAME
        else:
            print(err)
            exit(1)

    print("Executing schema...")
    with open('schema.sql', 'r') as f:
        schema = f.read()
        statements = schema.split(';')
        for statement in statements:
            if statement.strip():
                try:
                    cursor.execute(statement)
                except mysql.connector.Error as err:
                    print(f"Error executing statement: {err}")
    
    print("Database initialized successfully.")
    
    # Check if we should add a default admin
    cursor.execute("SELECT * FROM admins WHERE username = 'admin'")
    if not cursor.fetchone():
        print("Adding default admin user...")
        # In a real app, hash the password! For now, simple text as per quick setup
        # But wait, app.py uses simple check for now. Let's sync standard.
        # Actually app.py uses hardcoded check. 
        # let's just create the table structure as requested.
        pass

    cursor.close()
    cnx.close()

except mysql.connector.Error as err:
    if err.errno == errorcode.ER_ACCESS_DENIED_ERROR:
        print("Something is wrong with your user name or password")
    elif err.errno == errorcode.ER_BAD_DB_ERROR:
        print("Database does not exist")
    else:
        print(err)
else:
    print("Done.")
