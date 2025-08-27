'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Mode = 'roast' | 'toast';
type Message = { text: string; isUser: boolean; id: string };

export default function RoastToastWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<Mode>('roast');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedMode = localStorage.getItem('roastToastMode') as Mode;
    if (savedMode) setMode(savedMode);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = { text: input.trim(), isUser: true, id: Date.now().toString() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/roast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: userMessage.text, mode }),
      });
      const data = await res.json();
      const botMessage: Message = { text: data.output, isUser: false, id: (Date.now() + 1).toString() };
      setMessages(prev => [...prev, botMessage]);
    } catch {
      const errorMessage: Message = { text: 'Oops! Something went wrong. Try again!', isUser: false, id: (Date.now() + 1).toString() };
      setMessages(prev => [...prev, errorMessage]);
    }
    setLoading(false);
  };

  const toggleMode = () => {
    const newMode = mode === 'roast' ? 'toast' : 'roast';
    setMode(newMode);
    localStorage.setItem('roastToastMode', newMode);
  };

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 w-14 h-14 ${mode === 'roast' ? 'bg-red-500' : 'bg-green-500'} rounded-full shadow-lg flex items-center justify-center text-2xl z-50`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {mode === 'roast' ? '🔥' : '💖'}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-24 right-6 w-80 sm:w-96 h-96 bg-white rounded-xl shadow-2xl flex flex-col z-50"
          >
            <div className={`flex items-center justify-between p-4 ${mode === 'roast' ? 'bg-red-500' : 'bg-green-500'} text-white rounded-t-xl`}>
              <h3 className="font-bold">
                {mode === 'roast' ? '🔥 Roast Bot' : '💖 Toast Bot'}
              </h3>
              <div className="flex gap-2">
                <button onClick={toggleMode} className="text-white/80 hover:text-white">
                  {mode === 'roast' ? '💖' : '🔥'}
                </button>
                <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white text-xl">
                  ✖
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                    msg.isUser 
                      ? 'bg-blue-500 text-white' 
                      : mode === 'roast' 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-green-100 text-green-800'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className={`px-3 py-2 rounded-lg text-sm ${mode === 'roast' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                    Thinking...
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={sendMessage} className="p-4 border-t">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type anything..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  className={`px-4 py-2 ${mode === 'roast' ? 'bg-red-500' : 'bg-green-500'} text-white rounded-lg disabled:opacity-50`}
                >
                  Send
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}