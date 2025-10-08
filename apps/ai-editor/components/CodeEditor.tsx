import { useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import * as monaco from 'monaco-editor';

const Editor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
    </div>
  )
});

interface CodeEditorProps {
  value: string;
  onChange: (value: string | undefined) => void;
  language?: string;
  theme?: string;
  height?: string;
  options?: monaco.editor.IStandaloneEditorConstructionOptions;
}

export default function CodeEditor({
  value,
  onChange,
  language = 'typescript',
  theme = 'vs-dark',
  height = '400px',
  options = {}
}: CodeEditorProps) {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  const defaultOptions: monaco.editor.IStandaloneEditorConstructionOptions = {
    minimap: { enabled: false },
    fontSize: 14,
    lineNumbers: 'on',
    roundedSelection: false,
    scrollBeyondLastLine: false,
    automaticLayout: true,
    tabSize: 2,
    insertSpaces: true,
    wordWrap: 'on',
    formatOnPaste: true,
    formatOnType: true,
    suggestOnTriggerCharacters: true,
    acceptSuggestionOnEnter: 'on',
    ...options
  };

  const handleEditorDidMount = (editor: monaco.editor.IStandaloneCodeEditor) => {
    editorRef.current = editor;
    
    // Add React and TypeScript type definitions
    monaco.languages.typescript.typescriptDefaults.addExtraLib(
      `
      declare module 'react' {
        export interface FC<P = {}> {
          (props: P): JSX.Element | null;
        }
        export function useState<T>(initialState: T): [T, (value: T) => void];
        export function useEffect(effect: () => void, deps?: any[]): void;
        export function useRef<T>(initialValue: T): { current: T };
      }
      
      declare module '@abdalkader/ui' {
        export const Button: React.FC<{
          variant?: 'primary' | 'secondary' | 'outline';
          size?: 'sm' | 'md' | 'lg';
          children: React.ReactNode;
          onClick?: () => void;
          disabled?: boolean;
        }>;
        
        export const Input: React.FC<{
          type?: string;
          placeholder?: string;
          value?: string;
          onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
          disabled?: boolean;
        }>;
        
        export const Card: React.FC<{
          children: React.ReactNode;
          className?: string;
        }>;
      }
      `,
      'file:///node_modules/@types/react/index.d.ts'
    );

    // Configure TypeScript compiler options
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.Latest,
      allowNonTsExtensions: true,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      module: monaco.languages.typescript.ModuleKind.CommonJS,
      noEmit: true,
      esModuleInterop: true,
      jsx: monaco.languages.typescript.JsxEmit.React,
      reactNamespace: 'React',
      allowJs: true,
      typeRoots: ['node_modules/@types']
    });

    // Add keyboard shortcuts
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      // Save functionality - could trigger export
      console.log('Save triggered');
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      // Run/Preview functionality
      console.log('Run triggered');
    });
  };

  return (
    <div className="monaco-editor-container">
      <Editor
        height={height}
        language={language}
        theme={theme}
        value={value}
        onChange={onChange}
        onMount={handleEditorDidMount}
        options={defaultOptions}
        loading={
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        }
      />
    </div>
  );
}