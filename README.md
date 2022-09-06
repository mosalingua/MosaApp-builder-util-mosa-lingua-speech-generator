# Mosa Lingua Audio File Generator 

## Preparing Configuration files
Repository contains two example config files, to use in testing.

### Voice Map JSON struct
Mapping of voices into speech voice templates, example **en_voices_mosa_playht.json**
```
{
	"man1" 		: "en-US-Wavenet-D",
	" " 		: "en-US-AriaNeural",
	"David" 	: "en-US-Wavenet-D",
	"Fabrice"	: "en-US-Wavenet-D",
	"Nadia"		: "en-US-AriaNeural"
}
```
Left column(json keys) contains aliases used in CSV.
Right column(json values) contains appropriate Azure Speech vocals to use in audio rendering 

### Conversion CSV File Struct
CSV file with, example **en_dialogues_to_generate.csv**

```
# This is a comment and this line should be ignored
We rented an apartment in Queens. Once situated, we have the rest of the afternoon for a day of exploration in New York!;Nadia;1640575
Hi Alex, nice to meet you! (5) I'm thirty [30 need to be removed][20](10).;David;1639844
Thursday is my brother's birthday, do you want to come? (need to be removed too).;Nadia;23120

# we can have comments in the middle too
OK, let's do it;UnknownNameRaiseError;1234567
```

## Running the script

### Clone this repository
```
git clone https://github.com/seeker1983/mosa-lingua-speech-generator
```

### Install dependencies
```
npm install
```

### Setup API key and Region in **azure-speech.js**
```
var key = "<API_KEY>";
var region = "<REGION_CODE>";
```

### Execute script using provided files
Run script using nodejs with specified parameters:
```
node generate.js en_voices_mosa_playht.json en_dialogues_to_generate.csv
```

Upon successful execution files
- en_1639844.wav
- en_1640575.wav
- en_23120.wav

should appear in execution folder.
