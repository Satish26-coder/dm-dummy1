import React, { useState, useRef, useEffect } from 'react';

interface CodeEditorProps {
  code: string;
  onChange: (value: string) => void;
  language: string;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ code, onChange, language }) => {
  const [lineCount, setLineCount] = useState(1);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const lines = code.split('\n').length;
    setLineCount(Math.max(lines, 1));
  }, [code]);

  const handleScroll = () => {
    if (textareaRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;
      const value = e.currentTarget.value;
      const newValue = value.substring(0, start) + '  ' + value.substring(end);
      onChange(newValue);
      
      // Need to defer setting selection range
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 2;
        }
      }, 0);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0d1117] font-mono text-sm relative overflow-hidden rounded-b-lg">
      <div className="flex flex-1 relative overflow-hidden">
        {/* Line Numbers */}
        <div 
          ref={lineNumbersRef}
          className="w-12 flex-shrink-0 bg-[#0d1117] text-slate-600 text-right pr-3 pt-4 select-none overflow-hidden border-r border-slate-800"
          style={{ fontFamily: '"JetBrains Mono", monospace' }}
        >
          {Array.from({ length: lineCount }).map((_, i) => (
            <div key={i} className="leading-6">{i + 1}</div>
          ))}
        </div>

        {/* Text Area behaving like code editor */}
        <textarea
          ref={textareaRef}
          value={code}
          onChange={(e) => onChange(e.target.value)}
          onScroll={handleScroll}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent text-slate-200 p-4 pt-4 outline-none resize-none whitespace-pre leading-6 w-full h-full"
          spellCheck={false}
          style={{ 
            fontFamily: '"JetBrains Mono", monospace',
            tabSize: 2,
          }}
        />
      </div>
      
      <div className="bg-slate-900 text-xs text-slate-500 px-4 py-1 border-t border-slate-800 flex justify-between">
        <span>{language.toUpperCase()}</span>
        <span>Ln {lineCount}, Col 1</span>
      </div>
    </div>
  );
};