'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Sparkles, Code, MessageSquare, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAppStore, useAIState, useUserStats } from '@/lib/store';
import { toast } from 'sonner';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

interface AIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AIAssistant({ isOpen, onClose }: AIAssistantProps) {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const aiState = useAIState();
  const userStats = useUserStats();
  const { addChatMessage, setAITyping } = useAppStore();

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    
    // Add user message
    addChatMessage('user', userMessage);
    setIsLoading(true);
    setAITyping(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            ...aiState.chatHistory,
            { role: 'user', content: userMessage }
          ],
          type: 'chat',
          context: { userStats }
        }),
      });

      if (!response.ok) throw new Error('Failed to get AI response');
      
      const data = await response.json();
      addChatMessage('assistant', data.message);
      
    } catch (error) {
      console.error('AI chat error:', error);
      toast.error('Failed to get AI response. Please try again.');
      addChatMessage('assistant', "I'm sorry, I'm having trouble connecting right now. Please try again in a moment! 🤖");
    } finally {
      setIsLoading(false);
      setAITyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickPrompts = [
    { icon: Code, text: "Help me with algorithms", prompt: "I need help understanding algorithms. What should I focus on for FAANG interviews?" },
    { icon: MessageSquare, text: "Practice interview", prompt: "Can you conduct a mock technical interview with me?" },
    { icon: Sparkles, text: "Study tips", prompt: "What are the best study strategies for FAANG preparation?" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: 400 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 400 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed right-4 top-4 bottom-4 w-96 z-50"
        >
          <Card className="h-full bg-slate-900/95 border-slate-700 backdrop-blur-xl shadow-2xl flex flex-col">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-700 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-blue-500 text-white">
                      <Bot className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">AI Mentor</CardTitle>
                    <p className="text-blue-100 text-sm">Your FAANG prep assistant</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="text-white hover:bg-white/20"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>

            {/* Chat Messages */}
            <CardContent className="flex-1 p-4 overflow-y-auto">
              <div className="space-y-4">
                {aiState.chatHistory.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-8"
                  >
                    <Bot className="h-12 w-12 mx-auto text-blue-400 mb-4" />
                    <h3 className="text-white font-semibold mb-2">Welcome to your AI Mentor!</h3>
                    <p className="text-slate-400 text-sm mb-6">
                      I'm here to help you master FAANG interviews. Ask me anything!
                    </p>
                    
                    <div className="space-y-2">
                      {quickPrompts.map((prompt, index) => (
                        <motion.button
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          onClick={() => {
                            setInput(prompt.prompt);
                            handleSendMessage();
                          }}
                          className="w-full flex items-center gap-2 p-3 text-left bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors text-slate-300 hover:text-white"
                        >
                          <prompt.icon className="h-4 w-4 text-blue-400" />
                          <span className="text-sm">{prompt.text}</span>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {aiState.chatHistory.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {message.role === 'assistant' && (
                      <Avatar className="h-8 w-8 mt-1">
                        <AvatarFallback className="bg-blue-500 text-white text-xs">
                          <Bot className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                    
                    <div className={`max-w-[85%] ${message.role === 'user' ? 'order-last' : ''}`}>
                      <div className={`p-3 rounded-2xl ${
                        message.role === 'user'
                          ? 'bg-blue-600 text-white ml-auto'
                          : 'bg-slate-800 text-slate-200'
                      }`}>
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 px-3">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </p>
                    </div>

                    {message.role === 'user' && (
                      <Avatar className="h-8 w-8 mt-1">
                        <AvatarFallback className="bg-slate-600 text-white text-xs">
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </motion.div>
                ))}

                {aiState.isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-3"
                  >
                    <Avatar className="h-8 w-8 mt-1">
                      <AvatarFallback className="bg-blue-500 text-white text-xs">
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-slate-800 p-3 rounded-2xl">
                      <div className="flex gap-1">
                        <motion.div
                          animate={{ opacity: [0.4, 1, 0.4] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          className="w-2 h-2 bg-slate-500 rounded-full"
                        />
                        <motion.div
                          animate={{ opacity: [0.4, 1, 0.4] }}
                          transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                          className="w-2 h-2 bg-slate-500 rounded-full"
                        />
                        <motion.div
                          animate={{ opacity: [0.4, 1, 0.4] }}
                          transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
                          className="w-2 h-2 bg-slate-500 rounded-full"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </CardContent>

            {/* Input Area */}
            <div className="p-4 border-t border-slate-700">
              <div className="flex gap-2">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about FAANG prep..."
                  className="flex-1 resize-none bg-slate-800 border-slate-600 text-white placeholder-slate-400 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={1}
                  disabled={isLoading}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!input.trim() || isLoading}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  size="sm"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}