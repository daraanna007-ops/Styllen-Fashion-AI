import React, { useState, useEffect, useRef } from 'react';
import { Send, User, Sparkles } from 'lucide-react';
import { Message } from '../types';
import { generateFashionAdvice } from '../services/gemini';

const FashionChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'model',
      text: "Hello! I'm Styllen. Are you looking for an outfit for a specific occasion, or do you need advice on a current trend?",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    const responseText = await generateFashionAdvice(
      messages.map(m => ({ role: m.role, text: m.text })),
      userMessage.text
    );

    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: responseText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, aiMessage]);
    setIsLoading(false);
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm pb-4">
      {/* Chat Header */}
      <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
        <span className="font-medium text-slate-700">Styllen Assistant Online</span>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-slate-50/50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl p-4 shadow-sm ${
                msg.role === 'user'
                  ? 'bg-purple-600 text-white rounded-br-sm'
                  : 'bg-white text-slate-800 rounded-bl-sm border border-slate-200'
              }`}
            >
              <div className="flex items-center gap-2 mb-1 opacity-70">
                {msg.role === 'user' ? <User size={12} /> : <Sparkles size={12} />}
                <span className="text-xs uppercase tracking-wider font-bold">
                  {msg.role === 'user' ? 'You' : 'Styllen'}
                </span>
              </div>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white rounded-2xl p-4 rounded-bl-sm flex gap-1 border border-slate-200 shadow-sm">
              <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-slate-200">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about outfits, trends, or color combinations..."
            className="flex-1 bg-slate-50 border border-slate-200 rounded-full px-6 py-3 text-sm focus:outline-none focus:border-purple-500 transition-colors text-slate-900 placeholder-slate-400"
            autoFocus
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !inputValue.trim()}
            className="bg-purple-600 hover:bg-purple-500 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white p-3 rounded-full transition-all shadow-md"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FashionChat;