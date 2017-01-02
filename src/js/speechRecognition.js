/*Speech recognization class*/
    'use strict';
    //Class
    function SpeechRecognization() {
        var recognizer = null;
        var speechRecognition = window.speechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.webkitSpeechRecognition;
        this.startRecognize = function () {
            if (speechRecognition == undefined) {
                throw "Speech Recogniztion API Not Supported"
                //return false;
            }
            else {
                recognizer = new speechRecognition();
                recognizer.continuous = true;
                recognizer.lang = "en-US";
                recognizer.interimResults = true;
                recognizer.onstart = function () {
                }
                //fired everytime user stops speaking.
                recognizer.onresult = function (event) {
                }
                recognizer.onend = function () {
                    recognizer = null;
                    alert("Recogniztion API stopped");
                }

                recognizer.start();
                return recognizer;
            }
        }
        this.stopRecognizer = function () {
            if (recognizer != null) {
                //stop it manually
                recognizer.stop();
            }
        }
    }