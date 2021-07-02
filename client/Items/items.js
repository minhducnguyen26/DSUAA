var add_item_box   = document.querySelector("#add_item");
var view_item_box  = document.querySelector("#view_item");
var edit_item_box  = document.querySelector("#edit_item");
var copy_item_name = "";
var copy_item_id   = "";

function add_row_to_table(item) {
    var items_table = document.querySelector("#items_table");

    // Add new row at the end of the table
    var new_row = items_table.insertRow(-1);

    // There are 4 cells in a row
    var name_cell   = new_row.insertCell(0);
    var price_cell  = new_row.insertCell(1);
    var view_cell   = new_row.insertCell(2);
    var delete_cell = new_row.insertCell(3);

    // Assign value to each cell
    var name = document.createTextNode(item.name);
    name_cell.appendChild(name);

    var price = document.createTextNode(item.price);
    price_cell.appendChild(price);
    price_cell.classList.add("price_column");
    
    view_cell.innerHTML = '<i class="las la-edit"></i>';
    view_cell.classList.add("table_icons"); 
    view_item(view_cell, item);
    
    delete_cell.innerHTML = '<i class="las la-trash-alt"></i';
    delete_cell.classList.add("table_icons");
    delete_item(delete_cell, item)
}

function delete_all_rows() {
    var items_table = document.querySelector("#items_table");
    var row_count = items_table.rows.length;
    for (var i = row_count - 1; i > 0; i--) {
        items_table.deleteRow(i);
    }
}

/** 
function sort_table() {
    var table, rows, switching, i, x, y, should_switch;
    table = document.querySelector("#items_table");
    switching = true;
    //Make a loop that will continue until
    //no switching has been done:
    while (switching) {
      //start by saying: no switching is done:
      switching = false;
      rows = table.rows;
      //Loop through all table rows (except the
      //first, which contains table headers):
      for (i = 1; i < (rows.length - 1); i++) {
        //start by saying there should be no switching:
        should_switch = false;
        //Get the two elements you want to compare,
        //one from current row and one from the next:
        x = rows[i].getElementsByTagName("td")[0];
        y = rows[i + 1].getElementsByTagName("td")[0];
        //check if the two rows should switch place:
        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
          //if so, mark as a switch and break the loop:
          should_switch = true;
          break;
        }
      }
      if (should_switch) {
        //If a switch has been marked, make the switch
        //and mark that a switch has been done:
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        switching = true;
      }
    }
}
*/

function search_names() {
    var input  = document.querySelector("#input")
    var table  = document.querySelector("#items_table")
    var tr     = table.getElementsByTagName("tr");
    
    input.onclick = function() {
        input.onkeyup = function() {
            var filter, td, i, text_value;
            filter = input.value.toUpperCase();
            if (input.value != "") {
                // Loop through all table rows, and hide those who don't match the search query
                for (i = 0; i < tr.length; i++) {
                    td = tr[i].getElementsByTagName("td")[0];
                    if (td) {
                        text_value = td.textContent || td.innerText;
                        if (text_value.toUpperCase().indexOf(filter) > -1) {
                            tr[i].style.display = "";
                        } else {
                            table.deleteRow(i);
                        }
                    }
                }
            } else {
                list_all_items_from_server();
            }
        }
    }

    var mobile_nav_input  = document.querySelector("#mobile_nav_input")
    mobile_nav_input.onclick = function() {
        mobile_nav_input.onkeyup = function() {
            var filter, td, i, text_value;
            filter = mobile_nav_input.value.toUpperCase();
            if (mobile_nav_input.value != "") {
                // Loop through all table rows, and hide those who don't match the search query
                for (i = 0; i < tr.length; i++) {
                    td = tr[i].getElementsByTagName("td")[0];
                    if (td) {
                        text_value = td.textContent || td.innerText;
                        if (text_value.toUpperCase().indexOf(filter) > -1) {
                            tr[i].style.display = "";
                        } else {
                            table.deleteRow(i);
                        }
                    }
                }
            } else {
                list_all_items_from_server();
            }
        }
    }  
}

