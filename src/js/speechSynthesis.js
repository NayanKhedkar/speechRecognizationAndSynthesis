/*Speech Synthesis class*/
    'use strict';
    //Class
    function SpeechSynthesis() {
        var synthesizer = null;
        var default_voiceURI = null;
        var default_lang = null;
        var timer = setInterval(function () {
            if ("speechSynthesis" in window) {
                var available_voices = speechSynthesis.getVoices();
                if (available_voices.length !== 0) {
                    for (var count = 0; count < available_voices.length; count++) {
                        if (count == 0) {
                            //we make the first voice as default.
                            default_voiceURI = available_voices[count].voiceURI;
                            default_lang = available_voices[count].lang;
                        }

                        document.getElementById("voices").innerHTML += "<option value='" + available_voices[count].lang + "' data-voice-uri='" + available_voices[count].voiceURI + "'>" + available_voices[count].name + "</option>";
                    }
                    clearInterval(timer);
                }
            }
            else {
                clearInterval(timer);
                throw "Speech Synthesis API not supported";
            }
        }, 1);

        this.speak = function (text,rate,pitch,context) {
            if ("SpeechSynthesisUtterance" in window) {
                synthesizer = new SpeechSynthesisUtterance();
                synthesizer.text =text||"Please enter text";
                synthesizer.voice = default_voiceURI;
                synthesizer.lang = default_lang;
                synthesizer.rate = rate||1;
                synthesizer.pitch = pitch||1;
                synthesizer.onstart = function () {
                    console.log("Synthesis Started",context);
                }
                //fired when synthesizer is paused
                synthesizer.onpause = function () {
                    console.log("Synthesis Paused",context);
                }
                //fired when synthesizer is resumed after pause
                synthesizer.onresume = function () {
                    console.log("Synthesis Resumed after Pause",context);
                }

                //fired when synthesizer is stopped
                synthesizer.onend = function () {
                    console.log("Synthesis Stopped",context);
                }

                speechSynthesis.speak(synthesizer);
                return synthesizer;
            }
            return false;
        }

        this.pause = function () {
            //speechSynthesis pauses all SpeechSynthesisUtterance objects outputs.
            if (speechSynthesis.paused === false) {
                speechSynthesis.pause();
            }
        }

        this.resume = function () {
            //speechSynthesis resumes all SpeechSynthesisUtterance objects outputs.
            if (speechSynthesis.paused === true) {
                speechSynthesis.resume();
            }
        }

        this.stop = function () {
            //speechSynthesis stops all SpeechSynthesisUtterance objects outputs and deleted them from memory.
            speechSynthesis.cancel();
        }

        this.set_voice=function(langauge,voiceURI) {
            var sel_element = document.getElementById("voices").options[voices.selectedIndex];
            default_lang = sel_element.getAttribute("value")||langauge;
            default_voiceURI = sel_element.getAttribute("data-voice-uri")||voiceURI;
        }
    }