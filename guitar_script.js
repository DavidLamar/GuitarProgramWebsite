var frets = 12;
var strings = 6;

var toggleFinger = function(fretString){
    var currentColor = $('#' + fretString).css("background-color");
    if(currentColor === "rgb(0, 0, 0)"){
        $('#' + fretString).css("background-color", "white");
    } else {
        $('#' + fretString).css("background-color", "black");
    }
}

var blackenStrings = function(){
    for(i = 0; i < frets; i++){
        for(j = 0; j < strings; j++){
            $('#fret' + i + 'string' + j).css("background-color", "black");
        }
    }
}


$(document).ready(
    function(){
        var guitarWidth = $(".guitar").css("width");
        guitarWidth = guitarWidth.substring(0, guitarWidth.length - 2);

        //The 2 here is for the width of the border of each fret
        var fretWidth = (guitarWidth / frets) - 2;


        var guitarHeight = $(".guitar").css("height");
        guitarHeight = guitarHeight.substring(0, guitarHeight.length-2);

        //the +5 is for the height of each string(5px)
        //we divide by two because we're using top and bottom padding; left and right aren't being used
        var stringMargin = ((guitarHeight / strings) + 5)/2;


        for(i = 0; i < frets; i++){

            $('.guitar').append('<div class=\'fret\' id=\'fret' + i + '\' style=\'width: ' + fretWidth + 'px\'></div>');
            for(j = 0; j < strings; j++){
                $('#fret' + i).append('<div class=\'string\' id=\'fret' + i + 'string' + j + '\' style=\'margin-top: ' + stringMargin + 'px; margin-bottom: ' + stringMargin + 'px;\'></div>');
            }
        }

        toggleFinger("fret0string0");
        blackenStrings();
    }
);
