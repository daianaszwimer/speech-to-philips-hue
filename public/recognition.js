document.addEventListener('DOMContentLoaded', speechToLight, false)

let listening = false;
let recognition;
const toggle = () => {
  if (listening) {
    recognition.stop();
    listening = false;
    document.getElementById("toggle").innerText = "Not listening";
  } else {
    recognition.start();
    listening = true;
    document.getElementById("toggle").innerText = "Listening";
  }
  console.log("listening", listening);
}

function speechToLight() {
  recognition = new webkitSpeechRecognition()
  recognition.lang = 'es-419'

  recognition.onresult = function(event) {
    const results = event.results
    const transcript = results[results.length-1][0].transcript
    console.log(transcript);
    fetch(`http://localhost:3000/lights`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: transcript
      }),
    })
        .then((response) => response.json())
        .then((result) => {
          console.log(result, "RESULT");
        })
        .catch((e) => {
          console.error('Request error -> ', e)
          recognition.abort()
        })
  }
}