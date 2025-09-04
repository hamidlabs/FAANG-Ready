'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import { Play, Square, RotateCcw, Sparkles, Code, Terminal, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAppStore } from '@/lib/store';
import { toast } from 'sonner';

// Dynamically import Monaco Editor to avoid SSR issues
const Editor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

interface CodePlaygroundProps {
  isOpen: boolean;
  onClose: () => void;
  initialCode?: string;
  language?: string;
  problemTitle?: string;
}

const STARTER_TEMPLATES = {
  javascript: `// Two Sum - LeetCode #1
// Given an array of integers nums and an integer target,
// return indices of the two numbers such that they add up to target.

function twoSum(nums, target) {
    // Your solution here
    
    return [];
}

// Test cases
console.log(twoSum([2,7,11,15], 9)); // Expected: [0,1]
console.log(twoSum([3,2,4], 6));     // Expected: [1,2]
console.log(twoSum([3,3], 6));       // Expected: [0,1]`,

  python: `# Two Sum - LeetCode #1
# Given an array of integers nums and an integer target,
# return indices of the two numbers such that they add up to target.

def two_sum(nums, target):
    # Your solution here
    
    return []

# Test cases
print(two_sum([2,7,11,15], 9))  # Expected: [0,1]
print(two_sum([3,2,4], 6))      # Expected: [1,2] 
print(two_sum([3,3], 6))        # Expected: [0,1]`,

  java: `// Two Sum - LeetCode #1
// Given an array of integers nums and an integer target,
// return indices of the two numbers such that they add up to target.

public class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Your solution here
        
        return new int[0];
    }
    
    public static void main(String[] args) {
        Solution sol = new Solution();
        
        // Test cases
        System.out.println(Arrays.toString(sol.twoSum(new int[]{2,7,11,15}, 9))); // Expected: [0,1]
        System.out.println(Arrays.toString(sol.twoSum(new int[]{3,2,4}, 6)));     // Expected: [1,2]
        System.out.println(Arrays.toString(sol.twoSum(new int[]{3,3}, 6)));       // Expected: [0,1]
    }
}`,
};

