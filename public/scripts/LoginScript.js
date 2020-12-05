$(document).ready(function () {
  // toggle login/register
  $("#register-toggle").click(function() {
    $("#login").css("left", "-400px");
    $("#register").css("left", "50px");
    $("#btn").css("left", "140px");
  });
  $("#login-toggle").click(function() {
    $("#login").css("left", "50px");
    $("#register").css("left", "450px");
    $("#btn").css("left", "0px");
  });
  
  // hide/unhide passwords
  $("#eye1").click(function() {
    if ($("#password").prop("type") == "password") {
      $("#password").prop({type:"text"});
      $("#hide1").css("display", "block");
      $("#hide2").css("display", "none");
    } else {
      $("#password").prop({type:"password"});
      $("#hide1").css("display", "none");
      $("#hide2").css("display", "block");
    }
  });
  $("#eye2").click(function() {
    if ($("#pswrd_2").prop("type") == "password") {
      $("#pswrd_2").prop({type:"text"});
      $("#hide3").css("display", "block");
      $("#hide4").css("display", "none");
    } else {
      $("#pswrd_2").prop({type:"password"});
      $("#hide3").css("display", "none");
      $("#hide4").css("display", "block");
    }
  });
  $("#eye3").click(function() {
    if ($("#pswrd_1").prop("type") == "password") {
      $("#pswrd_1").prop({type:"text"});
      $("#hide5").css("display", "block");
      $("#hide6").css("display", "none");
    } else {
      $("#pswrd_1").prop({type:"password"});
      $("#hide5").css("display", "none");
      $("#hide6").css("display", "block");
    }
  });
  
  // login username check on username blur
  $("#username1").blur(function() {
    $("#error1").html("");
    $("#error1").css("display", "none");

    $.post("/login", {type: "username_check", username: $("#username1").val()}, function(data, status) {
      if (!data.ok) {
        $("#error1").html("Username not found!");
        $("#error1").css("display", "block");
      }
    });
  });

  // login verification and post on button click
  $("#log").click(function() {
    $("#error1").html("");
    $("#error1").css("display", "none");

    if ($("#username1").val() == "") {
      $("#error1").html("Username empty!");
      $("#error1").css("display", "block");
    } else if ($("#password").val() == "") {
      $("#error1").html("Password empty!");
      $("#error1").css("display", "block");
    } else {
      $.post("/login", {type: "login", username: $("#username1").val(), password: $("#password").val()}, function(data, status) {
        if (data.ok) {
          window.location = data.redirect_url;
        } else {
          $("#error1").html(data.message);
          $("#error1").css("display", "block");
        }
      });
    }
  });

  // login verification and post on enter key press
  $("#password").keypress(function (e) {
    if (e.which == 13) {
      $("#error1").html("");
      $("#error1").css("display", "none");

      if ($("#username1").val() == "") {
        $("#error1").html("Username empty!");
        $("#error1").css("display", "block");
      } else if ($("#password").val() == "") {
        $("#error1").html("Password empty!");
        $("#error1").css("display", "block");
      } else {
        $.post("/login", {type: "login", username: $("#username1").val(), password: $("#password").val()}, function(data, status) {
          if (data.ok) {
            window.location = data.redirect_url;
          } else {
            $("#error1").html(data.message);
            $("#error1").css("display", "block");
          }
        });
      }
      
      return false;
    }
  });

  // register username check
  $("#username2").blur(function() {
    $("#error2").html("");
    $("#error2").css("display", "none");

    $.post("/newUser", {type: "username_check", username: $("#username2").val()}, function(data, status) {
      if (!data.ok) {
        $("#error2").html("Username already exists!");
        $("#error2").css("display", "block");
      }
    });
  });

  // register check for matching passwords
  $("#pswrd_2").keyup(function() {
    $("#error").html("");
    $("#error").css("display", "none");

    if ($("#pswrd_1").val() != $("#pswrd_2").val()) {
      $("#error").html("Passwords do not match!");
      $("#error").css("display", "block");
    }
  });

  // register verification and post
  $("#reg").click(function() {
    $("#error2").html("");
    $("#error2").css("display", "none");
    $("#confirm").css("display", "none");

    if ($("#username2").val() == "") {
      $("#error2").html("Username empty!");
      $("#error2").css("display", "block");
    } else if ($("#pswrd_1").val() == "" || $("#pswrd_2").val() == "") {
      $("#error2").html("Password empty!");
      $("#error2").css("display", "block");
    } else if ($("#pswrd_1").val() != $("#pswrd_2").val()) {
      $("#error2").html("Passwords do not match!");
      $("#error2").css("display", "block");
    } else if (!$("#checkbox").is(":checked")) {
      $("#error2").html("Please agree to the terms and conditions!");
      $("#error2").css("display", "block");
    } else {
      $.post("/newUser", {type: "register", username: $("#username2").val(), password: $("#pswrd_1").val()}, function(data, status) {
        if (data.ok) {
          $("#username2").val("");
          $("#pswrd_1").val("");
          $("#pswrd_2").val("");
          $("#confirm").css("display", "block");
          $("#confirm").html(data.message);
          $("#login").css("left", "50px");
          $("#register").css("left", "450px");
          $("#btn").css("left", "0px");
        } else {
          $("#error2").css("display", "block");
          $("#error2").html(data.message);
        }
      });
    }
  });
});