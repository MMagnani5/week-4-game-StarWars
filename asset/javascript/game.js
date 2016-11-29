// Audio File
var audio = new Audio('asset/audio/Star Wars Theme.mp3');
    audio.play();

$(document).ready(function(){



// Characters Variables
 var characters = {
	 'Lukeskywalker': {
			 name: "Luke Skywalker",
			 attack: 14,
			 health: 160,
			 imageUrl: "asset/images/Luke_Skywalker.png",
			 enemyAttackBack: 30
	},	 
	'Hansolo': {
			 name: "Han Solo",
			 attack: 10,
			 health: 120,
			 imageUrl: "asset/images/lead_large.jpg",
			 enemyAttackBack: 40
	},	 
	'Darthvader': {
		 name: "Darth Vader",
		 attack: 20,
		 health: 180,
		 imageUrl: "asset/images/darth_vader_by_jasonsimart-d9cq3fj.jpg",
		 enemyAttackBack: 20
	},	 
	'Kylo-Ren': {
		 name: "Kylo Ren",
		 attack: 20,
		 health: 140,
		 imageUrl: "asset/images/Kylo-Ren-In-Star-Wars.jpg",
		 enemyAttackBack: 30
	}
};

var currentSelectCharacter;
var currDefender;
var combatants = [];
var indexOfSelChar;
var turnCounter = 1;
var killcount = 0;



//Create function to render DOM

var renderOne = function(character, renderArea, makeChar){
	// character: obj, renderArea: class/id, makeChar: string
	var charDiv = $("<div class='character' data-name='" + character.name + "'>");
	var charName = $("<div class='character-name'>").text(character.name);
  var charImage = $("<img alt='image' class='character-image'>").attr("src", character.imageUrl);
  var charHealth = $("<div class='character-health'>").text(character.health);
    charDiv.append(charName).append(charImage).append(charHealth);
    $(renderArea).append(charDiv);
    // conditional render
    if (makeChar == 'enemy'){
    	$(charDiv).addClass("enemy");
    } else if (makeChar == 'defender') {
    	currDefender = character;
    	$(charDiv).addClass("target-enemy");
    }
};

// Create function to render game message to DOM

var renderMessage = function(message){
	var gameMessageSet = $("#gameMessage");
	var newMessage = $("<div>").text(message);
	gameMessageSet.append(newMessage);

	if (message == 'clearMessage'){
		gameMessageSet.text('');
	}
};

var renderCharacters = function(charObj, areaRneder) {
	// render all characters
	if (areaRender == '#characters-section') {
		$(areaRender).empty();
		for (var key in charObj) {
			if (charObj.hasOwnProperty(key)) {
				renderOne(charObj[key], areaRender, '');
			}
		}
	}
	// render player character 
	if (areaRender == '#selected-character') {
		renderOne(charObj, areaRender, '');
	}

	// render combatants
	if (areaRender == '#available-to-attack-section'){
		for ( var i =0; i < charObj.length; i++) {
			renderOne(charObj[i], areaRneder, 'enemy');
		}
		//render one enemy to defender area
		$(document).on('click', 'enemy', function(){
			// select an combatant to fight 
			name = ($(this).data('name'));
			//if defender area is empty 
			if ($('#defender').children().length === 0) {
				renderCharacters(name, '#defender');
				$(this).hide();
				renderMessage("clearMessage");
			}
		});
	}
	// render defender
	if (areaRender == '#defender'){
		$(areaRender).empty();
		for (var i =0; i < combatants.length; i++) {
			// add enemy to defender area 
			if (combatants[i].name == charObj) {
				renderOne(combatants[i], areaRender, "defender");
			}
		}
	}
	// re-render defender when attacked 
	if (areaRender == 'playDamage') {
		$('#defender').empty();
		renderOne(charObj, '#defender', 'defender');
	}
// re-render player character when attacked
	if (areaRender == 'enemyDefeated') {
		$('#defender').empty();
		var gameStateMessage = "You have defated " + charObj.name + ", you can choose to fight another enemy.";
		renderMessage(gameStateMessage);
	}
};

//this is to render all character for user to choose their computer
renderCharacters(characters, '#characters-section');
$(document).on('click', '.character', function() {
	name = $(this).data('name'); 
	// if no player char has been selected
	if (!currSelectedCharacter) {
		currSelectedCharacter = characters[name];
		for (var key in characters){
			if (key != name) {
				combatants.push(characters[key]);
			}
		}
		$('#characters-section').hide();
		renderCharacters(currSelectedCharacter, '#selected-character');
		// this is to render all characters for user to choose fight against
		renderCharacters(combatants, '#available-to-attack-section');
	}
});

//----------------------------------
// Create functions to enable actions bwt objects

$("#attack-button").on("click", function(){
	// if defender area has enemy
	if ($('#defeneder').children().length !== 0){
		// defender state change
		var attackMessage = " You attacked " + currDefender.name + " for " + (currSelectedCharacter.attack * turnCounter) + " damage.";
		renderMessage("cleanMessage");
		// combat
		currDefender.health = currDefender.health - (currSelectedCharacter.attack * turnCounter);

		// win condition
		if (currDefender.health > 0) {
			// enemy not dead keep playing 
			renderCharacters(currDefender, 'playerDamage');
			// player state change 
			var counterAttackMessage = currDefender.name + " attacked you back for " + currDefender.enemyAttackBack + " damage. ";
			renderMessage(attackMessage);
			renderMessage(counterAttackMessage);


			currSelectedCharacter.health = currSelectedCharacter.health - currDefender.enemyAttackBack;
			renderCharacters(currSelectedCharacter, 'enemyDamage');
			if (currSelectedCharacter.health <= 0) {
				renderMessage("clearMessage");
				restartGame("You been defeated... GAME OVER!!");
				$("#attack-button").unbind("click");
			}
		} else {
			renderCharacters(currDefender, 'enemyDefeated');
			killCount++;
			if (killCount >= 3) {
				renderMessage("clearMessage");
				restartGame("You Won!! Game Over!!");
			}
		}
		turnCounter++;
	} else {
		renderMessage("clearMessage");
		renderMessage("No enemy here");

	}
});

var restartGame = function(inputEndGame) {
	// when restart button is clicked, reload the page
	var restart = $('<button>Restart</button>').click(function(){
		location.reload();
	});
	var gameState = $("<div>").text(inputEndGame);
	$("body").append(gameState);
	$("body").append(restart);
};

});


































