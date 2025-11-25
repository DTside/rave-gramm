"use client"

import { useState, useRef, useEffect } from "react"
import { MessageCircle, X, Send, Mic, MicOff } from "lucide-react"

type Message = {
  id: number
  text: string
  isUser: boolean
  time: string
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Привет! Есть вопросы по проекту? 🚀", isUser: false, time: "12:00" }
  ])
  const [isListening, setIsListening] = useState(false)
  
  // Ссылка на объект распознавания речи
  const recognitionRef = useRef<any>(null)
  // Ссылка на конец списка сообщений (для автоскролла)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Автоскролл вниз при новом сообщении
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Логика голосового ввода
  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop()
      setIsListening(false)
      return
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    
    if (!SpeechRecognition) {
      alert("Ваш браузер не поддерживает голосовой ввод. Попробуйте Chrome.")
      return
    }

    const recognition = new SpeechRecognition()
    recognition.lang = 'ru-RU' // Русский язык
    recognition.interimResults = false // Ждем финальный результат
    recognition.maxAlternatives = 1

    recognition.onstart = () => setIsListening(true)
    
    recognition.onend = () => setIsListening(false)

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      // Добавляем текст к текущему (или заменяем)
      setInput((prev) => prev + (prev ? " " : "") + transcript)
    }

    recognitionRef.current = recognition
    recognition.start()
  }

  const sendMessage = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!input.trim()) return

    const newMessage: Message = {
      id: Date.now(),
      text: input,
      isUser: true,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    setMessages((prev) => [...prev, newMessage])
    setInput("")

    // Имитация ответа бота (заглушка)
    setTimeout(() => {
      setMessages((prev) => [...prev, {
        id: Date.now() + 1,
        text: "Сообщение получено! (Это демо-ответ)",
        isUser: false,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }])
    }, 1000)
  }

  return (
    <>
      {/* Кнопка открытия (FAB) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-2xl flex items-center justify-center transition-transform hover:scale-110 z-50"
        >
          <MessageCircle size={28} />
        </button>
      )}

      {/* Окно чата */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-[350px] h-[500px] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 dark:border-gray-800 z-50 animate-in slide-in-from-bottom-10 fade-in duration-300">
          
          {/* Хедер */}
          <div className="bg-blue-600 p-4 flex justify-between items-center text-white">
            <h3 className="font-bold">Поддержка</h3>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 rounded-full p-1">
              <X size={20} />
            </button>
          </div>

          {/* Список сообщений */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-black/50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.isUser ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${
                    msg.isUser
                      ? "bg-blue-600 text-white rounded-tr-none"
                      : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-tl-none"
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[10px] text-gray-400 mt-1 px-1">{msg.time}</span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Ввод текста */}
          <form onSubmit={sendMessage} className="p-3 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 flex items-center gap-2">
            
            {/* Кнопка Микрофона */}
            <button
              type="button"
              onClick={toggleListening}
              className={`p-2 rounded-full transition-colors ${
                isListening 
                  ? "bg-red-500 text-white animate-pulse" 
                  : "bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-blue-500"
              }`}
            >
              {isListening ? <MicOff size={20} /> : <Mic size={20} />}
            </button>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isListening ? "Говорите..." : "Сообщение..."}
              className="flex-1 bg-transparent text-sm focus:outline-none text-gray-900 dark:text-white"
            />
            
            <button 
              type="submit" 
              disabled={!input.trim()}
              className="text-blue-600 disabled:opacity-50 hover:scale-110 transition"
            >
              <Send size={24} />
            </button>
          </form>
        </div>
      )}
    </>
  )
}