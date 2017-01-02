if (window.attachEvent) {
    window.attachEvent("onload", init);
} else {
    window.addEventListener("load", init, true);
}
var speechRec = null,
    speechSynths = null;
function init() {
    //Code to execute when the document is loaded.
    bindEvent()
}
function bindEvent() {
    document.getElementById("speechRecognition-btn").addEventListener("click", initializeSpeechRecognition, false);
    document.getElementById("speechSynthesis-btn").addEventListener("click", initializeSpeechSynthesis, false);
}
function initializeSpeechRecognition() {
    var el = document.getElementsByClassName("speech-buton");
    el[0].classList.remove("display-none");
    el[1].classList.add("display-none");
    if (!speechRec) {
        recognizing = false;
        speechRec = new SpeechRecognization();
        initializeEventsForSpeechRecognition();
    }
}
function initializeSpeechSynthesis() {
    var el = document.getElementsByClassName("speech-buton");
    el[1].classList.remove("display-none");
    el[0].classList.add("display-none");
    if (!speechSynths) {
        speechSynths = new SpeechSynthesis();
        bindEventsForSpeechSyntesis();
    }
}
/////////////////////////////////////////////////////////////////////////////////
//speechRecognition evevt Binding.
function initializeEventsForSpeechRecognition() {
    var final_transcript = '';
    var ignore_onend;
    var start_timestamp;
    document.getElementById('select_language').addEventListener('change', updateCountry);
    document.getElementById('start_button').addEventListener('click', startButton);
    setLanguages();
    var recognition = speechRec.startRecognize();
    if (recognition) {
        start_button.style.display = 'inline-block';
        recognition.onstart = function () {
            recognizing = true;
            showInfo('info_speak_now');
            start_img.src = 'assets/images/mic-animate.gif';
        };

        recognition.onerror = function (event) {
            if (event.error == 'no-speech') {
                start_img.src = 'assets/images/mic.gif';
                showInfo('info_no_speech');
                ignore_onend = true;
            }
            if (event.error == 'audio-capture') {
                start_img.src = 'assets/images/mic.gif';
                showInfo('info_no_microphone');
                ignore_onend = true;
            }
            if (event.error == 'not-allowed') {
                if (event.timeStamp - start_timestamp < 100) {
                    showInfo('info_blocked');
                } else {
                    showInfo('info_denied');
                }
                ignore_onend = true;
            }
        };
        recognition.onend = function () {
            recognizing = false;
            if (ignore_onend) {
                return;
            }
            start_img.src = '/assets/images/mic.gif';
            if (!final_transcript) {
                showInfo('info_start');
                return;
            }
            showInfo('');
            if (window.getSelection) {
                window.getSelection().removeAllRanges();
                var range = document.createRange();
                range.selectNode(document.getElementById('final_span'));
                window.getSelection().addRange(range);

            };
            recognition.onresult = function (event) {
                var interim_transcript = '';
                if (typeof(event.results) == 'undefined') {
                    recognition.onend = null;
                    speechRec.stopRecognizer();
                    upgrade();
                    return;
                }
                for (var i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        final_transcript += event.results[i][0].transcript;
                    } else {
                        interim_transcript += event.results[i][0].transcript;
                    }
                }
                final_transcript = capitalize(final_transcript);
                final_span.innerHTML = linebreak(final_transcript);
                interim_span.innerHTML = linebreak(interim_transcript);
                if (final_transcript || interim_transcript) {
                    showButtons('inline-block');
                }
            };
        }
    }
    else {
        upgrade();
    }

}
/////////////////////////////////////////////////////////////////////////////////
//speechSynthesis evevt Binding.
function bindEventsForSpeechSyntesis() {
    document.getElementById("speak").addEventListener("click", function () {
        var text = document.getElementById("text").value;
        //speak(text,rate,pitch,context)
        var speekCallbacks=speechSynths.speak(text);
    }, false);
    document.getElementById("pause").addEventListener("click", function () {
        speechSynths.pause();
    }, false);
    document.getElementById("resume").addEventListener("click", function () {
        speechSynths.resume();
    }, false);
    document.getElementById("stop").addEventListener("click", function () {
        speechSynths.stop();
    }, false);
    document.getElementById("voices").addEventListener("change", function () {
        speechSynths.set_voice();
    }, false);
}

///////////////////////////////////////////////////////////////////////////////
function updateCountry() {
    for (var i = select_dialect.options.length - 1; i >= 0; i--) {
        select_dialect.remove(i);
    }
    var list = langs[select_language.selectedIndex];
    for (var i = 1; i < list.length; i++) {
        select_dialect.options.add(new Option(list[i][1], list[i][0]));
    }
    select_dialect.style.visibility = list[1].length == 1 ? 'hidden' : 'visible';
}

function setLanguages() {
    for (var i = 0; i < langs.length; i++) {
        select_language.options[i] = new Option(langs[i][0], i);
    }
    select_language.selectedIndex = 7;
    updateCountry();
    select_dialect.selectedIndex = 6;
    showInfo('info_start');
}
function upgrade() {
    start_button.style.visibility = 'hidden';
    showInfo('info_upgrade');
}

function linebreak(s) {
    var two_line = /\n\n/g;
    var one_line = /\n/g;
    return s.replace(two_line, '<p></p>').replace(one_line, '<br>');
}

function capitalize(s) {
    var first_char = /\S/;
    return s.replace(first_char, function (m) {
        return m.toUpperCase();
    });
}


function startButton(event) {
    if (recognizing) {
        recognition.stop();
        return;
    }
    final_transcript = '';
    recognition.lang = select_dialect.value;
    recognition.start();
    ignore_onend = false;
    final_span.innerHTML = '';
    interim_span.innerHTML = '';
    start_img.src = 'assets/images/mic-slash.gif';
    showInfo('info_allow');
    showButtons('none');
    start_timestamp = event.timeStamp;
}

function showInfo(s) {
    if (s) {
        for (var child = info.firstChild; child; child = child.nextSibling) {
            if (child.style) {
                child.style.display = child.id == s ? 'inline' : 'none';
            }
        }
        info.style.visibility = 'visible';
    } else {
        info.style.visibility = 'hidden';
    }
}

var current_style;

function showButtons(style) {
    if (style == current_style) {
        return;
    }
}