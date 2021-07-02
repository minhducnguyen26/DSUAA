if (document.readyState == "loading") {
    document.addEventListener("DOMContentLoaded", ready)
}
else{
   ready() 
}

function ready() {
    var items_menu = document.querySelector("#items_menu");
    var open_cart = document.querySelector("#open_cart");
    var main_cart = document.querySelector("#main_cart");

    open_cart.onclick = function() {
        items_menu.style.display = "none";
        main_cart.style.display = "block";
    }

    var close_cart_button = document.querySelector(".close_cart_button");
    close_cart_button.onclick = function() {
        items_menu.style.display = "block";
        main_cart.style.display = "none";
    }

    var remove_buttons = document.getElementsByClassName("remove_button");
    for (var i = 0; i < remove_buttons.length; i++) {
        var button = remove_buttons[i];       
        button.addEventListener("click", remove_cart_item);
    }

    var quantity_inputs = document.getElementsByClassName("cart_quantity_input");
    for (var i = 0; i < quantity_inputs.length; i++) {
        var input = quantity_inputs[i];
        input.addEventListener("change", quantity_changed);
    }

    list_all_items_from_server();
    list_all_items_in_cart();
}

' ITEMS TO SELECT '

function add_column_to_row(item) {
    var column = document.createElement("div");
    column.classList.add("column");
    
    var item_image = document.createElement("div");
    item_image.innerHTML = '<img src="../images/' + item.image + '">'; 
    item_image.classList.add("item_image")
    column.appendChild(item_image);
    
    var item_name = document.createElement("div");
    item_name.innerHTML = item.name;
    item_name.classList.add("item_name");
    column.appendChild(item_name);

    add_item_to_cart(column, item);

    var row = document.querySelector(".row");
    row.appendChild(column);
}

function add_item_to_cart(column, item) {
    column.onclick = function() {
        var items_in_cart_list = [];
        var cart_items = document.querySelector(".cart_items");
        var cart_item_names = cart_items.getElementsByClassName("cart_item_title");
        for (var i = 0; i < cart_item_names.length; i++) {
           items_in_cart_list.push(cart_item_names[i].innerHTML);
        }

        if (!items_in_cart_list.includes(item.name)) {
            show_item_in_cart(item);
            add_numbers_of_item_in_cart();
        }
    }
}

function search_item() {
    var input  = document.querySelector("#input");
    var row    = document.querySelector(".row");
    var column = row.getElementsByClassName("column");

    input.onclick = function() {
        input.onkeyup = function() {
            var filter, item, i, text_value;
            filter = input.value.toUpperCase();
            for (i = 0; i < column.length; i++) {
                item = column[i].getElementsByClassName("item_name")[0];
                if (item) {
                    text_value = item.textContent || item.innerText;
                    if (text_value.toUpperCase().indexOf(filter) > -1) {
                        column[i].style.display = "";
                    } else {
                        column[i].style.display = "none";
                    }
                }
            }
        }            
    }
}

function list_all_items_from_server() {
    fetch("https://dsuaa.herokuapp.com/items").then(function(response) {
        // Decode JSON data from the response
        response.json().then(function(data) {

            // save and/or use data
            // data is an array of pies (array of strings)
            MY_ITEMS = data;
            
            data.forEach(function(item) {
                add_column_to_row(item);
                search_item();
            })
        });
    }); 
}

function retrieve_one_item_from_server(item) {
    fetch("https://dsuaa.herokuapp.com/items/" + item.id, {
        method:"GET"
    })
}

' ITEMS IN CART '

function show_item_in_cart(item) {
    var item_image    = item.image;
    var item_name     = item.name;
    var item_price    = item.price;
    var item_quantity = item.quantity;
    var item_location = item.location;

    if (typeof item.quantity == "undefined") {
        item_quantity = 1;
    }

    var cart_items = document.querySelector(".cart_items");

    var cart_item_names = cart_items.getElementsByClassName("cart_item_title");
    for (var i = 0; i < cart_item_names.length; i++) {
        if(cart_item_names[i].innerText == item_name) {
            return
        }
    }
        
    var cart_row = document.createElement("div");
    cart_row.classList.add("cart_row");

    var cart_row_contents = `
        <div class="cart_item cart_column">
        <img class="cart_item_image" src="../images/${item_image}" width="100">
        <span class="cart_item_title">${item_name}</span>
    </div>
    <span class="cart_price price_value cart_column">${item_price}</span>
    <div class="cart_quantity cart_column">
        <input class="cart_quantity_input" type="number" value="${item_quantity}">
        <button class="remove_button" type="button">REMOVE</button>
    </div>
    <span class="cart_item_location" style="display:none">${item_location}</span>`
        
    cart_row.innerHTML = cart_row_contents;
    cart_items.append(cart_row);

    update_cart_total();

    cart_row.getElementsByClassName("remove_button")[0].addEventListener("click", remove_cart_item);
    cart_row.getElementsByClassName("cart_quantity_input")[0].addEventListener("change", quantity_changed);
}

