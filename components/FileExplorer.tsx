import React, { useState } from 'react';
import { ProjectFile, Language } from '../types';
import { FileCode, FilePlus, Trash2, FileJson, Database } from 'lucide-react';

interface FileExplorerProps {
  files: ProjectFile[];
  activeFileName: string;
  onSelectFile: (fileName: string) => void;
  onCreateFile: (fileName: string, language: Language) => void;
  onDeleteFile: (fileName: string) => void;
  readOnly?: boolean;
}

export const FileExplorer: React.FC<FileExplorerProps> = ({
  files,
  activeFileName,
  onSelectFile,
  onCreateFile,
  onDeleteFile,
  readOnly = false
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newFileName, setNewFileName] = useState('');

  const getFileIcon = (lang: string) => {
    switch (lang) {
      case 'html': return <FileCode className="w-4 h-4 text-orange-400" />;
      case 'css': return <FileCode className="w-4 h-4 text-blue-400" />;
      case 'javascript': return <FileCode className="w-4 h-4 text-yellow-400" />;
      case 'python': return <FileCode className="w-4 h-4 text-blue-500" />;
      case 'sql': return <Database className="w-4 h-4 text-indigo-400" />;
      case 'json': return <FileJson className="w-4 h-4 text-green-400" />;
      case 'c': return <FileCode className="w-4 h-4 text-slate-300" />; // C icon color
      case 'cpp': return <FileCode className="w-4 h-4 text-blue-600" />;
      case 'java': return <FileCode className="w-4 h-4 text-red-400" />;
      default: return <FileCode className="w-4 h-4 text-slate-400" />;
    }
  };

  const getLanguageFromExt = (name: string): Language => {
    if (name.endsWith('.html')) return 'html';
    if (name.endsWith('.css')) return 'css';
    if (name.endsWith('.js')) return 'javascript';
    if (name.endsWith('.py')) return 'python';
    if (name.endsWith('.sql')) return 'sql';
    if (name.endsWith('.java')) return 'java';
    if (name.endsWith('.cpp')) return 'cpp';
    if (name.endsWith('.c')) return 'c';
    return 'javascript'; // default
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newFileName) {
      const lang = getLanguageFromExt(newFileName);
      onCreateFile(newFileName, lang);
      setNewFileName('');
      setIsCreating(false);
    }
  };

  return (
    <div className="w-60 bg-slate-900 border-r border-slate-800 flex flex-col h-full">
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Project Files</span>
        {!readOnly && (
          <button 
            onClick={() => setIsCreating(true)}
            className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-indigo-400 transition-colors"
            title="New File"
          >
            <FilePlus className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        {files.map(file => (
          <div 
            key={file.name}
            onClick={() => onSelectFile(file.name)}
            className={`group flex items-center justify-between px-4 py-2 cursor-pointer text-sm transition-colors ${file.name === activeFileName ? 'bg-indigo-500/10 text-indigo-300 border-r-2 border-indigo-500' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
          >
            <div className="flex items-center space-x-2 truncate">
              {getFileIcon(file.language)}
              <span className="truncate">{file.name}</span>
            </div>
            {!readOnly && files.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteFile(file.name);
                }}
                className="opacity-0 group-hover:opacity-100 p-1 hover:text-rose-400 transition-opacity"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            )}
          </div>
        ))}

        {isCreating && (
          <form onSubmit={handleCreateSubmit} className="px-2 py-2">
            <input
              autoFocus
              type="text"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              onBlur={() => setIsCreating(false)}
              placeholder="filename.js"
              className="w-full bg-slate-950 border border-indigo-500 rounded px-2 py-1 text-xs text-white outline-none"
            />
          </form>
        )}
      </div>
    </div>
  );
};