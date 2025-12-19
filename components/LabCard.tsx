import React from 'react';
import { LabSession } from '../types';
import { Beaker, Clock, ChevronRight, CheckCircle2 } from 'lucide-react';

interface LabCardProps {
  lab: LabSession;
  onClick: (lab: LabSession) => void;
}

export const LabCard: React.FC<LabCardProps> = ({ lab, onClick }) => {
  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'Easy': return 'text-emerald-400 bg-emerald-400/10';
      case 'Medium': return 'text-amber-400 bg-amber-400/10';
      case 'Hard': return 'text-rose-400 bg-rose-400/10';
      default: return 'text-slate-400';
    }
  };

  return (
    <div 
      onClick={() => onClick(lab)}
      className="group relative bg-slate-900 border border-slate-800 rounded-xl p-6 cursor-pointer hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-300"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-indigo-500/10 rounded-lg group-hover:bg-indigo-500/20 transition-colors">
          <Beaker className="w-6 h-6 text-indigo-400" />
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(lab.difficulty)}`}>
          {lab.difficulty}
        </span>
      </div>

      <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-indigo-300 transition-colors">
        {lab.title}
      </h3>
      
      <p className="text-slate-400 text-sm line-clamp-2 mb-4">
        {lab.description}
      </p>

      <div className="flex items-center justify-between text-sm text-slate-500">
        <div className="flex items-center space-x-4">
          <span className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>{lab.duration}</span>
          </span>
          {lab.status === 'completed' && (
            <span className="flex items-center space-x-1 text-emerald-500">
              <CheckCircle2 className="w-4 h-4" />
              <span>Done</span>
            </span>
          )}
        </div>
        <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all text-indigo-400" />
      </div>
    </div>
  );
};