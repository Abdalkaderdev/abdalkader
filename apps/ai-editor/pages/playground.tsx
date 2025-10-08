import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FiDownload, FiCopy, FiPlay, FiHome } from 'react-icons/fi';
import Link from 'next/link';
import CodeEditor from '../components/CodeEditor';
import ComponentPreview from '../components/ComponentPreview';
import { useLivePreview } from '../hooks/useLivePreview';

const defaultCode = `import React, { useState } from 'react';
import { Button, Input, Card } from '@abdalkader/ui';

function PreviewComponent() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('');

  return (
    <Card className="max-w-md mx-auto">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-center">
          Component Playground
        </h2>
        
        <div className="space-y-2">
          <Input
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <p className="text-sm text-gray-600">
            {name ? \`Hello, \${name}!\` : 'Enter your name above'}
          </p>
        </div>
        
        <div className="text-center space-y-2">
          <p className="text-lg">Count: {count}</p>
          <div className="flex gap-2 justify-center">
            <Button 
              variant="outline" 
              onClick={() => setCount(count - 1)}
            >
              -
            </Button>
            <Button 
              variant="primary" 
              onClick={() => setCount(count + 1)}
            >
              +
            </Button>
          </div>
        </div>
        
        <Button 
          variant="secondary" 
          onClick={() => {
            setCount(0);
            setName('');
          }}
          className="w-full"
        >
          Reset
        </Button>
      </div>
    </Card>
  );
}`;

export default function Playground() {
  const [code, setCode] = useState(defaultCode);
  const [copySuccess, setCopySuccess] = useState(false);

  const { isLoading, error, refresh } = useLivePreview({
    code,
    delay: 1000,
    onError: (error) => console.error('Preview error:', error),
    onSuccess: () => console.log('Preview updated successfully')
  });

  const handleCodeChange = useCallback((value: string | undefined) => {
    setCode(value || '');
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/typescript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'component.tsx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const loadExample = (exampleCode: string) => {
    setCode(exampleCode);
  };

  const examples = [
    {
      name: 'Button Variants',
      code: `import React from 'react';
import { Button } from '@abdalkader/ui';

function PreviewComponent() {
  return (
    <div className="space-y-4 p-6">
      <h2 className="text-xl font-bold mb-4">Button Variants</h2>
      <div className="flex flex-wrap gap-3">
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
      </div>
      <div className="flex flex-wrap gap-3">
        <Button size="sm">Small</Button>
        <Button size="md">Medium</Button>
        <Button size="lg">Large</Button>
      </div>
      <div className="flex flex-wrap gap-3">
        <Button disabled>Disabled</Button>
        <Button variant="primary" disabled>Primary Disabled</Button>
      </div>
    </div>
  );
}`
    },
    {
      name: 'Form Example',
      code: `import React, { useState } from 'react';
import { Button, Input, Card } from '@abdalkader/ui';

function PreviewComponent() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Form submitted!');
  };

  return (
    <Card className="max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-2xl font-bold text-center">Sign Up</h2>
        
        <Input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
        />
        
        <Input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({...formData, password: e.target.value})}
        />
        
        <Input
          type="password"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
        />
        
        <Button type="submit" variant="primary" className="w-full">
          Create Account
        </Button>
      </form>
    </Card>
  );
}`
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">
                <FiHome className="w-5 h-5" />
                <span>Home</span>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Component Playground
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
              >
                <FiCopy className="w-4 h-4" />
                {copySuccess ? 'Copied!' : 'Copy'}
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
              >
                <FiDownload className="w-4 h-4" />
                Download
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Code Editor */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Code Editor
              </h2>
              <div className="flex items-center gap-2">
                <select
                  onChange={(e) => {
                    const example = examples.find(ex => ex.name === e.target.value);
                    if (example) loadExample(example.code);
                  }}
                  className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  defaultValue=""
                >
                  <option value="" disabled>Load Example</option>
                  {examples.map((example) => (
                    <option key={example.name} value={example.name}>
                      {example.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <CodeEditor
              value={code}
              onChange={handleCodeChange}
              height="600px"
              language="typescript"
              theme="vs-dark"
            />
          </div>

          {/* Preview */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Live Preview
            </h2>
            
            <ComponentPreview
              code={code}
              isLoading={isLoading}
              error={error}
              onRefresh={refresh}
            />

            {/* Component Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
            >
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                Available Components
              </h3>
              <div className="grid grid-cols-1 gap-2 text-sm">
                <div className="flex items-center justify-between py-1">
                  <span className="text-gray-600 dark:text-gray-400">Button</span>
                  <span className="text-xs text-gray-500">variant, size, disabled</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-gray-600 dark:text-gray-400">Input</span>
                  <span className="text-xs text-gray-500">type, placeholder, value</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-gray-600 dark:text-gray-400">Card</span>
                  <span className="text-xs text-gray-500">className, children</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}