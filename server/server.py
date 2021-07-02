from http.server import BaseHTTPRequestHandler, HTTPServer
import sys
from urllib.parse import parse_qs
import json
from items_db import ItemsDB
from cart_db import CartDB

class MyRequestHandler(BaseHTTPRequestHandler):

    def handleNotFound(self):
        self.send_response(404)
        self.send_header("Content-Type", "text/plain")
        self.end_headers()
        self.wfile.write(bytes("SERVER NOT FOUND.", "utf-8"))
        
    '''ITEMS.DB'''
    def handle_list_items(self):
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()

        # send data to the client via the response body
        db = ItemsDB()
        allRecords = db.get_all_items()
        self.wfile.write(bytes(json.dumps(allRecords), "utf-8"))

    def handle_retrieve_item(self, item_id):
        db = ItemsDB()
        item_record = db.get_one_item(item_id)

        if item_record != None:
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(bytes(json.dumps(item_record), "utf-8"))
        else:
            self.handleNotFound()

    def handle_add_item(self):
        # step 1: determine the number of bytes to read from the request body
        length = int(self.headers["Content-Length"])

        # step 2: use the length, read the raw request body
        request_body = self.rfile.read(length).decode("utf-8")

        # step 3: parse the urlencoded data
        parse_body = parse_qs(request_body)

        # step 4: access and store the data
        name      = parse_body["name"][0]
        location  = parse_body["location"][0]
        price     = parse_body["price"][0]
        image     = parse_body["image"][0]

        # save data to the "database"
        db = ItemsDB()
        db.add_item(name, location, price, image)

        # respond to the client when done; no response body needed
        self.send_response(201)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()

    def handle_update_item(self, item_id):
        length = int(self.headers["Content-Length"])

        # step 2: use the length, read the raw request body
        request_body = self.rfile.read(length).decode("utf-8")

        # step 3: parse the urlencoded data
        parse_body = parse_qs(request_body)

        # step 4: access and store the data
        name      = parse_body["name"][0]
        location  = parse_body["location"][0]
        price     = parse_body["price"][0]
        image     = parse_body["image"][0]

        # update changes to the "database"
        db = ItemsDB()
        item_record = db.get_one_item(item_id)

        if item_record != None:
            db.edit_item(name, location, price, image, item_id)
            self.send_response(200)
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
        else:
            self.handleNotFound()

    def handle_delete_item(self, item_id):
        db = ItemsDB()
        item_record = db.get_one_item(item_id)

        if item_record != None:
            # DELETE the file here!
            db.delete_item(item_id)
            self.send_response(200)
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
        else:
            self.handleNotFound()

    '''CART.DB'''
    def handle_list_items_in_cart(self):
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()

        # send data to the client via the response body
        db = CartDB()
        allRecords = db.get_all_items_in_cart()
        self.wfile.write(bytes(json.dumps(allRecords), "utf-8"))

    def handle_get_one_item_in_cart(self, item_id):
        db = CartDB()
        item_record = db.get_one_item_in_cart(item_id)

        if item_record != None:
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(bytes(json.dumps(item_record), "utf-8"))
        else:
            self.handleNotFound()

    def handle_save_cart_items(self):
        # step 1: determine the number of bytes to read from the request body
        length = int(self.headers["Content-Length"])

        # step 2: use the length, read the raw request body
        request_body = self.rfile.read(length).decode("utf-8")

        # step 3: parse the urlencoded data
        parse_body = parse_qs(request_body)

        # step 4: access and store the data
        image    = parse_body["image"][0]
        name     = parse_body["name"][0]
        price    = parse_body["price"][0]
        quantity = parse_body["quantity"][0]
        location = parse_body["location"][0]

        # save data to the "database"
        db = CartDB()
        db.add_item_to_cart(image, name, price, quantity, location)

        # respond to the client when done; no response body needed
        self.send_response(201)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()

    def handle_update_item_checked_status(self, item_id):
        length = int(self.headers["Content-Length"])

        # step 2: use the length, read the raw request body
        request_body = self.rfile.read(length).decode("utf-8")

        # step 3: parse the urlencoded data
        parse_body = parse_qs(request_body)

        # step 4: access and store the data
        checked_status = parse_body["checked"][0]

        # update changes to the "database"
        db = CartDB()
        item_record = db.get_one_item_in_cart(item_id)

        if item_record != None:
            db.update_item_checked_status(item_id, checked_status)
            self.send_response(200)
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
        else:
            self.handleNotFound()

    def handle_delete_all_cart_items(self):
        db = CartDB()
        item_record = db.get_all_items_in_cart()

        if item_record != None:
            db.delete_all_items_in_cart()
            self.send_response(200)
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
        else:
            self.handleNotFound()

    def handle_delete_one_cart_item(self, item_id):
        db = CartDB()
        item_record = db.get_one_item_in_cart(item_id)

        if item_record != None:
            # DELETE the file here!
            db.delete_one_item_in_cart(item_id)
            self.send_response(200)
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
        else:
            self.handleNotFound()

    '''METHODS'''
    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_GET(self):
        # this is an incoming GET request
        path_parts = self.path.split("/")
        collection = path_parts[1]
        if len(path_parts) > 2:
            member_id = path_parts[2]
        else: 
            member_id = None

        if collection == "items":
            if member_id:
                self.handle_retrieve_item(member_id)
            else:
                self.handle_list_items()
        elif collection == "cart":
            if member_id:
                self.handle_get_one_item_in_cart(member_id)
            else:
                self.handle_list_items_in_cart()
        else:
            self.handleNotFound()

    def do_POST(self):
        if self.path == "/items":
            self.handle_add_item()
        elif self.path == "/cart":
            self.handle_save_cart_items()
        else:
            self.handleNotFound()

    def do_PUT(self):
        path_parts = self.path.split("/")
        collection = path_parts[1]
        if len(path_parts) > 2:
            member_id = path_parts[2]
        else: 
            member_id = None

        if collection == "items":
            if member_id:
                self.handle_update_item(member_id)
            else:
                self.handleNotFound()
        elif collection == "cart":
            if member_id:
                self.handle_update_item_checked_status(member_id)
            else:
                self.handleNotFound()
        else:
            self.handleNotFound()

    def do_DELETE(self):
        path_parts = self.path.split("/")
        collection = path_parts[1]
        if len(path_parts) > 2:
            member_id = path_parts[2]
        else: 
            member_id = None

        if collection == "items":
            if member_id:
                self.handle_delete_item(member_id)
            else:
                self.handleNotFound()
        elif collection == "cart":  
            if member_id:
                self.handle_delete_one_cart_item(member_id) 
            else:
                self.handle_delete_all_cart_items()
        else:
            self.handleNotFound()

# main function
def run():
    db = ItemsDB()

    # create any DB tables if they don't already exist,
    # and then disconect from the DB
    db.create_items_table()
    db.create_cart_table()
    db = None

    port = 8080
    if len(sys.argv) > 1:
        port = int(sys.argv[1])

    listen = ("0.0.0.0", port)
    server = HTTPServer(listen, MyRequestHandler)
    print("The server is running.")
    server.serve_forever()

run()