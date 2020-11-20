$(document).ready(function() {
    $('#signout').click(function() {
        $.post('/logout', {}, function(data, status) {
            window.location = '/';
        });
    });
});