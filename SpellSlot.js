/*

Script will respond to a !spellslot command and take in the remaining string as the parameter. Remaining string should represent a character sheet in the journal.

*/

var spellSlotName = 'caster1_spells_perday_level_';
var maxSpellLevel = 9;

 on("chat:message", function(msg) {
  if (msg.type == "api") {
    var msgSplit = msg.content.split(/\s+/);
    var msgCommand = msgSplit[0].toUpperCase();
    var playerID = msg.playerid;
    if (msgCommand === "!SPELLSLOT") {
      var characterName = '';

      //CHANGE tokenImg TO DESIRED IMAGE. FOR INTENDED EFFECT, USE A 70X70 TRANSPARENT PNG IMAGE.
        //tokenImage needs to be an image in your roll20 library. To get the imgUrl for an image in your library,
        //open your image library to the desired image, use the developer console to locate it.
        //(F12 on PC, Option + Command + J for Mac) -- TODO Probably remove this line, I do not think it is relevant
      var tokenImg = 'https://s3.amazonaws.com/files.d20.io/images/277497733/MyFvZXzbf5-WAXhnFiZolQ/thumb.png?1648312676';

      //Iterate over message to compile full character name regardless of whitespace in name
      for (var i = 1; i < msgSplit.length; i++) {
        if (i > 1) {
          characterName += ' ';
        }
        characterName += msgSplit[i];
      }

      //Get ID of matching character sheet.
      var character = findObjs({type: 'character', name: characterName})[0].id;

      var spellCount = [0, 0];

      // Find max spell level to determine number of tokens to place and fields to fill using else if statements starting at level 9.
      // spellCount will be an array of [x,y] where x is number of tokens to be generated, and y is number of fields to be filled in the last token.

      for (let j = maxSpellLevel; j > 0; j--) {
        if (getAttrByName(character, spellSlotName + j) > 0) {
          spellCount = [(
            Math.ceil(j/3)
          ),
          (
            ((j%3) !== 0) ? (j%3) : (3)
          )
          ]
          break
        }
      }

      //Loop creates each of the tokens for to be displayed
      for (let i = 1; i <= spellCount[0]; i++) {
        var currentScale = 3*(i-1)
        var barStats = [0, 0, 0];
        /**** The Follow Section serves to identify appropriate name of the token being created ****/
        if (i !== spellCount[0]) {
          tokenName = ((i == 1) ? '1st through 3rd Level' : '4th through 6th Level');
          for (var j = 1; j <= 3; j++) {
            var spellLevel = j + currentScale;
            var spellLevelString = spellSlotName + spellLevel;
            var totalSpellsForLvl = getAttrByName(character, spellLevelString);
            barStats[j-1] = totalSpellsForLvl;
          }

        } else {

          for (var j = 1; j <= spellCount[1]; j++) {
            var spellLevel = j + currentScale;
            var spellLevelString = spellSlotName + spellLevel;
            var totalSpellsForLvl = getAttrByName(character, spellLevelString);
            barStats[j-1] = totalSpellsForLvl;
          }

          if (i == 1) {
            var tokenName = ((spellCount[1] == 1) ? '1st Level' : ((spellCount[1] == 2) ? '1st & 2nd Level' : '1st through 3rd Level'));
          } else if (i == 2) {
            var tokenName = ((spellCount[1] == 1) ? '4th Level' : ((spellCount[1] == 2) ? '4th & 5th Level' : '4th through 6th Level'));
          } else {
            var tokenName = ((spellCount[1] == 1) ? '7th Level' : ((spellCount[1] == 2) ? '7th & 8th Level' : '7th through 9th Level'));
          }
        }
        /**** End of section ****/

        //Create token with all of the data
        var spellToken = createObj('graphic', {
          pageid: Campaign().get("playerpageid"),
          layer: 'objects',
          height: 70,
          width: 70,
          left: 70*i+35,
          top: 70*i+35,
          name: tokenName,
          imgsrc: tokenImg,
          controlledby: playerID,
          has_bright_light_vision: true,
          has_night_vision: true,
          night_vision_distance: 0.5,
          bar1_value: barStats[0],
          bar1_max: barStats[0],
          bar2_value: barStats[1],
          bar2_max: barStats[1],
          bar3_value: barStats[2],
          bar3_max: barStats[2],
          bar_location: 'overlap_bottom',
          showname: true
        })
      }
    }
  }
})