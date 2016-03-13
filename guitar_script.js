var frets;
var strings;

var currentFingering;
var tuning;
var NOTE;

var fretBoard;
var stringValues;
var stringNotes;


//----------------------------String/Fret Manipulation--------------------------------------------

//Handles toggling the given fret and string
var toggleFinger = function(fretString){
    $('#' + fretString).toggleClass("stringHighlight");
}

//blackens all the strings
var blackenStrings = function(){
    for(var i = 0; i < frets; i++){
        for(var j = 0; j < strings; j++){
            $('#fret' + i + 'string' + j).removeClass("stringHighlight");
        }
    }
}

//--------------------------------------Fingering Calculations - Overhead-------------------------

//Handles all the notes and getting alternate fingerings;
//We need alternate fingerings because we wont know if the user will use
//say, A sharp or B flat. 
var Note = {
	A_FLAT : "A Flat",
	A : "A",
	A_SHARP : "A sharp",
	
	B_FLAT : "B Flat",
	B : "B",
	B_SHARP : "B sharp",
	
	C_FLAT : "C Flat",
	C : "C",
	C_SHARP : "C sharp",
	
	D_FLAT : "D Flat",
	D : "D",
	D_SHARP : "D sharp",
	
	E_FLAT : "E Flat",
	E : "E",
	E_SHARP : "E sharp",
	
	F_FLAT : "F Flat",
	F : "F",
	F_SHARP : "F sharp",
	
	G_FLAT : "G Flat",
	G : "G",
	G_SHARP : "G sharp",
	
	getAlternate : function(n){
		switch(n){
			case A_FLAT:
				return G_SHARP;
			case A:
				return A;
			case A_SHARP:
				return B_FLAT;
				
			case B_FLAT:
				return A_SHARP;
			case B:
				return C_FLAT;
			case B_SHARP:
				return C;
				
			case C_FLAT:
				return B;
			case C:
				return B_SHARP;
			case C_SHARP:
				return D_FLAT;
				
			case D_FLAT:
				return C_SHARP;
			case D:
				return D;
			case D_SHARP:
				return E_FLAT;
				
			case E_FLAT:
				return D_SHARP;
			case E:
				return F_FLAT;
			case E_SHARP:
				return F;
				
			case F_FLAT:
				return E;
			case F:
				return E_SHARP;
			case F_SHARP:
				return G_FLAT;
				
			case G_FLAT:
				return F_SHARP;
			case G:
				return G;
			case G_SHARP:
				return A_FLAT;
			default:
				return "";
		}
	}
}




var NoteArray = function(n, name){
	var notes = [];
	this.notes = n;
	this.name = name;
	this.indexOf = function(n){
		for(var i = 0; i < notes.length; i++){
			if(n === notes[i]){
				return i;
			}
		}
		return -1;
	}
	
	this.length = function(){
		return notes.length;
	}
	
	this.noteAt = function(pos){
		return notes[pos];
	}
	
	this.contains = function(n){
		for(var i = 0; i < notes.length; i++){
			if(notes[i] === n || notes[i] === Note.getAlternate(n)){
				return true;
			}
		}
		return false;
	}
}


//Checks if an array is all false
var allFalse = function(array){
	for(var b in array){
		if(b){
			return false;
		}
	}
	return true;
}

//Checks if an array is all trye
var allTrue = function(array){
	for(var b in array){
		if(!b){
			return false;
		}
	}
	return true;
}


//-------------------------------------------Fingering Calculations-------------------------------------

var Fingering = function(numStrings, numFrets){
	var board = [];
	for(var i = 0; i < numStrings; i++){
		for(var j = 0; j < numFrets; j++){
			board[i][j] = false;
		}
	}
	
	this.setPos = function(string, fret, value){
		board[string][fret] = value;
	}
	this.getPos = function(string, fret){
		return board[string][fret];
	}
}

var initializeFretBoard = function(strs, frts){
	sv = [];
	
	for(var s = 0; s < strs; s++){
		temp = [];
		for(var f = 0; f < frts; f++){
			temp[f] = NOTE.noteAt( (NOTE.indexOf( tuning.noteAt(s) ) + f) % 12 );
		}
		
		sv[s] = new NoteArray(temp);
	}
	
	return sv;
}

var setChord = function(newNoteArray, strings, frets){
	var sv = [];
	
	for(var s = 0; s < strings; s++){
		sv[s] = [];
		for(var f = 0; f < frets; f++){
			if(newNoteArray.contains( stringNotes[s].noteAt(f) )){
				sv[s][f] = true;
			} else {
				sv[s][f] = false;
			}
			console.log(sv[s][f]);
		}
	}
	
	return stringValues
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
	for(var i = 0; i < strings; i++){
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

//Instance Variables
frets = 12;
strings = 6;
currentFingering = 0;
//This is just for standard tuning; Change this later when users can enter in different tunings
tuning = new NoteArray([Note.E, Note.B, Note.G, Note.D, Note.A, Note.E]);
NOTE = new NoteArray([Note.A, Note.A_SHARP, Note.B, Note.C, Note.C_SHARP, Note.D, Note.D_SHARP, Note.E, Note.F, Note.F_SHARP, Note.G, Note.G_SHARP]);

$(document).ready(
    function(){
    	
    	stringNotes = initializeFretBoard(strings, frets);
    	//This tests it on A
    	stringValues = setChord(new NoteArray([Note.A, Note.C_SHARP, Note.E], "A"), strings, frets);
    	
    	
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