function add_item() {
    var add_item     = document.querySelector(".save_new_items");
    add_item.onclick = function() {
        var new_name     = document.querySelector("#new_name");
        var new_location = document.querySelector("#new_location");
        var new_price    = document.querySelector("#new_price");
        var new_image    = document.querySelector("#new_image");

        create_new_item_to_server(new_name.value, new_location.value, new_price.value, new_image.value);

        new_name.value = "";
        new_location.value = "";
        new_price.value = "";
        new_image.value = "";

        if (window.innerWidth <= 1400) { 
            var items_table = document.querySelector(".grid_item");
            var add_item = document.querySelector("#add_item");

            items_table.style.display = "block";
            add_item.style.display = "none";
        }
    }

    var items_table = document.querySelector(".grid_item");
    var add_item = document.querySelector("#add_item");

    var open_add_item = document.querySelector(".open_add_item");
    open_add_item.onclick = function() {
        items_table.style.display = "none";
        add_item.style.display = "block";
        view_item_box.style.display = "none";
    }
    
    if (window.innerWidth <= 1400) {
        var close_add_item = document.querySelector("#add_item_main");
        close_add_item.onclick = function() {
            add_item.style.display = "none";
            items_table.style.display = "block";
        } 
    }  
}

function view_item(view_button, item) {
    var view_name       = document.querySelector("#view_name");
    var view_location   = document.querySelector("#view_location");
    var view_price      = document.querySelector("#view_price");
    var view_image      = document.querySelector("#view_image");
    var show_item_image = document.querySelector(".image_in_view_item");

    view_button.onclick = function() {
        view_name.innerHTML     = item.name;
        view_location.innerHTML = item.location;
        view_price.innerHTML    = item.price;
        view_image.innerHTML    = item.image;
        
        if (window.innerWidth > 1400) { 
            add_item_box.style.display  = "none";
            view_item_box.style.display = "block";
            edit_item_box.style.display = "none";
        } else {
            var items_table = document.querySelector(".grid_item");
            items_table.style.display = "none";
            add_item_box.style.display  = "none";
            view_item_box.style.display = "block";
        }
        
        if (item.image.includes(".")) {
            if (window.innerWidth > 1400) { 
                show_item_image.innerHTML = '<img width="70%" height="auto" src="../images/' + item.image + '">';
                show_item_image.style.margin = "10% auto 6% auto";
            } else {
                show_item_image.innerHTML = '<img width="50%" height="auto" src="../images/' + item.image + '">';
                show_item_image.style.margin = "10% auto 4% auto";
            }
        } else {
            show_item_image.innerHTML = "Image input is invalid.";
            show_item_image.style.margin = "20% auto -10% auto";
        }

        retrieve_one_item_from_server(item);

        var open_edit_box = document.querySelector(".open_edit_box");
        edit_item(open_edit_box, item);
    }

    var view_item_main = document.querySelector("#view_item_main");
    view_item_main.onclick = function() {
        if (window.innerWidth > 1400) { 
            view_item_box.style.display = "none";
            add_item_box.style.display  = "block";
            edit_item_box.style.display = "none";
        } else {
            var items_table = document.querySelector(".grid_item");
            items_table.style.display = "block";
            view_item_box.style.display = "none";
        }
    }
}

function edit_item(edit_button, item) {
    edit_button.onclick = function() {
        add_item_box.style.display  = "none";
        view_item_box.style.display = "none";
        edit_item_box.style.display = "block";

        var edit_name_input     = document.querySelector("#edit_name_input");
        var edit_location_input = document.querySelector("#edit_location_input");
        var edit_price_input    = document.querySelector("#edit_price_input");
        var edit_image_input    = document.querySelector("#edit_image_input");
        var show_item_image     = document.querySelector(".image_in_edit_item");

        edit_name_input.value     = item.name;
        edit_location_input.value = item.location;
        edit_price_input.value    = item.price;
        edit_image_input.value    = item.image;
       
        if (item.image.includes(".")) {
            if (window.innerWidth > 1400) {
                show_item_image.innerHTML = '<img width="70%" height="auto" src="../images/' + item.image + '">';
            } else {
                show_item_image.innerHTML = '<img width="50%" height="auto" src="../images/' + item.image + '">';
            }
        } else {
            show_item_image.innerHTML = "";
        }

        copy_item_id = item.id;
        var save_new_edit = document.querySelector(".save_new_edit");
        save_new_edit.onclick = function() {
            edited_name     = edit_name_input.value;
            edited_location = edit_location_input.value;
            edited_price    = edit_price_input.value;
            edited_image    = edit_image_input.value;
            update_item(edited_name, edited_location, edited_price, edited_image, copy_item_id);

            if (window.innerWidth <= 1400) {
                edit_item_box.style.display = "none";
                add_item_box.style.display  = "none"; 

                var items_table = document.querySelector(".grid_item");
                items_table.style.display   = "block"; 
            }
        }
    }
    
    var edit_item_main = document.querySelector("#edit_item_main");
    edit_item_main.onclick = function() {
        if (window.innerWidth > 1400) {
            edit_item_box.style.display = "none";
            view_item_box.style.display = "none";
            add_item_box.style.display  = "block";
        } else {
            edit_item_box.style.display = "none";
            view_item_box.style.display = "none";
            add_item_box.style.display  = "none";
            
            var items_table = document.querySelector(".grid_item");
            items_table.style.display   = "block";  
        }
    }
}

