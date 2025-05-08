const chatBox = document.getElementById("chat");
const input = document.getElementById("userInput");
const sendBtn = document.getElementById("send");

sendBtn.onclick = async () => {
  const text = input.value.trim();
  if (!text) return;

  addMessage("🧑", text);
  input.value = "";

  const res = await fetch(API_URL+"/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, session: "default" })
  });

  const { reply } = await res.json();
  addMessage("🤖", reply);
};

function addMessage(sender, text) {
  const div = document.createElement("div");
  div.innerHTML = `<strong>${sender}</strong>: ${text}`;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}
