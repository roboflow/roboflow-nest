$(function() {
    var MAX_FRAMERATE = 4;

    $("#status").text("Initializing...");

    var $img = $('<img/>');
    $("#container").append($img);

    $img.bind("load", function() {
        $("#status").text("Streaming...");
        _.defer(loadFrame);
    });

    var loadFrame = _.throttle(function() {
        $img.attr("src", "/image?t=" + Date.now());
    }, 1000/MAX_FRAMERATE);

    loadFrame();
});
