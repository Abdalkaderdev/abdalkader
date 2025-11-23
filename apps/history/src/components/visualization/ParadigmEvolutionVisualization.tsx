'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Card, Badge, Button, Tabs } from '@abdalkader/ui';
import { 
  Code, 
  Cpu, 
  Layers, 
  Boxes, 
  Workflow, 
  Sparkles,
  ChevronRight,
  Play,
  Info
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface Paradigm {
  id: string;
  name: string;
  era: string;
  years: string;
  description: string;
  color: string;
  icon: React.ReactNode;
  codeExample: string;
  codeExplanation: string;
  visualMetaphor: string;
  keyCharacteristics: string[];
  exampleLanguages: string[];
}

const PARADIGMS: Paradigm[] = [
  {
    id: 'machine-code',
    name: 'Machine Code',
    era: 'The Foundation',
    years: '1940s-1950s',
    description: 'Direct binary instructions executed by the CPU. The most fundamental level of programming where every operation is a sequence of 0s and 1s.',
    color: '#8B4513',
    icon: <Cpu className="w-8 h-8" />,
    codeExample: `10101000 00000001 00000000
10100011 00000100 00000000
10101000 00000000 00000000
10100011 00000101 00000000`,
    codeExplanation: 'Binary machine code instructions. Each line represents a CPU operation: loading values, storing to memory, and performing arithmetic.',
    visualMetaphor: 'Like speaking directly to the machine in its native language - precise but extremely verbose.',
    keyCharacteristics: ['Binary representation', 'Direct CPU execution', 'Hardware-specific', 'No abstraction'],
    exampleLanguages: ['Raw binary', 'Hexadecimal']
  },
  {
    id: 'assembly',
    name: 'Assembly Language',
    era: 'The Translator',
    years: '1950s-1960s',
    description: 'Human-readable mnemonics representing machine code instructions. A thin abstraction layer making binary code more understandable.',
    color: '#4169E1',
    icon: <Layers className="w-8 h-8" />,
    codeExample: `MOV AX, 1
MOV [0x04], AX
MOV AX, 0
MOV [0x05], AX`,
    codeExplanation: 'Assembly mnemonics: MOV moves data, AX is a register, [0x04] is a memory address. Much more readable than binary!',
    visualMetaphor: 'Like using a translator - still speaking machine language, but with human-readable words.',
    keyCharacteristics: ['Mnemonic instructions', 'One-to-one with machine code', 'Register manipulation', 'Memory management'],
    exampleLanguages: ['x86 Assembly', 'ARM Assembly', 'MIPS']
  },
  {
    id: 'high-level',
    name: 'High-Level Languages',
    era: 'The Revolution',
    years: '1950s-1970s',
    description: 'Languages that abstract away hardware details, allowing programmers to focus on problem-solving rather than machine specifics.',
    color: '#9370DB',
    icon: <Code className="w-8 h-8" />,
    codeExample: `PROGRAM Hello;
BEGIN
  WRITE('Hello, World!');
END.`,
    codeExplanation: 'High-level syntax: readable keywords, structured control flow, and abstraction from hardware. One line can represent many machine instructions.',
    visualMetaphor: 'Like writing in a natural language - expressing ideas without worrying about how the machine executes them.',
    keyCharacteristics: ['Abstraction', 'Portability', 'Structured programming', 'Compiler translation'],
    exampleLanguages: ['FORTRAN', 'COBOL', 'ALGOL', 'Pascal', 'C']
  },
  {
    id: 'oop',
    name: 'Object-Oriented Programming',
    era: 'The Organization',
    years: '1970s-1990s',
    description: 'Programming paradigm based on objects containing data and methods. Enables code reuse, modularity, and modeling real-world concepts.',
    color: '#FF6347',
    icon: <Boxes className="w-8 h-8" />,
    codeExample: `class HelloWorld {
  public static void main(String[] args) {
    System.out.println("Hello, World!");
  }
}`,
    codeExplanation: 'OOP concepts: classes as blueprints, objects as instances, encapsulation of data and behavior, and message passing between objects.',
    visualMetaphor: 'Like building with LEGO blocks - reusable components that fit together to create complex structures.',
    keyCharacteristics: ['Encapsulation', 'Inheritance', 'Polymorphism', 'Abstraction'],
    exampleLanguages: ['Smalltalk', 'C++', 'Java', 'C#', 'Python']
  },
  {
    id: 'functional',
    name: 'Functional Programming',
    era: 'The Mathematical',
    years: '1950s-Present',
    description: 'Programming paradigm treating computation as evaluation of mathematical functions. Emphasizes immutability, pure functions, and declarative style.',
    color: '#32CD32',
    icon: <Workflow className="w-8 h-8" />,
    codeExample: `const hello = () => "Hello, World!";
console.log(hello());`,
    codeExplanation: 'Functional approach: functions as first-class citizens, no side effects, immutable data, and composition of pure functions.',
    visualMetaphor: 'Like mathematical equations - functions transform inputs to outputs without changing the world around them.',
    keyCharacteristics: ['Pure functions', 'Immutability', 'Higher-order functions', 'Declarative style'],
    exampleLanguages: ['Lisp', 'Haskell', 'Clojure', 'F#', 'Elixir']
  },
  {
    id: 'ai-assisted',
    name: 'AI-Assisted Programming',
    era: 'The Future',
    years: '2020s-Present',
    description: 'Programming enhanced by artificial intelligence. AI assists with code generation, debugging, optimization, and understanding complex codebases.',
    color: '#FFD700',
    icon: <Sparkles className="w-8 h-8" />,
    codeExample: `// AI generates this from natural language:
// "Create a function that greets users"

function greetUser(name: string): string {
  return \`Hello, \${name}! Welcome to the future.\`;
}`,
    codeExplanation: 'AI-assisted development: natural language to code, intelligent autocomplete, automated refactoring, and AI pair programming.',
    visualMetaphor: 'Like having an expert programmer as your pair - understanding intent, suggesting solutions, and learning from context.',
    keyCharacteristics: ['Natural language input', 'Code generation', 'Intelligent suggestions', 'Context awareness'],
    exampleLanguages: ['GitHub Copilot', 'ChatGPT', 'Claude', 'Cursor', 'Tabnine']
  }
];

export function ParadigmEvolutionVisualization() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeParadigm, setActiveParadigm] = useState<Paradigm>(PARADIGMS[0]);
  const [animatedParadigms, setAnimatedParadigms] = useState<Set<string>>(new Set());
  const [showCodeExplanation, setShowCodeExplanation] = useState(false);

  // Animate paradigm cards on scroll
  useEffect(() => {
    if (!containerRef.current) return;

    const cards = containerRef.current.querySelectorAll('.paradigm-card');
    
    cards.forEach((card, index) => {
      gsap.fromTo(card,
        {
          opacity: 0,
          y: 100,
          scale: 0.8,
          rotationX: -90
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          rotationX: 0,
          duration: 1,
          delay: index * 0.2,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
            onEnter: () => {
              const paradigmId = card.getAttribute('data-paradigm-id');
              if (paradigmId) {
                setAnimatedParadigms(prev => new Set([...prev, paradigmId]));
              }
            }
          }
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  // Animate flow between paradigms
  useEffect(() => {
    const flowLines = containerRef.current?.querySelectorAll('.flow-line');
    flowLines?.forEach((line, index) => {
      gsap.fromTo(line,
        { scaleX: 0, opacity: 0 },
        {
          scaleX: 1,
          opacity: 1,
          duration: 1.5,
          delay: index * 0.3 + 0.5,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: line,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    });
  }, []);

  const handleParadigmClick = (paradigm: Paradigm) => {
    setActiveParadigm(paradigm);
    setShowCodeExplanation(false);
  };

  return (
    <div ref={containerRef} className="w-full min-h-screen bg-gradient-to-br from-black via-gray-900 to-black py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 text-center"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-orange-500 via-yellow-400 to-orange-300 bg-clip-text text-transparent">
            Programming Paradigm Evolution
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto">
            Journey through the evolution of programming paradigms from machine code to AI-assisted development.
            Watch as each era builds upon the previous, creating new ways to think about computation.
          </p>
        </motion.div>

        {/* Paradigm Timeline */}
        <div className="relative mb-16">
          {/* Flow Lines */}
          <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-orange-500 via-yellow-400 to-orange-500 opacity-20 transform -translate-x-1/2" />
          
          {PARADIGMS.slice(0, -1).map((paradigm, index) => (
            <div
              key={`flow-${index}`}
              className="flow-line absolute left-1/2 transform -translate-x-1/2"
              style={{
                top: `${(index + 1) * 16.66}%`,
                width: '4px',
                height: '16.66%',
                background: `linear-gradient(to bottom, ${paradigm.color}, ${PARADIGMS[index + 1].color})`,
                opacity: 0.3
              }}
            />
          ))}

          {/* Paradigm Cards */}
          <div className="space-y-24">
            {PARADIGMS.map((paradigm, index) => {
              const isAnimated = animatedParadigms.has(paradigm.id);
              const isActive = activeParadigm.id === paradigm.id;
              
              return (
                <div
                  key={paradigm.id}
                  className="paradigm-card relative"
                  data-paradigm-id={paradigm.id}
                >
                  <div className={`flex items-center gap-8 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                    {/* Timeline Dot */}
                    <div className="relative flex-shrink-0 w-16 md:w-24">
                      <motion.div
                        className="absolute left-8 md:left-1/2 transform -translate-x-1/2 w-16 h-16 rounded-full border-4 border-gray-900 shadow-xl flex items-center justify-center"
                        style={{ backgroundColor: paradigm.color }}
                        animate={isAnimated ? {
                          scale: [1, 1.2, 1],
                          boxShadow: [
                            `0 0 0px ${paradigm.color}`,
                            `0 0 30px ${paradigm.color}`,
                            `0 0 0px ${paradigm.color}`
                          ]
                        } : {}}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                      >
                        <div className="text-white">
                          {paradigm.icon}
                        </div>
                      </motion.div>
                    </div>

                    {/* Paradigm Card */}
                    <motion.div
                      className="flex-1"
                      initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: '-100px' }}
                      transition={{ duration: 0.6 }}
                    >
                      <div
                        className={`cursor-pointer transition-all duration-300 rounded-lg border-2 ${
                          isActive ? 'ring-4 ring-opacity-50' : 'hover:scale-105'
                        }`}
                        onClick={() => handleParadigmClick(paradigm)}
                        style={{
                          borderColor: isActive ? paradigm.color : `${paradigm.color}80`,
                          backgroundColor: 'rgba(17, 24, 39, 0.8)',
                          boxShadow: isActive ? `0 0 30px ${paradigm.color}40` : undefined
                        }}
                      >
                        <Card className="border-0 bg-transparent">
                        <div className="p-8">
                          {/* Header */}
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <div className="flex items-center gap-3 mb-2">
                                <div
                                  className="p-3 rounded-lg"
                                  style={{ backgroundColor: `${paradigm.color}20` }}
                                >
                                  <div style={{ color: paradigm.color }}>
                                    {paradigm.icon}
                                  </div>
                                </div>
                                <div>
                                  <h3 className="text-3xl font-bold" style={{ color: paradigm.color }}>
                                    {paradigm.name}
                                  </h3>
                                  <p className="text-sm text-gray-400">{paradigm.era}</p>
                                </div>
                              </div>
                              <p className="text-gray-500 text-sm mb-2">{paradigm.years}</p>
                            </div>
                            <span
                              className="px-3 py-1 rounded-full text-sm font-semibold"
                              style={{ backgroundColor: paradigm.color, color: '#fff' }}
                            >
                              {index + 1} / {PARADIGMS.length}
                            </span>
                          </div>

                          {/* Description */}
                          <p className="text-gray-300 mb-4 text-lg">{paradigm.description}</p>

                          {/* Visual Metaphor */}
                          <div className="mb-4 p-4 rounded-lg bg-gray-800 border border-gray-700">
                            <p className="text-sm text-gray-400 italic">"{paradigm.visualMetaphor}"</p>
                          </div>

                          {/* Key Characteristics */}
                          <div className="mb-4">
                            <h4 className="text-sm font-semibold text-gray-400 mb-2">Key Characteristics:</h4>
                            <div className="flex flex-wrap gap-2">
                              {paradigm.keyCharacteristics.map((char, idx) => (
                                <Badge key={idx} variant="secondary" size="sm">
                                  {char}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          {/* Example Languages */}
                          <div>
                            <h4 className="text-sm font-semibold text-gray-400 mb-2">Example Languages:</h4>
                            <div className="flex flex-wrap gap-2">
                              {paradigm.exampleLanguages.map((lang, idx) => (
                                <Badge key={idx} variant="secondary" size="sm">
                                  {lang}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                        </Card>
                      </div>
                    </motion.div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Active Paradigm Detail Panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeParadigm.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
            className="mt-16"
          >
            <div className="border-2 rounded-lg" style={{ borderColor: activeParadigm.color, backgroundColor: 'rgba(17, 24, 39, 0.9)' }}>
              <Card className="border-0 bg-transparent">
              <div className="p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div
                      className="p-4 rounded-lg"
                      style={{ backgroundColor: `${activeParadigm.color}20` }}
                    >
                      <div style={{ color: activeParadigm.color }}>
                        {activeParadigm.icon}
                      </div>
                    </div>
                    <div>
                      <h2 className="text-4xl font-bold mb-2" style={{ color: activeParadigm.color }}>
                        {activeParadigm.name}
                      </h2>
                      <p className="text-gray-400">{activeParadigm.era} • {activeParadigm.years}</p>
                    </div>
                  </div>
                  <Button
                    variant="secondary"
                    onClick={() => setShowCodeExplanation(!showCodeExplanation)}
                    className="flex items-center gap-2"
                  >
                    {showCodeExplanation ? <Info className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    {showCodeExplanation ? 'Hide' : 'Show'} Explanation
                  </Button>
                </div>

                {/* Code Example */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-semibold text-gray-300 flex items-center gap-2">
                      <Code className="w-5 h-5" style={{ color: activeParadigm.color }} />
                      Code Example
                    </h3>
                  </div>
                  <div className="relative">
                    <pre className="bg-gray-800 p-6 rounded-lg overflow-x-auto border border-gray-700">
                      <code className="text-sm text-gray-300 font-mono">{activeParadigm.codeExample}</code>
                    </pre>
                    <AnimatePresence>
                      {showCodeExplanation && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-4 p-4 rounded-lg bg-gray-800 border border-gray-700"
                        >
                          <p className="text-gray-300 text-sm">{activeParadigm.codeExplanation}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Evolution Flow */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {PARADIGMS.map((paradigm, index) => {
                    const isCurrent = paradigm.id === activeParadigm.id;
                    const isPast = index < PARADIGMS.findIndex(p => p.id === activeParadigm.id);
                    const isFuture = index > PARADIGMS.findIndex(p => p.id === activeParadigm.id);

                    return (
                      <motion.div
                        key={paradigm.id}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          isCurrent ? 'scale-105' : 'hover:scale-102'
                        }`}
                        style={{
                          borderColor: isCurrent ? paradigm.color : `${paradigm.color}40`,
                          backgroundColor: isCurrent ? `${paradigm.color}10` : 'rgba(17, 24, 39, 0.5)',
                          opacity: isCurrent ? 1 : isPast ? 0.7 : 0.5
                        }}
                        onClick={() => handleParadigmClick(paradigm)}
                        whileHover={{ scale: 1.05 }}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: paradigm.color }}
                          />
                          <span className="text-sm font-semibold text-gray-300">{paradigm.name}</span>
                        </div>
                        {isPast && (
                          <ChevronRight className="w-4 h-4 text-gray-500 mt-1" />
                        )}
                        {isCurrent && (
                          <span className="text-xs text-gray-400">Current</span>
                        )}
                        {isFuture && (
                          <span className="text-xs text-gray-500">Future</span>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>
              </Card>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

