var frets;
var strings;
var currentFingering;
var fingerings;
var tuning;
var NOTE;
var fretBoard;
var stringValues;
var stringNotes;
var chords;
var currentChord;


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
			case this.A_FLAT:
				return this.G_SHARP;
			case this.A:
				return this.A;
			case this.A_SHARP:
				return this.B_FLAT;
				
			case this.B_FLAT:
				return this.A_SHARP;
			case this.B:
				return this.C_FLAT;
			case this.B_SHARP:
				return this.C;
				
			case this.C_FLAT:
				return this.B;
			case this.C:
				return this.B_SHARP;
			case this.C_SHARP:
				return this.D_FLAT;
				
			case this.D_FLAT:
				return this.C_SHARP;
			case this.D:
				return this.D;
			case this.D_SHARP:
				return this.E_FLAT;
				
			case this.E_FLAT:
				return this.D_SHARP;
			case this.E:
				return this.F_FLAT;
			case this.E_SHARP:
				return this.F;
				
			case this.F_FLAT:
				return this.E;
			case this.F:
				return this.E_SHARP;
			case this.F_SHARP:
				return this.G_FLAT;
				
			case this.G_FLAT:
				return this.F_SHARP;
			case this.G:
				return this.G;
			case this.G_SHARP:
				return this.A_FLAT;
			default:
				return "";
		}
	}
}




var NoteArray = function(n, name){
	this.notes = n;
	this.name = name;
	this.indexOf = function(n){
		for(var i = 0; i < this.notes.length; i++){
			if(n === this.notes[i]){
				return i;
			}
		}
		return -1;
	}
	
	this.length = function(){
		return this.notes.length;
	}
	
	this.noteAt = function(pos){
		return this.notes[pos];
	}
	
	this.getName = function(){
		return this.name;
	}
	
	this.contains = function(n){
		for(var i = 0; i < this.notes.length; i++){
			if(this.notes[i] === n || this.notes[i] === Note.getAlternate(n)){
				return true;
			}
		}
		return false;
	}
}


//Checks if an array is all false
var allFalse = function(array){
	for(var i = 0; i < array.length; i++){
		if(array[i]){
			return false;
		}
	}
	return true;
}

//Checks if an array is all trye
var allTrue = function(array){
	for(var i = 0; i < array.length; i++){
		if(!array[i]){
			return false;
		}
	}
	return true;
}


//-------------------------------------------Fingering Calculations-------------------------------------