export default function CodePlayground({ 
  isOpen, 
  onClose, 
  initialCode, 
  language: initialLanguage = 'javascript',
  problemTitle = 'Coding Practice'
}: CodePlaygroundProps) {
  const [code, setCode] = useState(initialCode || STARTER_TEMPLATES[initialLanguage as keyof typeof STARTER_TEMPLATES]);
  const [language, setLanguage] = useState(initialLanguage);
  const [output, setOutput] = useState<string>('');
  const [isRunning, setIsRunning] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const editorRef = useRef<any>(null);
  const { earnXP } = useAppStore();

  const runCode = async () => {
    setIsRunning(true);
    setOutput('Running code...');

    try {
      // Simulate code execution (in a real app, you'd send this to a code execution service)
      setTimeout(() => {
        if (language === 'javascript') {
          try {
            // Create a safe execution environment
            const logs: string[] = [];
            const mockConsole = {
              log: (...args: any[]) => logs.push(args.join(' ')),
              error: (...args: any[]) => logs.push('ERROR: ' + args.join(' ')),
            };
            
            // Replace console with mock console
            const codeToRun = code.replace(/console\./g, 'mockConsole.');
            
            // Execute code (Note: In production, use a secure sandbox)
            const func = new Function('mockConsole', codeToRun);
            func(mockConsole);
            
            setOutput(logs.join('\\n') || 'Code executed successfully (no output)');
            
            // Award XP for running code
            earnXP(20, 'Code execution');
            toast.success('+20 XP for running code! 🚀');
            
          } catch (error) {
            setOutput(`Error: ${(error as Error).message}`);
          }
        } else {
          setOutput(`${language} execution simulated. In a real environment, this would run on a secure server.\\n\\nYour code looks good! Keep practicing! 💪`);
          earnXP(15, 'Code practice');
          toast.success('+15 XP for coding practice! 🎯');
        }
        setIsRunning(false);
      }, 1500);
      
    } catch (error) {
      setOutput(`Execution error: ${(error as Error).message}`);
      setIsRunning(false);
    }
  };

  const resetCode = () => {
    setCode(STARTER_TEMPLATES[language as keyof typeof STARTER_TEMPLATES]);
    setOutput('');
  };

  const copyCode = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success('Code copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const getAIHint = async () => {
    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{
            role: 'user',
            content: `I'm working on this ${language} code. Can you give me a hint to improve it?\\n\\n${code}`
          }],
          type: 'hint',
          context: { problem: problemTitle, userAttempt: code }
        }),
      });

      const data = await response.json();
      toast.info('AI Hint', {
        description: data.message.slice(0, 100) + '...',
        duration: 8000,
      });
    } catch (error) {
      toast.error('Failed to get AI hint. Please try again.');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[90vh] bg-slate-900 border-slate-700 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Code className="h-6 w-6 text-blue-400" />
            {problemTitle}
            <Badge variant="outline" className="ml-2 text-xs">
              Interactive Playground
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 flex gap-4 mt-4">
          {/* Code Editor Section */}
          <div className="flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <Tabs value={language} onValueChange={setLanguage}>
                <TabsList className="bg-slate-800">
                  <TabsTrigger value="javascript" className="text-yellow-400">JavaScript</TabsTrigger>
                  <TabsTrigger value="python" className="text-blue-400">Python</TabsTrigger>
                  <TabsTrigger value="java" className="text-red-400">Java</TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={getAIHint}
                  className="bg-purple-600 hover:bg-purple-700 border-purple-500 text-white"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  AI Hint
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyCode}
                  className="bg-slate-700 hover:bg-slate-600 border-slate-600 text-white"
                >
                  {copied ? (
                    <Check className="h-4 w-4 mr-2 text-green-400" />
                  ) : (
                    <Copy className="h-4 w-4 mr-2" />
                  )}
                  {copied ? 'Copied!' : 'Copy'}
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetCode}
                  className="bg-slate-700 hover:bg-slate-600 border-slate-600 text-white"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
              </div>
            </div>

            <Card className="flex-1 bg-slate-800 border-slate-700">
              <CardContent className="p-0 h-full">
                <Editor
                  height="100%"
                  language={language}
                  value={code}
                  onChange={(value) => setCode(value || '')}
                  onMount={(editor) => (editorRef.current = editor)}
                  theme="vs-dark"
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: 'on',
                    wordWrap: 'on',
                    automaticLayout: true,
                    scrollBeyondLastLine: false,
                    padding: { top: 16, bottom: 16 },
                  }}
                />
              </CardContent>
            </Card>

            <div className="flex gap-2 mt-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={runCode}
                  disabled={isRunning}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  {isRunning ? (
                    <>
                      <Square className="h-4 w-4 mr-2" />
                      Running...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Run Code
                    </>
                  )}
                </Button>
              </motion.div>
            </div>
          </div>

          {/* Output Section */}
          <div className="w-1/3 flex flex-col">
            <Card className="flex-1 bg-slate-800 border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Terminal className="h-4 w-4 text-green-400" />
                  Output
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="h-full">
                  <pre className="text-sm font-mono text-green-400 whitespace-pre-wrap overflow-auto h-full bg-black/50 p-4 rounded">
                    {output || 'Click "Run Code" to see output...'}
                  </pre>
                </div>
              </CardContent>
            </Card>

            {/* Algorithm Hints */}
            <Card className="mt-4 bg-slate-800 border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-blue-400">💡 Algorithm Hints</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-slate-400 space-y-2">
                  <div>🎯 <strong>Time Complexity:</strong> Aim for O(n) or better</div>
                  <div>🧠 <strong>Space Complexity:</strong> Consider trade-offs</div>
                  <div>✅ <strong>Edge Cases:</strong> Test empty arrays, duplicates</div>
                  <div>🚀 <strong>Optimization:</strong> Hash maps are your friend!</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}