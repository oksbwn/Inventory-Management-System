<template>
  <div class="chat-container">
    <div class="chat-history" ref="chatHistory">
      <div v-for="(msg, index) in messages" :key="index" :class="msg.sender">
        <div class="msg-header">
          <strong>{{ msg.sender === 'user' ? 'You' : 'Stocky' }}</strong>
          <span class="timestamp">{{ formatTimestamp(msg.timestamp) }}</span>
        </div>
        <div
          v-if="msg.sender === 'bot' && msg.thinking"
          class="typing-animation"
        >
          <span>typing</span><span class="dot">.</span><span class="dot">.</span><span class="dot">.</span>
        </div>
        <div
          v-else-if="msg.sender === 'bot'"
          v-html="msg.parsedHtml || msg.text"
          class="msg-content"
        ></div>
        <div v-else class="msg-content">{{ msg.text }}</div>
      </div>
    </div>
    <form @submit.prevent="sendMessage" class="chat-input-form">
      <input
        v-model="input"
        placeholder="Ask me anything about stocks or just say hi..."
        autocomplete="off"
        :disabled="loading"
        @keyup.enter.ctrl="sendMessage"
      />
      <button :disabled="loading || !input.trim()" type="submit">
        {{ loading ? 'Sending...' : 'Send' }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import { marked } from 'marked'
import DOMPurify from 'dompurify'
import chatbotService from '@/api/services/chatService'

// Initialize messages with greeting
const messages = ref([
  {
    sender: 'bot',
    text: 'Hello! I am Stocky, your friendly stock assistant. How can I help you today? 😊',
    timestamp: new Date(),
    parsedHtml: null,
  },
])
const input = ref('')
const sessionId = ref(null)
const loading = ref(false)
const chatHistory = ref(null)

function formatTimestamp(date) {
  const d = new Date(date)
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

async function sendMessage() {
  const trimmedInput = input.value.trim()
  if (!trimmedInput) return

  // Add user message
  messages.value.push({ sender: 'user', text: trimmedInput, timestamp: new Date() })

  // Add thinking message
  const thinkingMsg = { sender: 'bot', text: '', thinking: true, timestamp: new Date() }
  messages.value.push(thinkingMsg)

  loading.value = true
  try {
    const response = await chatbotService.sendMessage({
      message: trimmedInput,
      sessionId: sessionId.value,
    })

    const output = response.output || 'No output'
    sessionId.value = response.sessionId || sessionId.value
    const sanitizedOutput = DOMPurify.sanitize(marked(output))
    const index = messages.value.indexOf(thinkingMsg)
    if (index !== -1) {
      messages.value[index] = {
        sender: 'bot',
        text: output,
        parsedHtml: sanitizedOutput,
        timestamp: new Date(),
      }
    }
  } catch (error) {
    const index = messages.value.indexOf(thinkingMsg)
    if (index !== -1) {
      messages.value[index] = {
        sender: 'bot',
        text: 'Sorry, I encountered an error.',
        timestamp: new Date(),
      }
    }
    console.error('Chat API error:', error)
  } finally {
    loading.value = false
    input.value = ''
    await nextTick()
    if (chatHistory.value) {
      chatHistory.value.scrollTop = chatHistory.value.scrollHeight
    }
  }
}
</script>

<style scoped>
.chat-container {
  max-width: 800px;
  height: 80vh;
  margin: 2rem auto;
  border-radius: 20px;
  padding: 1.5rem 2rem;
  background: linear-gradient(135deg, #f3f7ff 0%, #dee7ff 100%);
  display: flex;
  flex-direction: column;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  box-shadow: 0 8px 25px rgba(37, 99, 235, 0.15);
}

.chat-history {
  flex-grow: 1;
  margin-bottom: 1rem;
  overflow-y: auto;
  padding-right: 14px;
  scrollbar-width: thin;
  scrollbar-color: #7c94e0 transparent;
  border-radius: 12px;
  background: white;
  box-shadow: inset 0 0 8px rgba(37, 99, 235, 0.1);
}

.chat-history::-webkit-scrollbar {
  width: 10px;
}

.chat-history::-webkit-scrollbar-thumb {
  background-color: #7c94e0;
  border-radius: 20px;
}

.chat-history .user,
.chat-history .bot {
  margin: 12px 0;
  max-width: 75%;
  padding: 14px 20px;
  border-radius: 30px;
  box-shadow: 0 0 15px rgba(56, 154, 255, 0.12);
  font-size: 1.05rem;
  line-height: 1.5;
  word-wrap: break-word;
  white-space: pre-wrap;
  transition: background-color 0.2s ease, box-shadow 0.2s ease;
}

.chat-history .user {
  margin-left: auto;
  background-color: #2563eb;
  color: white;
  border-bottom-right-radius: 6px;
}

.chat-history .user:hover {
  background-color: #1e40af;
  box-shadow: 0 0 25px rgba(37, 99, 235, 0.3);
}

.chat-history .bot {
  margin-right: auto;
  background-color: #f5faff;
  color: #1e293b;
  border-bottom-left-radius: 6px;
}

.chat-history .bot:hover {
  background-color: #e4ecff;
  box-shadow: 0 0 20px rgba(131, 158, 215, 0.2);
}

.msg-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
  font-size: 0.85rem;
  color: #4b5563;
}

.typing-animation {
  font-style: italic;
  color: #4b5563;
  display: flex;
  align-items: center;
}

.typing-animation .dot {
  animation: blink 1.4s infinite both;
  margin-left: 3px;
  font-weight: 900;
  font-size: 1.2rem;
}

.typing-animation .dot:nth-child(2) {
  animation-delay: 0.25s;
}

.typing-animation .dot:nth-child(3) {
  animation-delay: 0.5s;
}

@keyframes blink {
  0%,
  80%,
  100% {
    opacity: 0;
  }
  40% {
    opacity: 1;
  }
}

.chat-input-form {
  display: flex;
  gap: 12px;
}

.chat-input-form input {
  flex-grow: 1;
  padding: 0.7rem 1.3rem;
  font-size: 1.15rem;
  border: 2px solid #cbd5e1;
  border-radius: 50px;
  outline-offset: 2px;
  transition: border-color 0.25s ease-in-out, box-shadow 0.25s ease-in-out;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
}

.chat-input-form input:focus {
  border-color: #2563eb;
  box-shadow: 0 0 8px rgba(37, 99, 235, 0.5);
}

.chat-input-form button {
  padding: 0 1.8rem;
  font-size: 1.15rem;
  background-color: #2563eb;
  color: white;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  user-select: none;
  box-shadow: 0 6px 15px rgba(37, 99, 235, 0.4);
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

.chat-input-form button:hover:not(:disabled) {
  background-color: #1e40af;
  box-shadow: 0 8px 25px rgba(37, 99, 235, 0.6);
}

.chat-input-form button:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
  box-shadow: none;
}
</style>
