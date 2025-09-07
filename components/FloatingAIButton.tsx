'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bot, MessageSquare, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import AIAssistant from './AIAssistant';
import { useAppStore } from '@/lib/store';

export default function FloatingAIButton() {
  const [isOpen, setIsOpen] = useState(false);
  const { setChatOpen } = useAppStore();

  const toggleChat = () => {
    setIsOpen(!isOpen);
    setChatOpen(!isOpen);
  };

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <motion.div
              className="fixed bottom-6 right-6 z-40"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={toggleChat}
                className="h-14 w-14 rounded-full bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                size="icon"
              >
                <motion.div
                  animate={isOpen ? { rotate: 180 } : { rotate: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {isOpen ? (
                    <MessageSquare className="h-6 w-6" />
                  ) : (
                    <Bot className="h-6 w-6" />
                  )}
                </motion.div>
                
                {/* Pulsing ring animation when closed */}
                {!isOpen && (
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-blue-400"
                    animate={{ scale: [1, 1.5], opacity: [0.8, 0] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "loop",
                    }}
                  />
                )}
              </Button>

              {/* Notification dot for new AI features */}
              <motion.div
                className="absolute -top-1 -right-1 h-4 w-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles className="h-2 w-2 text-white" />
              </motion.div>
            </motion.div>
          </TooltipTrigger>
          <TooltipContent side="left" className="bg-slate-800 text-white border-slate-700">
            <p>AI Mentor - Ask me anything! 🤖</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <AIAssistant isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}