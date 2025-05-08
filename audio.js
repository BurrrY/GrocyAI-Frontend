let mediaRecorder;
let audioChunks = [];

const startBtn = document.getElementById("start");
const stopBtn = document.getElementById("stop");
const status = document.getElementById("status");

startBtn.onclick = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  mediaRecorder = new MediaRecorder(stream);
  audioChunks = [];

  mediaRecorder.ondataavailable = e => {
    if (e.data.size > 0) audioChunks.push(e.data);
  };

  mediaRecorder.onstop = async () => {
    const blob = new Blob(audioChunks, { type: "audio/wav" });
    const formData = new FormData();
    formData.append("audio", blob, "input.wav");

    status.textContent = "⏳ Sende Audio ans Backend...";

    const res = await fetch("http://localhost:5000/upload-audio", {
      method: "POST",
      body: formData
    });

    const { reply } = await res.json();
    status.textContent = "💬 GPT-Antwort: " + reply;

    const ttsRes = await fetch("http://localhost:5000/tts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: reply })
    });

    const ttsBlob = await ttsRes.blob();
    const audioUrl = URL.createObjectURL(ttsBlob);
    const audio = new Audio(audioUrl);
    audio.play();
  };

  mediaRecorder.start();
  startBtn.disabled = true;
  stopBtn.disabled = false;
  status.textContent = "🎙️ Aufnahme läuft...";
};

stopBtn.onclick = () => {
  mediaRecorder.stop();
  startBtn.disabled = false;
  stopBtn.disabled = true;
  status.textContent = "⏳ Verarbeitung...";
};

const chat = document.getElementById("chat");

// Nutzerfrage anzeigen (optional)
const questionMsg = document.createElement("div");
questionMsg.textContent = "🗣️ Nutzer: " + userText;
chat.appendChild(questionMsg);

// GPT-Antwort anzeigen
const answerMsg = document.createElement("div");
answerMsg.textContent = "🤖 GPT: " + reply;
chat.appendChild(answerMsg);

// automatisch runterscrollen
chat.scrollTop = chat.scrollHeight;
