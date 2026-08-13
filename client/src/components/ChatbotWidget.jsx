import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { dataService } from "../services/dataService";
import {
  FaRobot,
  FaPaperPlane,
  FaTimes,
  FaMinus,
  FaRedo,
  FaGraduationCap,
  FaExclamationTriangle,
  FaCompass,
  FaEnvelope,
  FaUser,
} from "react-icons/fa";

export default function ChatbotWidget() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hello! 👋 I am the **OpportunityBridge AI Assistant** for the Faculty of Technology, University of Ruhuna.\n\nHow can I help you today? You can ask me about scholarships, internships, job listings, or reporting access barriers!",
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isTyping, isOpen]);

  // Hide chatbot on admin pages if desired (or show everywhere)
  if (location.pathname.startsWith("/admin")) {
    return null;
  }

  const handleSendMessage = async (textToSend) => {
    const text = textToSend || inputMessage.trim();
    if (!text || isTyping) return;

    const userMessage = { role: "user", content: text };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    if (!textToSend) setInputMessage("");
    setIsTyping(true);

    try {
      // Send conversation history to Groq API via dataService
      const aiReply = await dataService.sendChatMessage(updatedMessages);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: aiReply },
      ]);
    } catch (err) {
      console.error("AI Chatbot Error:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I apologize, I experienced a brief connection hiccup. Please feel free to ask your question again!",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickPrompt = (promptText) => {
    handleSendMessage(promptText);
  };

  const handleResetChat = () => {
    setMessages([
      {
        role: "assistant",
        content:
          "Chat reset! I am the **OpportunityBridge AI Assistant**. Ask me anything about faculty opportunities, scholarships, or reporting accessibility issues!",
      },
    ]);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      
      {/* FLOATING ACTION TRIGGER BUTTON */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="relative py-3.5 px-5 rounded-full bg-gradient-to-r from-blue-700 via-indigo-600 to-rose-600 text-white font-extrabold text-xs shadow-2xl border-2 border-blue-300 shadow-blue-500/30 flex items-center space-x-3 transition-all transform hover:scale-105 cursor-pointer font-outfit group"
          title="Open OpportunityBridge AI Assistant"
        >
          {/* Glowing pulse ring */}
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-rose-500 border-2 border-white"></span>
          </span>

          <div className="w-9 h-9 rounded-full bg-white text-blue-700 flex items-center justify-center font-bold shadow-md group-hover:rotate-12 transition-transform">
            <FaRobot className="text-lg text-blue-700" />
          </div>

          <div className="flex flex-col text-left leading-tight">
            <span className="text-[9px] text-blue-200 uppercase tracking-widest font-mono font-bold">24/7 AI Guide</span>
            <span className="text-xs font-black text-white font-outfit">Opportunity AI Chat</span>
          </div>
        </button>
      )}

      {/* CHATBOT FLOATING WINDOW */}
      {isOpen && (
        <div className="w-[360px] sm:w-[400px] h-[520px] bg-white rounded-3xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          
          {/* HEADER */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-rose-950 p-4 text-white flex items-center justify-between shadow-md shrink-0">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 to-rose-500 p-0.5 shadow-md shrink-0">
                <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center">
                  <FaRobot className="text-amber-400 text-lg" />
                </div>
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center space-x-2">
                  <h3 className="font-extrabold text-sm font-outfit text-white">
                    Opportunity<span className="text-amber-400">Bridge</span> AI
                  </h3>
                  <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[8px] font-mono font-bold uppercase tracking-wider border border-emerald-500/30">
                    Groq Llama 3
                  </span>
                </div>
                <p className="text-[10px] text-slate-300 flex items-center space-x-1 font-mono">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>Faculty AI Guide • Online</span>
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-1">
              <button
                type="button"
                onClick={handleResetChat}
                className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title="Reset Conversation"
              >
                <FaRedo className="text-xs" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title="Minimize Chat"
              >
                <FaTimes className="text-sm" />
              </button>
            </div>
          </div>

          {/* QUICK PROMPT PILLS HEADER */}
          <div className="bg-slate-50 border-b border-slate-200 px-3 py-2 flex items-center space-x-1.5 overflow-x-auto scrollbar-none shrink-0 text-[11px] font-semibold">
            <button
              onClick={() => handleQuickPrompt("How do I find and apply for scholarships?")}
              className="px-2.5 py-1 rounded-full bg-white hover:bg-blue-50 text-blue-700 border border-blue-200 transition-colors shrink-0 flex items-center space-x-1 cursor-pointer"
            >
              <FaGraduationCap />
              <span>Scholarships</span>
            </button>
            <button
              onClick={() => handleQuickPrompt("Are there tech internships available for IT students?")}
              className="px-2.5 py-1 rounded-full bg-white hover:bg-amber-50 text-amber-800 border border-amber-200 transition-colors shrink-0 flex items-center space-x-1 cursor-pointer"
            >
              <FaCompass />
              <span>Internships</span>
            </button>
            <button
              onClick={() => handleQuickPrompt("How do I report an access barrier on campus?")}
              className="px-2.5 py-1 rounded-full bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 transition-colors shrink-0 flex items-center space-x-1 cursor-pointer"
            >
              <FaExclamationTriangle />
              <span>Report Barrier</span>
            </button>
          </div>

          {/* MESSAGES BODY */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex items-start space-x-2.5 ${
                  msg.role === "user" ? "flex-row-reverse space-x-reverse" : "flex-row"
                }`}
              >
                {/* Avatar */}
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-slate-900 text-amber-400"
                  }`}
                >
                  {msg.role === "user" ? <FaUser /> : <FaRobot />}
                </div>

                {/* Message Bubble */}
                <div
                  className={`max-w-[78%] p-3 rounded-2xl text-xs space-y-1 shadow-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white font-medium rounded-tr-none"
                      : "bg-white text-slate-800 border border-slate-200 rounded-tl-none"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}

            {/* TYPING INDICATOR */}
            {isTyping && (
              <div className="flex items-center space-x-2 text-slate-500 text-xs italic font-mono pt-1">
                <div className="w-7 h-7 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center text-xs">
                  <FaRobot />
                </div>
                <div className="bg-white px-3 py-2 rounded-2xl border border-slate-200 flex items-center space-x-1 shadow-sm">
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-rose-600 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* INPUT FORM */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white border-t border-slate-200 flex items-center space-x-2 shrink-0"
          >
            <input
              type="text"
              placeholder="Ask OpportunityBridge AI..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-1 bg-slate-50 text-slate-900 px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:bg-white focus:outline-none focus:border-blue-500 font-sans"
            />

            <button
              type="submit"
              disabled={!inputMessage.trim() || isTyping}
              className={`p-2.5 rounded-xl text-white transition-all cursor-pointer ${
                inputMessage.trim() && !isTyping
                  ? "bg-blue-600 hover:bg-blue-700 shadow-md"
                  : "bg-slate-300 cursor-not-allowed"
              }`}
            >
              <FaPaperPlane className="text-xs" />
            </button>
          </form>

        </div>
      )}

    </div>
  );
}
