//----------------------------String/Fret Manipulation--------------------------------------------

//Handles toggling the given fret and string
var toggleFinger = function(fretString){
    $('#' + fretString).toggleClass("stringHighlight");
}

//blackens all the strings
var blackenStrings = function(){
    for(i = 0; i < frets; i++){
        for(j = 0; j < strings; j++){
            $('#fret' + i + 'string' + j).removeClass("stringHighlight");
        }
    }
}

//--------------------------------------Fingering Calculations-------------------------------------

var Note = function(note, name){
	this.note = note;
	this.name = name;
}

var allFalse = function(array){
	for(var b in array){
		if(b){
			return false;
		}
	}
	return true;
}

var allTrue = function(array){
	for(var b in array){
		if(!b){
			return false;
		}
	}
	return true;
}

var initializeFretBoard = function(){
	var returnBoard = [];
	for(i = 0; i < frets; i++){
		for(j = 0; j < strings; j++){
			
		}
	}
}

var getFingerings = function(){
	var chordComplete = [];
	var fingerings = [];
	var tempFingering = [];
	
	var fretCount = 0;
	var chordNumber = 0;
	
	var sameCheck = false;
	var complete = false;
	var barCheck = false;
	
	//initialize chordComplete to all false:
	for(i = 0; i < strings; i++){
		chordComplete[i] = false;
	}
	
	for(fret = 0; fret < frets; fret++){
		fretCount++;
		sumCheck = false; //Resets sumCheck because we're not on the same fret anymore
		
		if(!allFalse(chordComplete)){
			barCheck = true;
		}
		
		
	}
	
	
	
}






//---------------------------------------Document Javascript----------------------------------------

var frets = 12;
var strings = 6;
var currentFingering = 0;
var fretBoard = [];
var tuning = [new Note("E", "E"), new Note("B", "B"), new Note("G", "G"), new Note("D", "D"), new Note("A"), new Note("E", "E")];

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

        //This is for testing of the toggles
        $(".string").click(
            function(event){
                toggleFinger(event.target.id);
            }
        );
        
        //So is this
        $(document).keypress(
        		function(key){
        			if(key.which === 13 ){
        				blackenStrings();
        			}
        		}
        );
    }
);
