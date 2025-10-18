'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Code, BookOpen, Lightbulb, ArrowRight, CheckCircle } from 'lucide-react';
import { InteractiveCard } from '@/components/interactions/InteractiveCard';
import { InteractiveButton } from '@/components/interactions/InteractiveButton';
import { StaggerContainer, StaggerItem } from '@/components/transitions/PageTransition';
import { useReducedMotion } from '@/hooks/useAnimations';

interface ProgrammingParadigm {
  id: string;
  name: string;
  description: string;
  principles: string[];
  examples: string[];
  languages: string[];
  color: string;
  icon: string;
  interactiveExample: {
    title: string;
    code: string;
    explanation: string;
  };
  benefits: string[];
  challenges: string[];
}

const paradigms: ProgrammingParadigm[] = [
  {
    id: 'imperative',
    name: 'Imperative Programming',
    description: 'Programming paradigm that uses statements to change a program\'s state, focusing on HOW to solve a problem.',
    principles: ['Sequential Execution', 'State Changes', 'Explicit Control Flow', 'Step-by-Step Instructions'],
    examples: ['C', 'Pascal', 'Assembly', 'COBOL'],
    languages: ['C', 'Pascal', 'Assembly', 'COBOL', 'Fortran'],
    color: '#FF6B35',
    icon: '📝',
    interactiveExample: {
      title: 'Simple Calculator',
      code: `int add(int a, int b) {
    int result = a + b;
    return result;
}

int main() {
    int x = 5;
    int y = 3;
    int sum = add(x, y);
    printf("Sum: %d", sum);
    return 0;
}`,
      explanation: 'This C program demonstrates imperative programming with explicit step-by-step instructions, variable assignments, and function calls.'
    },
    benefits: ['Direct Control', 'Easy to Understand', 'Efficient Execution', 'Predictable Flow'],
    challenges: ['Complex State Management', 'Hard to Scale', 'Side Effects', 'Testing Difficulties'],
  },
  {
    id: 'object-oriented',
    name: 'Object-Oriented Programming',
    description: 'Programming paradigm based on objects that contain data and code, emphasizing encapsulation and reusability.',
    principles: ['Encapsulation', 'Inheritance', 'Polymorphism', 'Abstraction'],
    examples: ['Java', 'C++', 'Python', 'C#'],
    languages: ['Java', 'C++', 'Python', 'C#', 'Ruby', 'Smalltalk'],
    color: '#4ECDC4',
    icon: '🎯',
    interactiveExample: {
      title: 'Bank Account Class',
      code: `class BankAccount {
    private double balance;
    
    public BankAccount(double initialBalance) {
        this.balance = initialBalance;
    }
    
    public void deposit(double amount) {
        balance += amount;
    }
    
    public double getBalance() {
        return balance;
    }
}

BankAccount account = new BankAccount(1000);
account.deposit(500);
System.out.println("Balance: " + account.getBalance());`,
      explanation: 'This Java example shows OOP principles: encapsulation (private balance), methods for behavior, and object instantiation.'
    },
    benefits: ['Code Reusability', 'Modularity', 'Maintainability', 'Real-world Modeling'],
    challenges: ['Complexity', 'Performance Overhead', 'Inheritance Issues', 'Over-engineering'],
  },
  {
    id: 'functional',
    name: 'Functional Programming',
    description: 'Programming paradigm that treats computation as evaluation of mathematical functions, avoiding changing state.',
    principles: ['Pure Functions', 'Immutability', 'First-class Functions', 'No Side Effects'],
    examples: ['Haskell', 'Lisp', 'Clojure', 'F#'],
    languages: ['Haskell', 'Lisp', 'Clojure', 'F#', 'Erlang', 'Elixir'],
    color: '#45B7D1',
    icon: '🧮',
    interactiveExample: {
      title: 'List Processing',
      code: `-- Haskell example
doubleList :: [Int] -> [Int]
doubleList [] = []
doubleList (x:xs) = (x * 2) : doubleList xs

-- Using map (more functional)
doubleList' :: [Int] -> [Int]
doubleList' xs = map (*2) xs

-- Usage
numbers = [1, 2, 3, 4, 5]
doubled = doubleList' numbers  -- [2, 4, 6, 8, 10]`,
      explanation: 'This Haskell example demonstrates functional programming with pure functions, pattern matching, and higher-order functions like map.'
    },
    benefits: ['Predictable', 'Easier Testing', 'Concurrency', 'Mathematical Purity'],
    challenges: ['Learning Curve', 'Performance', 'State Management', 'Debugging'],
  },
  {
    id: 'declarative',
    name: 'Declarative Programming',
    description: 'Programming paradigm that focuses on WHAT should be accomplished rather than HOW to accomplish it.',
    principles: ['What, Not How', 'High-level Abstractions', 'Domain-specific', 'Declarative Logic'],
    examples: ['SQL', 'HTML', 'CSS', 'Prolog'],
    languages: ['SQL', 'HTML', 'CSS', 'Prolog', 'XSLT', 'Regular Expressions'],
    color: '#96CEB4',
    icon: '📋',
    interactiveExample: {
      title: 'Database Query',
      code: `-- SQL Query
SELECT name, age, department
FROM employees
WHERE age > 25 AND department = 'Engineering'
ORDER BY name ASC;

-- HTML Structure
<div class="user-card">
    <h2>{{user.name}}</h2>
    <p>{{user.email}}</p>
    <button onclick="editUser({{user.id}})">Edit</button>
</div>`,
      explanation: 'SQL and HTML are declarative - you describe what you want (all engineers over 25) rather than how to find them.'
    },
    benefits: ['Readable', 'Maintainable', 'Domain-focused', 'Less Error-prone'],
    challenges: ['Limited Control', 'Performance', 'Learning Domain', 'Debugging'],
  },
  {
    id: 'reactive',
    name: 'Reactive Programming',
    description: 'Programming paradigm focused on data streams and propagation of change, handling asynchronous data flows.',
    principles: ['Data Streams', 'Asynchronous', 'Event-driven', 'Backpressure'],
    examples: ['RxJS', 'ReactiveX', 'Akka', 'Spring WebFlux'],
    languages: ['JavaScript (RxJS)', 'Java (RxJava)', 'C# (Rx.NET)', 'Swift (RxSwift)'],
    color: '#FECA57',
    icon: '⚡',
    interactiveExample: {
      title: 'User Input Stream',
      code: `// RxJS example
import { fromEvent } from 'rxjs';
import { debounceTime, map, distinctUntilChanged } from 'rxjs/operators';

const searchInput = document.getElementById('search');

fromEvent(searchInput, 'input')
  .pipe(
    map(event => event.target.value),
    debounceTime(300),
    distinctUntilChanged()
  )
  .subscribe(searchTerm => {
    performSearch(searchTerm);
  });`,
      explanation: 'This RxJS example shows reactive programming with data streams, operators for transformation, and automatic handling of asynchronous events.'
    },
    benefits: ['Real-time', 'Scalable', 'Composable', 'Event-driven'],
    challenges: ['Complexity', 'Learning Curve', 'Debugging', 'Memory Management'],
  },
];

