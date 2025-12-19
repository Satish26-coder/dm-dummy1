import React from 'react';
import { SidebarItem, UserRole } from '../types';
import { LogOut, User, Bell, Search, Menu, Code2 } from 'lucide-react';

interface LayoutProps {
  role: UserRole;
  userName: string;
  sidebarItems: SidebarItem[];
  activeView: string;
  onNavigate: (view: string) => void;
  onLogout: () => void;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({
  role,
  userName,
  sidebarItems,
  activeView,
  onNavigate,
  onLogout,
  children
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  return (
    <div className="flex h-screen bg-slate-950 text-slate-200 font-sans overflow-hidden">
      
      {/* Sidebar */}
      <aside 
        className={`${
          isSidebarOpen ? 'w-64' : 'w-20'
        } bg-slate-900 border-r border-slate-800 flex flex-col transition-all duration-300 z-20 hidden md:flex`}
      >
        {/* Brand */}
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
           <div className="w-8 h-8 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
             <Code2 className="text-white w-5 h-5" />
           </div>
           {isSidebarOpen && (
             <span className="ml-3 font-bold text-lg tracking-tight text-white animate-fadeIn">RB-ILMS</span>
           )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.view)}
              className={`w-full flex items-center px-3 py-3 rounded-lg transition-all duration-200 group ${
                activeView === item.view 
                  ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-600/20 shadow-sm' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
              }`}
              title={!isSidebarOpen ? item.label : ''}
            >
              <item.icon className={`w-5 h-5 flex-shrink-0 ${activeView === item.view ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
              {isSidebarOpen && (
                <span className="ml-3 font-medium text-sm truncate">{item.label}</span>
              )}
            </button>
          ))}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-slate-800">
           <button 
             onClick={onLogout}
             className="w-full flex items-center px-3 py-3 rounded-lg text-slate-400 hover:bg-rose-900/10 hover:text-rose-400 transition-colors"
           >
             <LogOut className="w-5 h-5 flex-shrink-0" />
             {isSidebarOpen && <span className="ml-3 font-medium text-sm">Logout</span>}
           </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        
        {/* Header */}
        <header className="h-16 bg-slate-900/50 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-6 z-10">
           <div className="flex items-center">
             <button 
               onClick={() => setIsSidebarOpen(!isSidebarOpen)}
               className="p-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white mr-4 hidden md:block"
             >
               <Menu className="w-5 h-5" />
             </button>
             <h2 className="text-white font-semibold text-lg hidden sm:block">
               {sidebarItems.find(i => i.view === activeView)?.label || 'Dashboard'}
             </h2>
           </div>

           <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center px-3 py-1.5 bg-slate-800 rounded-full border border-slate-700">
                 <Search className="w-4 h-4 text-slate-500 mr-2" />
                 <input 
                   type="text" 
                   placeholder="Search..." 
                   className="bg-transparent border-none outline-none text-sm text-slate-300 w-32 placeholder-slate-600" 
                 />
              </div>

              <button className="relative p-2 text-slate-400 hover:text-white transition-colors">
                 <Bell className="w-5 h-5" />
                 <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-slate-900"></span>
              </button>
              
              <div className="flex items-center space-x-3 pl-4 border-l border-slate-800">
                 <div className="text-right hidden sm:block">
                    <div className="text-sm font-medium text-white">{userName}</div>
                    <div className="text-xs text-indigo-400 font-medium uppercase">{role.replace('_', ' ')}</div>
                 </div>
                 <div className="w-9 h-9 bg-slate-800 rounded-full border border-slate-700 flex items-center justify-center text-slate-400">
                    <User className="w-5 h-5" />
                 </div>
              </div>
           </div>
        </header>

        {/* Content Scrollable Area */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-6 relative">
           <div className="max-w-7xl mx-auto h-full flex flex-col">
              {children}
           </div>
        </main>

        {/* Footer */}
        <footer className="h-10 bg-slate-950 border-t border-slate-900 flex items-center justify-between px-6 text-[10px] text-slate-600 uppercase tracking-wider">
           <span>RB-ILMS © 2025 | Version 1.0</span>
           <span>Powered by Gemini AI</span>
        </footer>

      </div>
    </div>
  );
};
