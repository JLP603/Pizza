// gets the position of "e" in the array "eArray", returns -1 if not in array
function getPosition(eArray, e) {
  for (var i = 0; i < eArray.length; i++)
  if (eArray[i] == e)
    return i;

  return -1;
}

$(document).ready(function() {
  $(".getDetails").click(function() {
    $("#username").html("Loading...");
    $("#details-card").html("Loading...");
    $("#grand-total").html("Loading...");
    $("#address").html("Loading...");
    $("#contact").val("Loading...");
    $("#special_instructions").html("Loading...");

    var pos = getPosition($(".getDetails"), this);

    // get order details of customer when clicking 'View Details'
    $.post("/getdetails", {_id: $("._id").eq(pos).html()}, function(data, status) {
      $("#details-card").html("");
      var grandtotal = parseFloat(0);
      $("#username").html("Order for <strong>" + data.username + "</strong>");
      for (var i = 0; i < data.details.length; i++) {
        var entry = "";
        entry += "<div class='d-flex flex-row justify-content-between item'><h4 class='item-name'>";
        entry += data.details[i].name;
        entry += "</h4><h4 class='item-col'> Php";
        entry += parseFloat(data.details[i].price).toFixed(2);
        entry += "</h4><h4 class='item-col'>";
        entry += data.details[i].quantity;
        entry += "</h4><h4 class='item-col'> Php";
        entry += parseFloat(data.details[i].total).toFixed(2);
        entry += "</h4></div>";

        grandtotal += parseFloat(data.details[i].total);
        $("#details-card").html($("#details-card").html() + entry);

        if (i != data.details.length - 1) {
          $("#details-card").html($("#details-card").html() + "<hr>");
        }
      }

      $("#grand-total").html("Php " + grandtotal.toFixed(2));
      
      $("#address").html(data.address);
      $("#contact").val(data.contact);
      $("#special_instructions").html(data.special_instructions);
    });
  });
  $(".getConfirmDetails").click(function() {
    $("#confirm-name").html("Loading...");
    $("#confirm-question").html("Loading...");
    $("#confirm-change").html("Loading...");
    
    var pos = getPosition($(".getConfirmDetails"), this);
    $("#current-id").html($("._id").eq(pos).html());
    $("#current-pos").html(pos);

    $.post("/getConfirmDetails", {_id: $("._id").eq(pos).html()}, function(data, status) {
      $("#change-to").html(data.statusOpposite);
      
      $("#confirm-name").html("Order for <strong>" + data.username + "</strong>");
      $("#confirm-question").html("");

      $("#confirm-question").html($("#confirm-question").html() + "Change order status for <strong>" + data.username + "</strong><br>");
      $("#confirm-question").html($("#confirm-question").html() + " from " + data.status + " to " + data.statusOpposite + "?");
      if (data.statusOpposite == "Pending") {
        $("#confirm-change").addClass("btn-warning");
      } else if (data.statusOpposite == "Completed") {
        $("#confirm-change").addClass("btn-success");
      }
      
      $("#confirm-change").html("Change to <strong>" + data.statusOpposite + "</strong>");
    });
  });
  $("#confirm-change").click(function() {
    $("#confirm-change").html("<strong>Updating...</strong>");
    $.post("/updateOrderStatus", {_id: $("#current-id").html(), changeTo: $("#change-to").html()}, function(data, status) {
      if (data.newStatus == "Pending") {
        $(".getConfirmDetails").eq($("#current-pos").html()).removeClass("btn-success");
        $(".getConfirmDetails").eq($("#current-pos").html()).addClass("btn-warning");
        $(".getConfirmDetails").eq($("#current-pos").html()).html("Pending");
      } else {
        $(".getConfirmDetails").eq($("#current-pos").html()).removeClass("btn-warning");
        $(".getConfirmDetails").eq($("#current-pos").html()).addClass("btn-success");
        $(".getConfirmDetails").eq($("#current-pos").html()).html("Completed");
      }

      $("#confirm-change").html("<strong>Updated!</strong>");
      $('#changeStatusModal').modal('toggle');

      $("#change-warning").css("display", "block");
    });
  });
});