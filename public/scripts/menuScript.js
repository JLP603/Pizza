// gets the position of "e" in the array "eArray", returns -1 if not in array
function getPosition(eArray, e) {
  for (var i = 0; i < eArray.length; i++)
    if (eArray[i] == e)
      return i;

  return -1;
};

$(document).ready(function() {
  // show overlay for item
  $(".show-overlay").click(function() {
    var pos = Math.floor(getPosition($(".show-overlay"), this) / 2);

    if (pos != -1) {
      $(".overlay").eq(pos).css("display", "block");
    }
  });

  // close overlay for item
  $(".overlay-close").click(function() {
    var pos = getPosition($(".overlay-close"), this);

    if (pos != -1) {
      $(".overlay").eq(pos).css("display", "none");
    }
  });
});