function update_item(edited_name, edited_location, edited_price, edited_image, copy_item_id) {
    update_item_changes_to_server(edited_name, edited_location, edited_price, edited_image, copy_item_id);
    add_item_box.style.display  = "block";
    view_item_box.style.display = "none";
    edit_item_box.style.display = "none";
}

function delete_item(delete_button, item) {
    var modal = document.querySelector("#confirmation");
    var pre_confirmation  = document.querySelector(".pre_confirmation");
    var post_confirmation = document.querySelector(".post_confirmation");
    
    delete_button.onclick = function() {
        modal.style.display = "block";

        var confirmation_name = document.querySelector(".confirmation_name");
        confirmation_name.innerHTML = item.name;

        copy_item_name = item.name;
        if (window.innerWidth <= 1400) { 
            var modal_content = document.querySelector(".modal_content");
            modal_content.style.height = "40%";
        }

        var confirm_yes = document.querySelector(".confirm_yes")
        confirm_yes.onclick = function() {
            pre_confirmation.style.display  = "none";
            post_confirmation.style.display = "block";

            var post_confirmation_name = document.querySelector(".post_confirmation_name");
            post_confirmation_name.innerHTML = copy_item_name;

            delete_one_item_from_server(item.id);

            if (window.innerWidth > 1400) { 
                add_item_box.style.display  = "block";
                view_item_box.style.display = "none";
                edit_item_box.style.display = "none";
            } else {
                add_item_box.style.display  = "none";
                view_item_box.style.display = "none";
                edit_item_box.style.display = "none";
            }
        }

        var confirm_no  = document.querySelector(".confirm_no")
        confirm_no.onclick = function() {
            modal.style.display = "none";
        }
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

function list_all_items_from_server() {
    add_item();

    fetch("https://dsuaa.herokuapp.com/items").then(function(response) {
        // Decode JSON data from the response
        response.json().then(function(data) {
            delete_all_rows();

            // save and/or use data
            // data is an array of pies (array of strings)
            MY_ITEMS = data;
            
            data.forEach(function(item) {
                add_row_to_table(item);
                //sort_table();
                search_names();
            })
        });
    }); 
}

function retrieve_one_item_from_server(item) {
    fetch("https://dsuaa.herokuapp.com/items/" + item.id, {
        method:"GET"
    })
}

function create_new_item_to_server(name, location, price, image) {
    var data = "name="   + encodeURIComponent(name);
    data += "&location=" + encodeURIComponent(location);
    data += "&price="    + encodeURIComponent(price);
    data += "&image="    + encodeURIComponent(image);

    fetch("https://dsuaa.herokuapp.com/items",{
        method:"POST",
        headers:{
            "Content-Type":"application/x-www-form-urlencoded"
        },
        body: data
    }).then(function(response) {
        list_all_items_from_server();
    });
}

function update_item_changes_to_server(name, location, price, image, item_id) {
    var data = "name="   + encodeURIComponent(name);
    data += "&location=" + encodeURIComponent(location);
    data += "&price="    + encodeURIComponent(price);
    data += "&image="    + encodeURIComponent(image);

    fetch("https://dsuaa.herokuapp.com/items/" + item_id,{
        method:"PUT",
        headers:{
            "Content-Type":"application/x-www-form-urlencoded"
        },
        body: data
    }).then(function(response) {
        list_all_items_from_server();
    });
}

function delete_one_item_from_server(item_id) {
    fetch("https://dsuaa.herokuapp.com/items/" + item_id, {
        method:"DELETE"
    }).then(function(response) {
        list_all_items_from_server();
    });
}

list_all_items_from_server();