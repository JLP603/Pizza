function getPosition(eArray, e) {
    for (var i = 0; i < eArray.length; i++)
        if (eArray[i] == e)
            return i;

    return -1;
}
function selectedValid(checkBoxes, quantities) {
    var totalQty = 0;

    for (var i = 0; i < checkBoxes.length; i++) {
        if ($(checkBoxes[i]).is(":checked")) {
            if (quantities.eq(i).val() < 0) {
                return 1;
            } else {
                totalQty += quantities.eq(i).val();
            }
        }            
    }

    if (totalQty == 0)
        return 2;

    return 0;
}
function updateSubtotal() {
    var total = 0.0;
    for (var i = 0; i < $('.toggle').length; i++) {
        if($('.toggle').eq(i).is(":checked")) {
            var price = $('.price').eq(i).html();
            price = price.substring(4, price.length);
            price = parseFloat(price)
            
            var qty = $('.quantity').eq(i).val();

            total += price * qty;
        }
    }

    $('#subtotal').html('Php ' + total.toFixed(2));
}
function updateWarning() {
    $('#warning').html('');
    var status = selectedValid($('.toggle'), $('.quantity'));

    var warning = '';
    if (status == 1) {
        warning = 'Cannot have less than one order!';
    }

    $('#warning').html(warning);
}
function sendCurrentOrder() {
    var order = [];

    for (var i = 0; i < $('.toggle').length; i++) {
        if($('.toggle').eq(i).is(':checked')) {
            order.push({name: $('.item-name').eq(i).html(), quantity: $('.quantity').eq(i).val()});
        }
    }

    $.post('/order', {order: JSON.stringify(order)}, function(data, status) {});
}

$(document).ready(function() {
    // get user current order / initialize values to 1
    $.get('/getcurrentorder', function(data, status) {
        if (data.loggedin) {console.log(JSON.parse(data.order));
            var order = JSON.parse(data.order);
            if (order.length == 0) {
                $('.quantity').val(1);
            } else {
                for (var i = 0; i < order.length; i++) {
                    for (var j = 0; j < $('.item-name').length; j++) {
                        if (order[i].name == $('.item-name').eq(j).html()) {
                            $('.toggle').eq(j).attr('checked', true);
                            $('.quantity').eq(j).val(parseFloat(order[i].quantity));
                        }
                    }
                }
            }
        } else {
            $('.quantity').val(1);
        }

        // afterwards check all checkbox states, update quantity diabled, and update subtotal
        for (var i = 0; i < $('.toggle').length; i++) {
            if($('.toggle').eq(i).is(':checked')) {
                $('.quantity').eq(i).prop('hidden', false);
                $('.quantity-gray').eq(i).prop('hidden', true);
            } else {
                $('.quantity').eq(i).prop('hidden', true);
                $('.quantity-gray').eq(i).prop('hidden', false);
            }
        }
        updateSubtotal();
        updateWarning();
    });
    
    // on checkbox change, update corresponding quantity input
    $('.toggle').change(function() {
        var pos = getPosition($('.toggle'), this);
        
        if (pos != -1) {
            if($(this).is(":checked")) {
                $('.quantity').eq(pos).prop('hidden', false);
                $('.quantity-gray').eq(pos).prop('hidden', true);
            } else {
                $('.quantity').eq(pos).prop('hidden', true);
                $('.quantity-gray').eq(pos).prop('hidden', false);
            }
        }  
    });
    
    // checkout and validation
    $('#checkout').click(function () {
        $('#warning').html('');
        
        var status = selectedValid($('.toggle'), $('.quantity'));
        var warning;
        if (status == 0) {
            //check if logged in first
            window.location = '/checkout';
        } else if (status == 1) {
            warning = 'Cannot have less than one order!';
        } else if (status == 2) {
            warning = 'Cannot have no orders!';
        }

        $('#warning').html(warning);
    });
    $('#forbidden').click(function() {
        $('#warning').html('Sign in to proceed!');
    })


    //updating subtotal on change
    //updating current_order if signed in
    $('.toggle').change(function() {
        updateSubtotal();
        updateWarning();
        sendCurrentOrder();
    });
    $('.quantity').change(function() {
        updateSubtotal();
        updateWarning();
        sendCurrentOrder();
    });

})