var Fingering = function(numStrings, numFrets){
	var board = [];
	for(var i = 0; i < numStrings; i++){
		board[i] = [];
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
	this.getBoard = function(){
		return board;
	}
	
	this.reset = function(){
		for(var i = 0; i < numStrings; i++){
			board[i] = [];
			for(var j = 0; j < numFrets; j++){
				board[i][j] = false;
			}
		}
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
	currentChord = newNoteArray;
	
	for(var s = 0; s < strings; s++){
		sv[s] = [];
		for(var f = 0; f < frets; f++){
			if(newNoteArray.contains( stringNotes[s].noteAt(f) )){
				sv[s][f] = true;
			} else {
				sv[s][f] = false;
			}
		}
	}
	return sv;
}

var getFingerings = function(){
	var chordComplete = [];
	for(var i = 0; i < strings; i++){
		chordComplete[i] = false;
	}
	var temp = new Fingering(strings, frets);
	var fingerings = [];
	var fretCount = 0;
	var noteNumber = 0;
	var sameCheck = false;
	var complete = false
	var barCheck = false;
	
	for(var fret = 0; fret < frets; fret++){
		fretCount++;
		sameCheck = false;
		
		if(!allFalse(chordComplete)){
			barCheck = true;
		}
		
		for(var str = 0; str < strings; str++){
			if(fret > frets - 1){
				break;
			}
			
			if(stringValues[str][fret]){
				if(!chordComplete[str]){
					temp.setPos(str, fret, true);
					if((!sameCheck || barCheck) && fret !== 0){
						noteNumber++;
					}
					chordComplete[str] = true;
					sameCheck = true;
				}
			}
		}
		
		if(noteNumber > 4 || fretCount > 4){
			temp = new Fingering(strings, frets);
			chordComplete = [];
			for(var i = 0; i < strings; i++){
				chordComplete[i] = false;
			}
			
			sameCheck = false;
			noteNumber = 0;
			fret -= (fretCount - 1);
			fretCount = 0;
			complete = false;
			barCheck = false;
		}
		
		complete = allTrue(chordComplete);
		
		if(complete){
			chordComplete = [];
			for(var i = 0; i < strings; i++){
				chordComplete[i] = false;
			}

			fingerings[fingerings.length] = temp;
			temp = new Fingering(strings, frets);
			sameCheck = false;
			noteNumber = 0;
			fret -= (fretCount - 1);
			fretCount = 0;
			complete = false;
			barCheck = false;
		}
	}
	return fingerings;
}




//----------------------------------------Interface integration-------------------------------------

var updateFretBoard = function(values){
	blackenStrings();
	for(var i = 0; i < values.length; i++){
		for(var j = 1; j < values[i].length + 1; j++){
			if(values[i][j]){
				toggleFinger("fret" + (j - 1) + "string" + i);
			}
		}
	}
}

var initializeChords = function(){
	var selector = document.getElementById('note');
	//Add cookie support here later
	for(var i = 0; i < chords.length; i++){
		var option = document.createElement('option');
		option.text = chords[i].getName();
		option.value = chords[i].getName();
		selector.add(option, selector[selector.length]);
	}
}

var onSelectChange = function(e){
	for(var i = 0; i < chords.length; i++){
		if(chords[i].getName() === e.value){
			currentFingering = 0;
			stringValues = setChord(chords[i], strings, frets);
			fingerings = getFingerings();
			updateFretBoard(fingerings[0].getBoard());
		}
	}
}

var onNextFingering = function(){
	currentFingering++;
	if(currentFingering >= fingerings.length){
		currentFingering = 0;
	}
	updateFretBoard(fingerings[currentFingering].getBoard());
}

var onFretChange = function(e){
	if(isNaN(e.value)){
		alert("What you entered is not a number!");
		e.value = 12;
		createFretBoard();
		return;
	}
	if(e.value < 5 || e.value > 24){
		alert("Sorry; You can only have frets from 5 to 24.");
		e.value = 12;
		createFretBoard();
		return;
	}
	
	frets = e.value;
	currentFingering = 0;
	createFretBoard();
	
}

var createFretBoard = function(){
	$('.guitar').html('');
	
	stringNotes = initializeFretBoard(strings, frets);
	initializeChords();
	stringValues = setChord(currentChord, strings, frets);
	fingerings = getFingerings();

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
    
    updateFretBoard(fingerings[currentFingering].getBoard());
}



//---------------------------------------Document Javascript----------------------------------------

//Instance Variables
frets = 12;
strings = 6;
currentFingering = 0;
//This is just for standard tuning; Change this later when users can enter in different tunings
tuning = new NoteArray([Note.E, Note.B, Note.G, Note.D, Note.A, Note.E]);
NOTE = new NoteArray([Note.A, Note.A_SHARP, Note.B, Note.C, Note.C_SHARP, Note.D, Note.D_SHARP, Note.E, Note.F, Note.F_SHARP, Note.G, Note.G_SHARP]);
chords = [
              new NoteArray([Note.A, Note.C_SHARP, Note.E], "A"),
              new NoteArray([Note.A, Note.C_SHARP, Note.E, Note.G_SHARP], "Amaj7"),
              
              new NoteArray([Note.A, Note.C, Note.E], "A Minor"),
              new NoteArray([Note.A, Note.C, Note.E, Note.G], "Am7"),
              
              new NoteArray([Note.A, Note.C_SHARP, Note.E, Note.G], "A7"),
              
              new NoteArray([Note.A_SHARP, Note.D, Note.E_SHARP], "A Sharp"),
              new NoteArray([Note.A_SHARP, Note.D, Note.F, Note.A], "A#maj7"),      
              
              new NoteArray([Note.A_SHARP, Note.C_SHARP, Note.E_SHARP], "A Sharp Minor"),
              new NoteArray([Note.A_SHARP, Note.C_SHARP, Note.E_SHARP, Note.G_SHARP], "A#m7"),
              
              new NoteArray([Note.A_SHARP, Note.D, Note.E_SHARP, Note.G_SHARP], "A#7"),
              
              new NoteArray([Note.B, Note.D_SHARP, Note.F_SHARP], "B"),
              new NoteArray([Note.B, Note.D_SHARP, Note.F_SHARP, Note.A_SHARP], "Bmag7"),
              
              new NoteArray([Note.B, Note.D, Note.F_SHARP], "B Minor"),
              new NoteArray([Note.B, Note.D, Note.F_SHARP, Note.A], "Bm7"),
              
              new NoteArray([Note.B, Note.D_SHARP, Note.F_SHARP, Note.A], "B7"),
              
              new NoteArray([Note.C, Note.E, Note.G], "C"),
              new NoteArray([Note.C, Note.E, Note.G, Note.B], "Cmaj7"),
              
              new NoteArray([Note.C, Note.E_FLAT, Note.G], "C Minor"),
              new NoteArray([Note.C, Note.E_FLAT, Note.G, Note.B_FLAT], "Cm7"),
              
              new NoteArray([Note.C, Note.E, Note.G, Note.B_FLAT], "C7"),
              
              new NoteArray([Note.C_SHARP, Note.E_SHARP, Note.G_SHARP], "C Sharp"),
              new NoteArray([Note.C_SHARP, Note.E_SHARP, Note.G_SHARP, Note.B_SHARP], "C#maj7"),
              
              new NoteArray([Note.C_SHARP, Note.E, Note.G_SHARP], "C Sharp Minor"),
              new NoteArray([Note.C_SHARP, Note.E, Note.B], "C#m7"),
              
              new NoteArray([Note.C_SHARP, Note.E_SHARP, Note.G_SHARP, Note.B], "C#7"),
              
              new NoteArray([Note.D, Note.F_SHARP, Note.A], "D"),
              new NoteArray([Note.D, Note.F_SHARP, Note.A, Note.C_SHARP], "Dmaj7"),
              
              new NoteArray([Note.D, Note.F, Note.A], "D Minor"),
              new NoteArray([Note.D, Note.F, Note.A, Note.C], "Dm7"),
              
              new NoteArray([Note.D, Note.F_SHARP, Note.A, Note.C], "D7"),
              
              new NoteArray([Note.D_SHARP, Note.G, Note.A_SHARP], "D Sharp"),
              new NoteArray([Note.D_SHARP, Note.G, Note.A_SHARP, Note.D], "D#maj7"),
              
              new NoteArray([Note.D_SHARP, Note.F_SHARP, Note.A_SHARP], "D Sharp Minor"),
              new NoteArray([Note.D_SHARP, Note.F_SHARP, Note.A_SHARP, Note.C_SHARP], "D#m7"),
              
              new NoteArray([Note.D_SHARP, Note.G, Note.A_SHARP, Note.C_SHARP], "D#7"),
              
              new NoteArray([Note.E, Note.G_SHARP, Note.B], "E"),
              new NoteArray([Note.E, Note.G_SHARP, Note.B, Note.D_SHARP], "Emaj7"),
              
              new NoteArray([Note.E, Note.G, Note.B], "E Minor"),
              new NoteArray([Note.E, Note.G, Note.B, Note.D], "Em7"),
              
              new NoteArray([Note.E, Note.G_SHARP, Note.B, Note.D], "E7"),
              
              new NoteArray([Note.F, Note.A, Note.C], "F"),
              new NoteArray([Note.F, Note.A, Note.C, Note.E], "Fmaj7"),
              
              new NoteArray([Note.F, Note.A_FLAT, Note.C], "F Minor"),
              new NoteArray([Note.F, Note.A_FLAT, Note.C, Note.E_FLAT], "Fm7"),
              
              new NoteArray([Note.F, Note.A, Note.C, Note.E_FLAT], "F7"),
              
              new NoteArray([Note.F_SHARP, Note.A_SHARP, Note.C_SHARP], "F Sharp"),
              new NoteArray([Note.F_SHARP, Note.A_SHARP, Note.C_SHARP, Note.F], "F#maj7"),
              
              new NoteArray([Note.F_SHARP, Note.A, Note.C_SHARP], "F Sharp Minor"),
              new NoteArray([Note.F_SHARP, Note.A, Note.C_SHARP, Note.E], "F#m7"),

              new NoteArray([Note.F_SHARP, Note.A_SHARP, Note.C_SHARP, Note.E], "F#7"),
              
              new NoteArray([Note.G, Note.B, Note.D], "G"),
              new NoteArray([Note.G, Note.B, Note.D, Note.F_SHARP], "Gmaj7"),
              
              new NoteArray([Note.G, Note.B_FLAT, Note.D], "G Minor"),
              new NoteArray([Note.G, Note.B_FLAT, Note.D, Note.F], "Gm7"),
              
              new NoteArray([Note.G, Note.B, Note.D, Note.F], "G7"),
              
              new NoteArray([Note.G_SHARP, Note.B_SHARP, Note.D_SHARP], "G Sharp"),
              new NoteArray([Note.G_SHARP, Note.B_SHARP, Note.D_SHARP, Note.G], "G#maj7"),
              
              new NoteArray([Note.G_SHARP, Note.B, Note.D_SHARP], "G Sharp Minor"),
              new NoteArray([Note.G_SHARP, Note.B, Note.D_SHARP, Note.F_SHARP], "G#m7"),
              new NoteArray([Note.G_SHARP, Note.B_SHARP, Note.D_SHARP, Note.F_SHARP], "G Sharp")
              ];

currentChord = chords[0];

$(document).ready(
    function(){

    	createFretBoard();

		$('#btn_nextFingering').click(
				function(){
					onNextFingering();
				}
		);

    }
);
