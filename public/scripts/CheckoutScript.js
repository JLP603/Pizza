$(document).ready(function () {
    var grandtotal = parseFloat(0);
    for (var i = 0; i < $('.detail').length; i++) {
        grandtotal += parseFloat($('.total').eq(i).html().substring(4, $('.total').eq(i).html().length));
    }
    $('#grandtotal').html('Php ' + grandtotal.toFixed(2));
    
    $('#address').blur(function() {
        $('#address').css('border', '');
        if ($('#address').val() == '') {
            $('#address').css('border', 'solid 1px red');
        }
    })
    $('#contact').blur(function() {
        $('#contact').css('border', '');
        if ($('#contact').val() == '' || isNaN($('#contact').val())) {
            $('#contact').css('border', 'solid 1px red');
        }
    })
    $('#checkout').click(function () {
        $('#address').css('border', '');
        $('#contact').css('border', '');
        $('#warning').html('');
        $('#warning').css('display', 'none');
        $('#link').html('');
        $('#link').css('display', 'none');

        var valid = true;
        
        if ($('#address').val() == '') {
            $('#address').css('border', 'solid 1px red');
            valid = false;
        }

        if ($('#contact').val() == '' || isNaN($('#contact').val())) {
            $('#contact').css('border', 'solid 1px red');
            valid = false;
        }

        if (valid) {
            $.post('/postorder', {address: $('#address').val(), contact: $('#contact').val(), special_instructions: $('#special_instructions').val()}, function(data, status) {
                if (data.loggedin) {
                    if (data.has_current) {
                        $('#warning').html('You current have an ongoing order');
                        $('#warning').css('display', 'block');
                        $('#link').html('view it here');
                        $('#link').css('display', 'block');
                    } else {
                        window.location = '/user_orders';
                    }
                } else {
                    window.location = '/login';
                }
            });
            
        }
    });
});