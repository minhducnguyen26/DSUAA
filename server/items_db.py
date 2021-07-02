import os
import psycopg2
import psycopg2.extras
import urllib.parse

'''
import sqlite3
def dict_factory(cursor, row):
    d = {}
    for idx, col in enumerate(cursor.description):
        d[col[0]] = row[idx]
    return d
'''

class ItemsDB:
    def __init__(self):
        # self.connection = sqlite3.connect("items.db")
        # self.connection.row_factory = dict_factory

        urllib.parse.uses_netloc.append("postgres")
        url = urllib.parse.urlparse(os.environ["DATABASE_URL"])

        self.connection = psycopg2.connect(
            cursor_factory=psycopg2.extras.RealDictCursor,
            database=url.path[1:],
            user=url.username,
            password=url.password,
            host=url.hostname,
            port=url.port
        )

        self.cursor = self.connection.cursor()

    def __del__(self):
        self.connection.close()

    def create_items_table(self):
        self.cursor.execute("CREATE TABLE IF NOT EXISTS items (id SERIAL PRIMARY KEY, name TEXT, location TEXT, price TEXT, image TEXT)")
        self.connection.commit()
    
    # Create a cart table to be used in the "cart_db.py" file
    def create_cart_table(self):
        self.cursor.execute("CREATE TABLE IF NOT EXISTS cart (id SERIAL PRIMARY KEY, image TEXT, name TEXT, price TEXT, quantity TEXT, location TEXT, checked TEXT)")
        self.connection.commit()

    def get_all_items(self):
        # READ from the table
        self.cursor.execute("SELECT * FROM items ORDER BY name")
        items = self.cursor.fetchall()
        return items

    def get_one_item(self, item_id):
        data = [item_id]
        self.cursor.execute("SELECT * FROM items WHERE id = %s", data)
        item = self.cursor.fetchone()
        return item
    
    # INSERT into the table
    def add_item(self, name, location, price, image):
        data = [name, location, price, image]
        self.cursor.execute("INSERT INTO items (name, location, price, image) VALUES (%s, %s, %s, %s)", data)
        self.connection.commit() 
        
    def edit_item(self, name, location, price, image, item_id):
        data = [name, location, price, image, item_id]
        self.cursor.execute("UPDATE items SET name = %s, location = %s, price = %s, image = %s WHERE id = %s", data)
        self.connection.commit() 

    def delete_item(self, item_id):
        data = [item_id]
        self.cursor.execute("DELETE FROM items WHERE id = %s", data)
        self.connection.commit()