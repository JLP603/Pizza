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

$(document).ready(function() {
    // set all default values to 1
    $('.quantity').val(1);

    // on load check all checkbox states
    for (var i = 0; i < $('.toggle').length; i++) {
        if($('.toggle').eq(i).is(':checked')) {
            $('.quantity').eq(i).prop('hidden', false);
            $('.quantity-gray').eq(i).prop('hidden', true);
        } else {
            $('.quantity').eq(i).prop('hidden', true);
            $('.quantity-gray').eq(i).prop('hidden', false);
        }
    }
    
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
            //
        } else if (status == 1) {
            warning = 'Cannot have less than one order!';
        } else if (status == 2) {
            warning = 'Cannot have no orders!';
        }

        $('#warning').html(warning);
    });
})