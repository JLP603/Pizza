$(document).ready(function() {
    var grandtotal = parseFloat(0);
    for (var i = 0; i < $('.detail').length; i++) {
        grandtotal += parseFloat($('.total').eq(i).html().substring(4, $('.total').eq(i).html().length));
    }
    $('#grandtotal').html('Php ' + grandtotal.toFixed(2));
});