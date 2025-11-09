const socket = io();
const chat = document.getElementById('chat');
const input = document.getElementById('input');
const sendBtn = document.getElementById('sendBtn');
const status = document.getElementById('status');

socket.on('connect', () => status.textContent = '✅ 已连接');
socket.on('disconnect', () => status.textContent = '❌ 已断开');

sendBtn.onclick = send;
input.addEventListener('keydown', e => e.key === 'Enter' && send());

function send() {
  const text = input.value.trim();
  if (!text) return;
  appendMessage('user', text);
  socket.emit('user_command', { text });
  input.value = '';
}

socket.on('agent_reply', data => appendMessage('agent', data.text));

function appendMessage(role, text) {
  const div = document.createElement('div');
  div.textContent = text;
  div.className = role === 'user'
    ? "p-2 bg-blue-100 text-blue-900 rounded-lg self-end"
    : "p-2 bg-gray-100 text-gray-800 rounded-lg self-start";
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}