export const ParadigmTheater: React.FC = () => {
  const [selectedParadigm, setSelectedParadigm] = useState<ProgrammingParadigm | null>(null);
  const [activeExample, setActiveExample] = useState<boolean>(false);
  const reducedMotion = useReducedMotion();

  return (
    <div className="space-y-12">
      {/* Section Header */}
      <motion.div 
        className="text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
      >
        <div className="flex items-center justify-center gap-4 mb-6">
          <motion.div
            className="w-16 h-16 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-3xl shadow-lg"
            animate={reducedMotion ? {} : { rotate: [0, 10, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            🎭
          </motion.div>
          <div>
            <h1 className="portfolio-hero-text text-white">PARADIGM THEATER</h1>
            <p className="portfolio-large-text text-orange-400">Interactive Programming Concepts</p>
          </div>
        </div>
        
        <p className="portfolio-base-text text-gray-300 max-w-4xl mx-auto leading-relaxed">
          Step into the theater of programming paradigms. Each paradigm represents a different way of thinking 
          about problems and solutions. Explore interactive examples, understand the principles, and discover 
          how different approaches shape the way we write code.
        </p>
      </motion.div>

      {/* Paradigms Grid */}
      <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paradigms.map((paradigm, index) => (
          <StaggerItem key={paradigm.id}>
            <InteractiveCard
              variant="paradigm"
              onClick={() => setSelectedParadigm(paradigm)}
              className="group h-full"
              tilt
              glow
              delay={index * 0.1}
            >
              {/* Paradigm Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <motion.div
                    className={`w-12 h-12 rounded-lg bg-gradient-to-r ${paradigm.color} flex items-center justify-center text-xl`}
                    whileHover={reducedMotion ? {} : { scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    {paradigm.icon}
                  </motion.div>
                  <div>
                    <h3 className="portfolio-medium-text text-white">{paradigm.name}</h3>
                    <p className="portfolio-small-text text-orange-400">Programming Paradigm</p>
                  </div>
                </div>
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              </div>

              {/* Description */}
              <p className="text-gray-300 text-sm leading-relaxed mb-4 line-clamp-3">
                {paradigm.description}
              </p>

              {/* Key Principles */}
              <div className="mb-4">
                <h4 className="portfolio-small-text text-orange-400 mb-2">KEY PRINCIPLES</h4>
                <div className="flex flex-wrap gap-1">
                  {paradigm.principles.slice(0, 3).map((principle, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-orange-500/20 text-orange-300 text-xs rounded-full"
                    >
                      {principle}
                    </span>
                  ))}
                  {paradigm.principles.length > 3 && (
                    <span className="px-2 py-1 bg-gray-700/50 text-gray-400 text-xs rounded-full">
                      +{paradigm.principles.length - 3}
                    </span>
                  )}
                </div>
              </div>

              {/* Example Languages */}
              <div className="space-y-2">
                <h4 className="portfolio-small-text text-orange-400">EXAMPLE LANGUAGES</h4>
                <div className="flex flex-wrap gap-1">
                  {paradigm.languages.slice(0, 4).map((language, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-gray-700/50 text-gray-300 text-xs rounded-full"
                    >
                      {language}
                    </span>
                  ))}
                  {paradigm.languages.length > 4 && (
                    <span className="px-2 py-1 bg-gray-700/50 text-gray-400 text-xs rounded-full">
                      +{paradigm.languages.length - 4}
                    </span>
                  )}
                </div>
              </div>

              {/* Hover indicator */}
              <motion.div
                className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
                animate={reducedMotion ? {} : { x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowRight className="w-4 h-4 text-orange-400" />
              </motion.div>
            </InteractiveCard>
          </StaggerItem>
        ))}
      </StaggerContainer>

      {/* Selected Paradigm Detail Modal */}
      {selectedParadigm && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-lg flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedParadigm(null)}
        >
          <motion.div
            className="bg-black/80 backdrop-blur-lg rounded-xl p-8 max-w-6xl w-full max-h-[80vh] overflow-y-auto border border-orange-500/30"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.19, 1, 0.22, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${selectedParadigm.color} flex items-center justify-center text-3xl`}>
                  {selectedParadigm.icon}
                </div>
                <div>
                  <h2 className="portfolio-hero-text text-white">{selectedParadigm.name}</h2>
                  <p className="portfolio-large-text text-orange-400">Programming Paradigm</p>
                </div>
              </div>
              <InteractiveButton
                onClick={() => setSelectedParadigm(null)}
                variant="ghost"
                size="sm"
              >
                ✕
              </InteractiveButton>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="portfolio-medium-text text-white mb-3">DESCRIPTION</h3>
                <p className="text-gray-300 leading-relaxed">{selectedParadigm.description}</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="portfolio-medium-text text-white mb-3">KEY PRINCIPLES</h3>
                  <div className="space-y-2">
                    {selectedParadigm.principles.map((principle, index) => (
                      <motion.div
                        key={index}
                        className="flex items-center gap-3 p-3 bg-orange-500/10 rounded-lg border border-orange-500/20"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.4 }}
                      >
                        <CheckCircle className="w-4 h-4 text-orange-400" />
                        <span className="text-gray-300">{principle}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="portfolio-medium-text text-white mb-3">EXAMPLE LANGUAGES</h3>
                  <div className="space-y-2">
                    {selectedParadigm.languages.map((language, index) => (
                      <motion.div
                        key={index}
                        className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.4 }}
                      >
                        <Code className="w-4 h-4 text-orange-400" />
                        <span className="text-gray-300">{language}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Interactive Example */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="portfolio-medium-text text-white">INTERACTIVE EXAMPLE</h3>
                  <InteractiveButton
                    onClick={() => setActiveExample(!activeExample)}
                    variant="primary"
                    size="sm"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    {activeExample ? 'HIDE' : 'SHOW'} EXAMPLE
                  </InteractiveButton>
                </div>

                {activeExample && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4"
                  >
                    <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                      <h4 className="portfolio-small-text text-orange-400 mb-2">{selectedParadigm.interactiveExample.title}</h4>
                      <pre className="text-green-400 text-sm overflow-x-auto">
                        <code>{selectedParadigm.interactiveExample.code}</code>
                      </pre>
                    </div>
                    <div className="bg-orange-500/10 rounded-lg p-4 border border-orange-500/20">
                      <div className="flex items-start gap-3">
                        <Lightbulb className="w-5 h-5 text-orange-400 mt-1" />
                        <p className="text-gray-300 text-sm leading-relaxed">
                          {selectedParadigm.interactiveExample.explanation}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Benefits and Challenges */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="portfolio-medium-text text-white mb-3">BENEFITS</h3>
                  <div className="space-y-2">
                    {selectedParadigm.benefits.map((benefit, index) => (
                      <motion.div
                        key={index}
                        className="flex items-center gap-3 p-3 bg-green-500/10 rounded-lg border border-green-500/20"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.4 }}
                      >
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span className="text-gray-300">{benefit}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="portfolio-medium-text text-white mb-3">CHALLENGES</h3>
                  <div className="space-y-2">
                    {selectedParadigm.challenges.map((challenge, index) => (
                      <motion.div
                        key={index}
                        className="flex items-center gap-3 p-3 bg-red-500/10 rounded-lg border border-red-500/20"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.4 }}
                      >
                        <BookOpen className="w-4 h-4 text-red-400" />
                        <span className="text-gray-300">{challenge}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default ParadigmTheater;