function remove_cart_item(event) {
    var button_clicked = event.target;
    button_clicked.parentElement.parentElement.remove();
    substract_numbers_of_item_in_cart();
    update_cart_total();
}

function quantity_changed(event) {
    var input = event.target;
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1;
    }
    update_cart_total();
}

function update_cart_total() {
    var cart_items_container = document.getElementsByClassName("cart_items")[0];
    var cart_rows = cart_items_container.getElementsByClassName("cart_row");
    var total = 0;

    for (var i = 0; i < cart_rows.length; i++) {
        var cart_row = cart_rows[i];
        var price_element = cart_row.getElementsByClassName("cart_price")[0];
        var quantity_element = cart_row.getElementsByClassName("cart_quantity_input")[0];
    
        var price = parseFloat(price_element.innerText.replace("$", ""));
        var quantity = quantity_element.value;

        total = total + (price * quantity);
    }

    total = ((total * 100)/ 100).toFixed(2);
    document.getElementsByClassName("total_price")[0].innerText = "$" + total;

    update_cart_items();
}

function update_cart_items() {
    var save_cart_button = document.querySelector(".save_cart_button");
    save_cart_button.onclick = function() {
        delete_all_cart_items_from_server();
    }
}

function show_numbers_of_item_in_cart(data) {
    var items_counter = document.querySelector(".items_counter");
    items_counter.innerHTML = data.length;
}

function add_numbers_of_item_in_cart() {
    var items_counter = document.querySelector(".items_counter");
    var new_item_added_counter = parseInt(items_counter.innerHTML) + 1;
    items_counter.innerHTML = new_item_added_counter; 
}

function substract_numbers_of_item_in_cart() {
    var items_counter = document.querySelector(".items_counter");
    var new_item_added_counter = parseInt(items_counter.innerHTML) - 1;
    items_counter.innerHTML = new_item_added_counter; 
}

' METHODS '

// GET
function list_all_items_in_cart() {
    fetch("https://dsuaa.herokuapp.com/cart").then(function(response) {
        response.json().then(function(data) {
            MY_ITEMS = data;
            show_numbers_of_item_in_cart(data);
            
            data.forEach(function(item) {
                show_item_in_cart(item);
                update_cart_items();
            })
        });
    }); 
}

// DELETE
function delete_all_cart_items_from_server() {
    fetch("https://dsuaa.herokuapp.com/cart", {
        method:"DELETE"
    }).then(function(response) {
        var cart_items_container = document.getElementsByClassName("cart_items")[0];
        var cart_rows = cart_items_container.getElementsByClassName("cart_row");

        for (var i = 0; i < cart_rows.length; i++) {
            var cart_row = cart_rows[i];
            var price_element = cart_row.getElementsByClassName("cart_price")[0];
            var quantity_element = cart_row.getElementsByClassName("cart_quantity_input")[0];

            var image = cart_row.getElementsByClassName("cart_item_image")[0].getAttribute('src').replace('../images/','');
            var name = cart_row.getElementsByClassName("cart_item_title")[0].innerHTML;
            var price = parseFloat(price_element.innerText.replace("$", ""));
            var quantity = quantity_element.value;
            var location = cart_row.getElementsByClassName("cart_item_location")[0].innerHTML;
            
            save_new_cart_item_to_server(image, name, price, quantity, location);
        }
    });
}

// POST
function save_new_cart_item_to_server(image, name, price, quantity, location) {
    var data = "image="  + encodeURIComponent(image);
    data += "&name="     + encodeURIComponent(name);
    data += "&price="    + encodeURIComponent(price);
    data += "&quantity=" + encodeURIComponent(quantity);
    data += "&location=" + encodeURIComponent(location);

    fetch("https://dsuaa.herokuapp.com/cart",{
        method:"POST",
        headers:{
            "Content-Type":"application/x-www-form-urlencoded"
        },
        body: data
    });
}