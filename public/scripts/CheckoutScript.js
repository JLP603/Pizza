$(document).ready(function () {
    $('#checkout').click(function () {
        $('#address').css('border', '');
        $('#contact').css('border', '');

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
            window.location = '/user_orders';
        }
    });
});