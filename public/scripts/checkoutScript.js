$(document).ready(function () {
  
  // compute and display the grandtotal
  var grandtotal = parseFloat(0);
  for (var i = 0; i < $(".detail").length; i++) {
    grandtotal += parseFloat($(".total").eq(i).html().substring(4, $(".total").eq(i).html().length));
  }
  $("#grandtotal").html("Php " + grandtotal.toFixed(2));
  
  // check if address empty on blur
  $("#address").blur(function() {
    $("#address").css("border", "");
    if ($("#address").val() == "") {
      $("#address").css("border", "solid 1px red");
    }
  });

  // check if contact empty on blur
  $("#contact").blur(function() {
    $("#contact").css("border", "");
    if ($("#contact").val() == "" || isNaN($("#contact").val())) {
      $("#contact").css("border", "solid 1px red");
    }
  });

  // check if contact negative on blur
  $("#contact").blur(function() {
    if (parseInt($("#contact").val()) < 0) {
      $("#contact").css("border", "solid 1px red");
    }
  });

  // verify and post order on checkout
  $("#checkout").click(function () {
    $("#address").css("border", "");
    $("#contact").css("border", "");
    $("#warning").html("");
    $("#warning").css("display", "none");
    $("#link").html("");
    $("#link").css("display", "none");

    var valid = true;
    
    if ($("#address").val() == "") {
      $("#address").css("border", "solid 1px red");
      valid = false;
    }

    if ($("#contact").val() == "" || isNaN($("#contact").val())) {
        $("#contact").css("border", "solid 1px red");
        valid = false;
    }

    if (parseInt($("#contact").val()) < 0) {
      $("#contact").css("border", "solid 1px red");
      valid = false;
    }

    if (valid) {
      $("#checkout").prop("disabled", true);
      $.post("/postorder", {address: $("#address").val(), contact: $("#contact").val(), special_instructions: $("#special_instructions").val()}, function(data, status) {
        if (data.loggedin) {
          window.location = "/user_orders";
        } else {
          window.location = "/login";
        }
      });
    }
  });
});