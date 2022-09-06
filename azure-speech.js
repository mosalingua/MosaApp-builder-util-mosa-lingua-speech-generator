var sdk = require("microsoft-cognitiveservices-speech-sdk");
var readline = require("readline");

var key = "6f87463855b44536a46d893bee128d6a";
var region = "eastus";

function convert(text, voice, audioFile, done) {
    const speechConfig = sdk.SpeechConfig.fromSubscription(key, region);
    const audioConfig = sdk.AudioConfig.fromAudioFileOutput(audioFile);

    // The language of the voice that speaks.
    speechConfig.speechSynthesisVoiceName = voice;

    // Quality
    speechConfig.speechSynthesisOutputFormat = sdk.SpeechSynthesisOutputFormat.Audio48Khz192KBitRateMonoMp3;

    // Create the speech synthesizer.
    var synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);

    synthesizer.speakTextAsync(text,
      function (result) {
        if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
          console.log("synthesis finished.");
        } else {
          console.error("Speech synthesis canceled, " + result.errorDetails +
              "\nDid you set the speech resource key and region values?");
        }
        synthesizer.close();
        synthesizer = null;
        done();
    },
      function (err) {
        console.trace("err - " + err);
        synthesizer.close();
        synthesizer = null;
        done();
    });
    console.log("Now synthesizing to: " + audioFile);

}

module.exports = { convert };

