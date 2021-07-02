function show_item_in_cart(item) {
    var item_id        = item.id; 
    var item_image     = item.image;
    var item_name      = item.name;
    var item_location  = item.location;
    var item_quantity  = item.quantity;
    var checked_status = item.checked;

    if (typeof item.quantity == "undefined") {
        item_quantity = 1;
    }

    var cart_items = document.querySelector(".cart_items");

    var cart_item_names = cart_items.getElementsByClassName("cart_item_title")
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
    <div class="cart_location cart_column">
        <span class="location_info">${item_location}</span>
    </div>
    <div class="cart_quantity cart_column">
        <input class="cart_quantity_input" value="${item_quantity}">
        <label class="checkbox">
            <input class="checked" type="checkbox">
        </label>
        <span class="delete_one_item">
            <i class="las la-trash-alt"></i>
        </span>
    </div>`
        
    cart_row.innerHTML = cart_row_contents;
    cart_items.append(cart_row);

    var checkbox = cart_row.getElementsByClassName("checked")[0];
    var checked_name = cart_row.getElementsByClassName("cart_item_title")[0];
    var checked_location = cart_row.getElementsByClassName("location_info")[0];
    var checked_quantity = cart_row.getElementsByClassName("cart_quantity_input")[0];

    var item_infos = [checked_name, checked_location, checked_quantity];
    checkbox_action(checkbox, item_infos, item_id);

    if (checked_status == "true") {
        for (var i = 0; i < item_infos.length; i++) {
            item_infos[i].style.textDecoration = "line-through";
            item_infos[i].style.background = "lightgrey";
            checkbox.checked = true;
        }
    } else {
        for (var i = 0; i < item_infos.length; i++) {
            item_infos[i].style.textDecoration = "none";
            item_infos[i].style.background = "";
            checkbox.checked = false;
        }
    }

    var delete_one_item_button = cart_row.getElementsByClassName("delete_one_item")[0];
    delete_one_item_button.onclick = function(){
        delete_items(delete_one_item_button, item);
    }

    var delete_all_items_button = document.querySelector(".delete_all_items");
    delete_all_items_button.onclick = function() {
        delete_items(delete_all_items_button, item);
    }
}

function checkbox_action(checkbox, item_infos, item_id) {
    checkbox.onclick = function() {
        for (var i = 0; i < item_infos.length; i++) {
            if(item_infos[i].style.textDecoration == "line-through") {
                item_infos[i].style.textDecoration = "none";
                item_infos[i].style.background = "";

                var new_checked_status = "false";
                update_item_status(item_id, new_checked_status);
            } else {    
                item_infos[i].style.textDecoration = "line-through";
                item_infos[i].style.background = "lightgrey";

                var new_checked_status = "true";
                update_item_status(item_id, new_checked_status);
            }
        }
    }
}

function delete_items(delete_button, item) {
    var modal = document.querySelector("#delete_items_confirmation");
    var pre_confirmation  = document.querySelector(".pre_confirmation");
    var post_confirmation = document.querySelector(".post_confirmation");

    modal.style.display = "block";

    var confirmation_text = document.querySelector(".confirmation_text");
    var confirmation_name = document.querySelector(".confirmation_name");
    var post_confirmation_text = document.querySelector(".post_confirmation_text");
    
    if (delete_button.innerHTML == "Delete All Items") {
        confirmation_text.innerHTML      = "Do you want to delete all items in the cart?";
        confirmation_name.innerHTML = "";
        post_confirmation_text.innerHTML = "Your cart is empty."
    } else {
        confirmation_text.innerHTML = "Do you want to delete this item?";
        confirmation_name.innerHTML = item.name;
        post_confirmation_text.innerHTML = item.name + " is deleted."
    }

    if (window.innerWidth <= 1400) { 
        var modal_content = document.querySelector(".modal_content");
        modal_content.style.height = "40%";
    }

    var confirm_yes = document.querySelector(".confirm_yes")
    confirm_yes.onclick = function() {
        pre_confirmation.style.display  = "none";
        post_confirmation.style.display = "block";

        if (delete_button.innerHTML == "Delete All Items") {
            delete_all_items_from_server();
        } else {
            delete_one_item_from_server(item.id);
        }
    }

    var confirm_no  = document.querySelector(".confirm_no")
    confirm_no.onclick = function() {
        modal.style.display = "none";
    }

    var close_button = document.querySelector(".close")
    close_button. onclick = function() {
        modal.style.display = "none";
        pre_confirmation.style.display  = "block";
        post_confirmation.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
            pre_confirmation.style.display  = "block";
            post_confirmation.style.display = "none";
        }
    }
}

function list_all_items_in_cart() {
    fetch("https://dsuaa.herokuapp.com/cart").then(function(response) {
        response.json().then(function(data) {
            var cart_items = document.querySelector(".cart_items");
            cart_items.innerHTML = "";

            MY_ITEMS = data;
            data.forEach(function(item) {
                show_item_in_cart(item);
            })
        });
    }); 
}

function update_item_status(item_id, new_checked_status) {
    var data = "checked=" + encodeURIComponent(new_checked_status);

    fetch("https://dsuaa.herokuapp.com/cart/" + item_id,{
        method:"PUT",
        headers:{
            "Content-Type":"application/x-www-form-urlencoded"
        },
        body: data
    });
}

function delete_all_items_from_server() {
    fetch("https://dsuaa.herokuapp.com/cart", {
        method:"DELETE"
    }).then(function(response) {
        list_all_items_in_cart();
    });
}

function delete_one_item_from_server(item_id) {
    fetch("https://dsuaa.herokuapp.com/cart/" + item_id, {
        method:"DELETE"
    }).then(function(response) {
        list_all_items_in_cart();
    });
}

list_all_items_in_cart();