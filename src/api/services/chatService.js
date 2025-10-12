import apiClient from '../config'

export default {
  sendMessage(data) {
    // POST user message and optional sessionId to chatbot endpoint
    return apiClient.post('/webhook/chat', data)
  }
}
