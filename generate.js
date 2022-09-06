const fs = require('fs');
const _ = require('lodash');
const as = require('./azure-speech');

if(process.argv.length < 4) {
	console.log(`
Usage: ${process.argv[0]} ${process.argv[1]} <voiceMap.json> <textList.csv>

	voiceMap.json example:
{
	"man1" 		: "en-US-Wavenet-D",
	"David" 	: "en-US-Wavenet-D",
	"Fabrice"	: "en-US-Wavenet-D",
	"Nadia"		: "en-US-AriaNeural"
}

	textList.csv example:
# This is a comment and this line should be ignored
We rented an apartment in Queens. Once situated, we have the rest of the afternoon for a day of exploration in New York!;Nadia;1640575
Hi Alex, nice to meet you! (5) I'm thirty [30 need to be removed][20](10).;David;1639844
Thursday is my brother's birthday, do you want to come? (need to be removed too).;Nadia;23120

# we can have comments in the middle too
OK, let's do it;UnknownNameRaiseError;1234567

`);
	process.exit();
};

const VOICES_MAP_FILE_NAME = process.argv[2];
const CSV_FILE_NAME = process.argv[3];

try {
	var voiceMap = JSON.parse(fs.readFileSync(VOICES_MAP_FILE_NAME));
} catch(e) {
	console.log('Failed to load voice map json: ' + VOICES_MAP_FILE_NAME)
	console.log('Error: ' + e);
	process.exit();
}

var phrases = [];
try {
	var lines = fs.readFileSync(CSV_FILE_NAME,'utf-8').split(/\r?\n/).filter(v => v.trim() != '' && ! v.trim().startsWith('#'));

	phrases = lines.map(line => {
		var items = line.split(';').map(v=>v.trim());
		return {
			text: items[0].replace(/\(.*?\)/g,'').replace(/\[.*?\]/g,''),
			voice: items[1],
			id: items[2]
		};
	});
} catch(e) {
	console.log('Failed to parse CSV file: ' + CSV_FILE_NAME)
	console.log('Error: ' + e);
	process.exit();
}

const LANG = VOICES_MAP_FILE_NAME.slice(0,2).toLowerCase();

next();

function next() {
	if(phrases.length > 0) {
		var phrase = phrases.shift();
		if(! (phrase.voice in voiceMap) )
			console.log(`ERROR: Unknown voice: ${phrase.voice} in`, phrase);
		else {
			var fname = `${LANG}_${phrase.id}.mp3`;

			console.log(`\n--\nGenerating ${fname}:${voiceMap[phrase.voice]} with "${phrase.text}"`)

			as.convert(phrase.text, voiceMap[phrase.voice], fname, next);
		}
	} else {
		console.log('All conversions finished');
	}
}


