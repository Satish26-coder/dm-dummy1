import React, { useEffect, useState } from 'react';
import { ProjectFile } from '../types';
import { RefreshCw } from 'lucide-react';

interface LivePreviewProps {
  files: ProjectFile[];
  triggerRefresh: number; // Increment to force refresh
}

export const LivePreview: React.FC<LivePreviewProps> = ({ files, triggerRefresh }) => {
  const [srcDoc, setSrcDoc] = useState('');

  useEffect(() => {
    const htmlFile = files.find(f => f.language === 'html')?.content || '';
    const cssFile = files.find(f => f.language === 'css')?.content || '';
    const jsFile = files.find(f => f.language === 'javascript')?.content || '';

    const combinedDoc = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            ${cssFile}
          </style>
        </head>
        <body>
          ${htmlFile}
          <script>
            try {
              ${jsFile}
            } catch (err) {
              console.error(err);
            }
          </script>
        </body>
      </html>
    `;
    setSrcDoc(combinedDoc);
  }, [files, triggerRefresh]);

  return (
    <div className="flex flex-col h-full bg-white rounded-lg overflow-hidden border border-slate-800">
      <div className="bg-slate-100 px-4 py-2 border-b border-slate-200 flex items-center justify-between">
        <span className="text-xs font-bold text-slate-500 uppercase">Live Preview</span>
        <div className="flex space-x-1">
          <div className="w-2 h-2 rounded-full bg-rose-400"></div>
          <div className="w-2 h-2 rounded-full bg-amber-400"></div>
          <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
        </div>
      </div>
      <iframe
        srcDoc={srcDoc}
        title="preview"
        className="flex-1 w-full h-full border-none bg-white"
        sandbox="allow-scripts allow-modals"
      />
    </div>
  );
};
