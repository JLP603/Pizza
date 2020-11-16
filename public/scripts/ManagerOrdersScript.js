function getPosition(eArray, e) {
    for (var i = 0; i < eArray.length; i++)
        if (eArray[i] == e)
            return i;

    return -1;
}

$(document).ready(function() {
    $('.getDetails').click(function() {
        var pos = getPosition($('.getDetails'), this);
        
        $.post('/getdetails', {_id: $('._id').eq(pos).html()}, function(data, status) {
            $('#username').html('');
            $('#details-card').html('');
            $('#grand-total').html('');
            $('#address').html('');
            $('#contact').html('');
            $('#special_instructions').html('');

            var grandtotal = parseFloat(0);
            $('#username').html('Order for <strong>' + data.username + '</strong>');
            for (var i = 0; i < data.details.length; i++) {
                var entry = '';
                entry += '<div class="d-flex flex-row justify-content-between item"><h4 class="item-name">';
                entry += data.details[i].name;
                entry += '</h4><h4 class="item-col"> Php';
                entry += parseFloat(data.details[i].price).toFixed(2);
                entry += '</h4><h4 class="item-col">';
                entry += data.details[i].quantity;
                entry += '</h4><h4 class="item-col"> Php';
                entry += parseFloat(data.details[i].total).toFixed(2);
                entry += '</h4></div>';

                grandtotal += parseFloat(data.details[i].total);
                $('#details-card').html($('#details-card').html() + entry);

                if (i != data.details.length - 1) {
                    $('#details-card').html($('#details-card').html() + '<hr>');
                }
            }

            $('#grand-total').html('Php ' + grandtotal.toFixed(2));
            
            $('#address').html(data.address);
            $('#contact').val(data.contact);
            $('#special_instructions').html(data.special_instructions);
        });
    });
});
/*
<h4 class="item-name">
Item
</h4><h4 class="item-col">Php 
1.00
</h4><h4 class="item-col">
3
</h4><h4 class="item-col">Php 
3.00
</h4>
*/