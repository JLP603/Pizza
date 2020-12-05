// gets the position of "e" in the array "eArray", returns -1 if not in array
function getPosition(eArray, e) {
  for (var i = 0; i < eArray.length; i++)
    if (eArray[i] == e)
      return i;

  return -1;
}

/* verifies input fields for rows with ticked checkbox, returns status
  0 - valid inputs
  1 - negative value
  2 - empty fields
  3 - total quantity 0 or 0 values
*/
function selectedValid(checkBoxes, quantities) {
  var totalQty = 0;

  for (var i = 0; i < checkBoxes.length; i++) {
    if ($(checkBoxes[i]).is(":checked")) {
      if (quantities.eq(i).val() < 0) {
        return 1;
      } else if (quantities.eq(i).val() == "") {
        return 2;
      } else if (quantities.eq(i).val() == 0) {
        return 3;
      } else {
        totalQty += quantities.eq(i).val();
      }
    }            
  }

  return 0;
}

// updates the subtotal
function updateSubtotal() {
  var total = 0.0;
  for (var i = 0; i < $(".toggle").length; i++) {
    if($(".toggle").eq(i).is(":checked")) {
      var price = $(".price").eq(i).html();
      price = price.substring(4, price.length);
      price = parseFloat(price)
      
      var qty = $(".quantity").eq(i).val();

      total += price * qty;
    }
  }

  $("#subtotal").html("Php " + total.toFixed(2));
}

// updates the warning message
function updateWarning() {
  $("#warning").html("");
  var status = selectedValid($(".toggle"), $(".quantity"));

  var warning = "";
  if (status == 1) {
    warning = "Cannot have less than one order!";
  } else if (status == 2) {
    warning = "Missing fields!";
  } else if (status == 3) {
    warning = "cannot have 0 orders for an item!";
  }

  $("#warning").html(warning);
}

// posts the current order
function sendCurrentOrder() {
  var order = [];

  for (var i = 0; i < $(".toggle").length; i++) {
    if($(".toggle").eq(i).is(":checked")) {
      order.push({name: $(".item-name").eq(i).html(), quantity: $(".quantity").eq(i).val()});
    }
  }

  $.post("/order", {order: JSON.stringify(order)}, function(data, status) {});
}

$(document).ready(function() {
  
  // get user current order - initialize values to 1 if no order found / not logged in
  $.get("/getcurrentorder", function(data, status) {
    if (data.loggedin) {
      var order = JSON.parse(data.order);
      if (order.length == 0) {
        $(".quantity").val(1);
      } else {
        for (var i = 0; i < order.length; i++) {
          for (var j = 0; j < $(".item-name").length; j++) {
            if (order[i].name == $(".item-name").eq(j).html()) {
              $(".toggle").eq(j).attr("checked", true);
              $(".quantity").eq(j).val(parseFloat(order[i].quantity));
            }
          }
        }
      }

      for (var i = 0; i < $(".item-name").length; i++) {
        if(!$(".toggle").eq(i).is(":checked")) {
          $(".quantity").eq(i).val(1);
        }
      }
    } else {
      $(".quantity").val(1);
    }

    // afterwards check all checkbox states, update quantities, and update subtotal
    for (var i = 0; i < $(".toggle").length; i++) {
      if($(".toggle").eq(i).is(":checked")) {
        $(".quantity").eq(i).prop("hidden", false);
        $(".quantity-gray").eq(i).prop("hidden", true);
      } else {
        $(".quantity").eq(i).prop("hidden", true);
        $(".quantity-gray").eq(i).prop("hidden", false);
      }
    }
    updateSubtotal();
    updateWarning();
  });
  
  // on checkbox change, grayout/ungray corresponding input field
  $(".toggle").change(function() {
    var pos = getPosition($(".toggle"), this);
    
    if (pos != -1) {
      if($(this).is(":checked")) {
        $(".quantity").eq(pos).prop("hidden", false);
        $(".quantity-gray").eq(pos).prop("hidden", true);
      } else {
        $(".quantity").eq(pos).prop("hidden", true);
        $(".quantity-gray").eq(pos).prop("hidden", false);
      }
    }  
  });
  
  // checkout and validation
  $("#checkout").click(function () {
    $("#warning").html("");
    
    var status = selectedValid($(".toggle"), $(".quantity"));
    var warning;
    if (status == 0) {
      window.location = "/checkout";
    } else if (status == 1) {
      warning = "Cannot have less than one order!";
    } else if (status == 2) {
      warning = "Cannot have no orders!";
    }
    
    $("#warning").html(warning);
  });

  $("#forbidden").click(function() {
    $("#warning").html("Sign in to proceed!");
  });

  $("#hascurrent").click(function() {
    $("#warning").html("You have an ongoing order!");
  });

  //updating subtotal on change
  //updating current_order if signed in
  $(".toggle").change(function() {
    updateSubtotal();
    updateWarning();
    sendCurrentOrder();
  });
  $(".quantity").change(function() {
    updateSubtotal();
    updateWarning();
    sendCurrentOrder();
  });

})