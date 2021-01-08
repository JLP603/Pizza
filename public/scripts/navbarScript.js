$(document).ready(function() {
  // post logout request
  $("#signout").click(function() {
    $.post("/logout", {}, function(data, status) {
      window.location = "/";
    });
  });
});