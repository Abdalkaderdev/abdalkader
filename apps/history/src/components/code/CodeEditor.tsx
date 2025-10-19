'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Language } from '@/lib/types/language';

// Dynamically import Monaco Editor to avoid SSR issues
const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => (
    <div className="h-96 bg-slate-800 rounded-lg flex items-center justify-center">
      <div className="text-slate-400">Loading editor...</div>
    </div>
  )
});

interface CodeEditorProps {
  language: Language | null;
  code: string;
  onCodeChange: (code: string) => void;
}

export function CodeEditor({ language, code, onCodeChange }: CodeEditorProps) {
  const [editorTheme, setEditorTheme] = useState('vs-dark');

  // Map language names to Monaco language IDs
  const getMonacoLanguage = (languageName: string): string => {
    const languageMap: Record<string, string> = {
      'C': 'c',
      'C++': 'cpp',
      'C#': 'csharp',
      'Java': 'java',
      'JavaScript': 'javascript',
      'TypeScript': 'typescript',
      'Python': 'python',
      'Go': 'go',
      'Rust': 'rust',
      'PHP': 'php',
      'Ruby': 'ruby',
      'Swift': 'swift',
      'Kotlin': 'kotlin',
      'FORTRAN': 'fortran',
      'COBOL': 'cobol',
      'LISP': 'lisp',
      'ALGOL': 'algol',
      'Pascal': 'pascal',
      'Smalltalk': 'smalltalk',
      'Perl': 'perl',
    };
    
    return languageMap[languageName] || 'plaintext';
  };

  const handleEditorDidMount = (editor: any, monaco: any) => {
    // Configure editor options
    editor.updateOptions({
      fontSize: 14,
      lineHeight: 20,
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      automaticLayout: true,
    });

    // Add custom theme
    monaco.editor.defineTheme('museum-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6A9955' },
        { token: 'keyword', foreground: '569CD6' },
        { token: 'string', foreground: 'CE9178' },
        { token: 'number', foreground: 'B5CEA8' },
        { token: 'identifier', foreground: 'D4D4D4' },
      ],
      colors: {
        'editor.background': '#1e293b',
        'editor.foreground': '#f1f5f9',
        'editorLineNumber.foreground': '#64748b',
        'editorLineNumber.activeForeground': '#f1f5f9',
        'editor.selectionBackground': '#7c3aed',
        'editor.selectionHighlightBackground': '#7c3aed20',
        'editorCursor.foreground': '#f1f5f9',
        'editorIndentGuide.background': '#334155',
        'editorIndentGuide.activeBackground': '#64748b',
      },
    });

    setEditorTheme('museum-dark');
  };

  if (!language) {
    return (
      <div className="h-96 bg-slate-800 rounded-lg flex items-center justify-center border border-slate-600">
        <div className="text-center text-slate-400">
          <div className="text-4xl mb-2">📝</div>
          <div>Select a programming language to start coding</div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-96 border border-slate-600 rounded-lg overflow-hidden">
      <MonacoEditor
        height="100%"
        language={getMonacoLanguage(language.name)}
        value={code}
        onChange={(value) => onCodeChange(value || '')}
        onMount={handleEditorDidMount}
        theme={editorTheme}
        options={{
          selectOnLineNumbers: true,
          roundedSelection: false,
          readOnly: false,
          cursorStyle: 'line',
          automaticLayout: true,
          fontSize: 14,
          lineHeight: 20,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          wordWrap: 'on',
          wrappingIndent: 'indent',
        }}
      />
    </div>
  );
}
