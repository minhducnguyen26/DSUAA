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

class CartDB:
    def __init__(self):
        #self.connection = sqlite3.connect("cart.db")
        #self.connection.row_factory = dict_factory
        
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

    def get_all_items_in_cart(self):
        # READ from the table
        self.cursor.execute("SELECT * FROM cart ORDER BY location, name")
        cart = self.cursor.fetchall()
        return cart

    def get_one_item_in_cart(self, item_id):
        data = [item_id]
        self.cursor.execute("SELECT * FROM cart WHERE id = %s", data)
        item = self.cursor.fetchone()
        return item

    # INSERT into the table
    def add_item_to_cart(self, image, name, price, quantity, location):
        data = [image, name, price, quantity, location, "false"]
        self.cursor.execute("INSERT INTO cart (image, name, price, quantity, location, checked) VALUES (%s, %s, %s, %s, %s, %s)", data)
        self.connection.commit() 
    
    def update_item_checked_status(self, item_id, checked_status):
        data = [checked_status, item_id]
        self.cursor.execute("UPDATE cart SET checked = %s WHERE id = %s", data)
        self.connection.commit() 

    def delete_all_items_in_cart(self):
        items_in_cart = self.get_all_items_in_cart()
        if items_in_cart:
            self.cursor.execute("DELETE FROM cart")
            self.connection.commit()
        else:
            return

    def delete_one_item_in_cart(self, item_id):
            data = [item_id]
            self.cursor.execute("DELETE FROM cart WHERE id = %s", data)
            self.connection.commit()